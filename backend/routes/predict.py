"""
predict.py
----------
Blueprint for POST /predict.

Flow:
  1. Parse & validate JSON body.
  2. Run prediction via the loaded model pipeline.
  3. Analyse skills.
  4. Generate insights.
  5. Return unified JSON response.

The model is accessed from app.extensions["model"] to avoid global state
and to enable easy mocking in tests.
"""

import numpy as np
from flask import Blueprint, request, jsonify, current_app

from utils.validators   import validate_student_input, coerce_student_input
from services.skill_service   import analyze_skills
from services.insight_service import generate_insights

predict_bp = Blueprint("predict", __name__)

# ── Feature order must match the training column order ────────────────────────
FEATURE_ORDER = [
    "marks",
    "attendance",
    "assignment_completion",
    "participation",
    "coding_score",
    "communication_score",
]


@predict_bp.post("/predict")
def predict():
    """
    Predict student performance and return skills + insights.

    Request body (JSON):
    {
        "marks": 85,
        "attendance": 90,
        "assignment_completion": 80,
        "participation": 75,
        "coding_score": 88,
        "communication_score": 70
    }

    Response 200:
    {
        "prediction": "High",
        "skills": { ... },
        "insight": { "summary": "...", "risk": "...", "suggestions": [...], "strengths": [...] }
    }
    """
    body = request.get_json(silent=True)

    # ── Validation ────────────────────────────────────────────────────────────
    ok, err = validate_student_input(body)
    if not ok:
        return jsonify({"error": err}), 400

    data = coerce_student_input(body)

    # ── Prediction ────────────────────────────────────────────────────────────
    model   = current_app.extensions["model"]
    X       = np.array([[data[f] for f in FEATURE_ORDER]])
    
    # In multi-output, predict() returns (1, 4) and predict_proba() returns list of 4 arrays
    preds   = model.predict(X)[0]        # [perf, behavior, dropout, attendance]
    probas  = model.predict_proba(X)     # list of arrays
    classes = model.classes_             # list of arrays

    # Unpack labels
    label_perf    = preds[0]
    label_behav   = preds[1]
    label_dropout = preds[2]
    label_att     = preds[3]

    # Build confidence dict for performance (primary metric)
    perf_proba   = probas[0][0]
    perf_classes = classes[0]
    confidence   = {cls: round(float(p) * 100, 2) for cls, p in zip(perf_classes, perf_proba)}

    # ── Services ──────────────────────────────────────────────────────────────
    skills   = analyze_skills(data)
    insights = generate_insights(
        data, 
        label_perf, 
        skills, 
        behavior=label_behav, 
        dropout=label_dropout, 
        attendance_pred=label_att
    )

    return jsonify({
        "prediction":           label_perf.capitalize(),
        "behavior":             label_behav.capitalize(),
        "dropout_risk":         label_dropout.capitalize(),
        "predicted_attendance": label_att.capitalize(),
        "confidence":           confidence,
        "skills":               skills,
        "insight":              insights,
    }), 200
