"""
train.py
--------
Blueprint for POST /train — online/incremental retraining with new data rows.

Flow:
  1. Accept an array of student objects (may include performance_label).
  2. Append to existing students.csv.
  3. Retrain the pipeline on the full (merged) dataset.
  4. Hot-swap the model in app.extensions["model"] without a restart.
  5. Return accuracy of the newly trained model.
"""

import os
import logging
import numpy as np
import pandas as pd

from flask import Blueprint, request, jsonify, current_app
from sklearn.model_selection import train_test_split
from sklearn.metrics         import accuracy_score

from utils.model_utils  import save_model, MODEL_PATH
from utils.validators   import REQUIRED_FIELDS

logger    = logging.getLogger(__name__)
train_bp  = Blueprint("train", __name__)

BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "students.csv")

TARGET_COLS = ["performance_label", "behavior_label", "dropout_risk", "attendance_prediction"]
ALL_COLS  = list(REQUIRED_FIELDS) + TARGET_COLS


def _derive_label(row: pd.Series) -> str:
    """Derive performance_label using the same formula as data_generator.py."""
    composite = (
        0.30 * row["marks"] +
        0.20 * row["attendance"] +
        0.20 * row["assignment_completion"] +
        0.10 * row["participation"] +
        0.10 * row["coding_score"] +
        0.10 * row["communication_score"]
    )
    if composite >= 70:
        return "high"
    elif composite >= 50:
        return "medium"
    return "low"


def _derive_behavior(participation: float, attendance: float) -> str:
    # Mirrors data_generator.py → label_behavior()
    score = 0.6 * participation + 0.4 * attendance
    if score >= 75:
        return "good"
    if score >= 50:
        return "average"
    return "poor"


def _derive_dropout_risk(attendance: float, marks: float) -> str:
    # Mirrors data_generator.py → label_dropout()
    score = 0.7 * (100 - attendance) + 0.3 * (100 - marks)
    if score >= 50:
        return "high"
    if score >= 25:
        return "medium"
    return "low"


def _derive_attendance_prediction(participation: float, marks: float, attendance: float) -> str:
    # Mirrors data_generator.py → label_attendance()
    score = 0.4 * participation + 0.2 * marks + 0.4 * attendance
    if score >= 75:
        return "high"
    if score >= 50:
        return "moderate"
    return "low"


@train_bp.post("/train")
def retrain():
    """
    Retrain the model with optional new data rows appended to the existing CSV.

    Request body (JSON array, optional):
    [
        {
            "marks": 70, "attendance": 80, "assignment_completion": 75,
            "participation": 65, "coding_score": 72, "communication_score": 60,
            "performance_label": "medium"   ← optional
        },
        ...
    ]

    If body is empty or omitted, retrains on the existing CSV only.
    """
    new_rows = request.get_json(silent=True) or []

    # ── Validate & append new rows ────────────────────────────────────────────
    if new_rows:
        if not isinstance(new_rows, list):
            return jsonify({"error": "Request body must be a JSON array."}), 400

        records = []
        for i, row in enumerate(new_rows):
            missing = [f for f in REQUIRED_FIELDS if f not in row]
            if missing:
                return jsonify({
                    "error": f"Row {i} is missing field(s): {', '.join(missing)}"
                }), 400

            # Derive all labels (mirrors data_generator.py); allow caller overrides.
            row_series = pd.Series({f: float(row[f]) for f in REQUIRED_FIELDS})

            marks = float(row_series["marks"])
            attendance = float(row_series["attendance"])
            participation = float(row_series["participation"])

            derived_performance = _derive_label(row_series)
            derived_behavior = _derive_behavior(participation, attendance)
            derived_dropout = _derive_dropout_risk(attendance, marks)
            derived_attendance_pred = _derive_attendance_prediction(participation, marks, attendance)

            records.append({
                # Features (required)
                "marks": marks,
                "attendance": attendance,
                "assignment_completion": float(row_series["assignment_completion"]),
                "participation": participation,
                "coding_score": float(row_series["coding_score"]),
                "communication_score": float(row_series["communication_score"]),
                # Targets (optional input; derived defaults)
                "performance_label": row.get("performance_label") or derived_performance,
                "behavior_label": row.get("behavior_label") or derived_behavior,
                "dropout_risk": row.get("dropout_risk") or derived_dropout,
                "attendance_prediction": row.get("attendance_prediction") or derived_attendance_pred,
            })

        new_df = pd.DataFrame(records)

        # Append to CSV
        if os.path.exists(DATA_PATH):
            existing = pd.read_csv(DATA_PATH)
            merged   = pd.concat([existing, new_df], ignore_index=True)
        else:
            merged = new_df

        merged.to_csv(DATA_PATH, index=False)
        logger.info("Appended %d new rows. Total: %d", len(new_df), len(merged))

    # ── Retrain ───────────────────────────────────────────────────────────────
    if not os.path.exists(DATA_PATH):
        return jsonify({"error": "No training data found. POST rows first or run data_generator.py."}), 400

    df = pd.read_csv(DATA_PATH)
    X  = df[list(REQUIRED_FIELDS)]
    y  = df[TARGET_COLS]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Re-use same pipeline factory from train_model.py
    from models.train_model import build_pipeline
    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)  # (N, 4) array
    accs = []
    for i, _col in enumerate(TARGET_COLS):
        accs.append(accuracy_score(y_test[_col].values, y_pred[:, i]))
    acc = round(float(np.mean(accs)) * 100, 2)

    # ── Hot-swap model (zero-downtime) ────────────────────────────────────────
    current_app.extensions["model"] = pipeline
    save_model(pipeline)

    logger.info("Retrain complete — accuracy: %.2f%%", acc)
    return jsonify({
        "status":        "Model retrained successfully.",
        "new_rows_added": len(new_rows),
        "total_samples":  len(df) + len(new_rows),
        "accuracy_pct":   acc,
    }), 200
