"""
download.py
-----------
Blueprint for GET /download-report.

Accepts student features as query parameters, runs the full prediction +
skill + insight pipeline, then returns either a PDF or CSV file download.

Query params:
    format               : "pdf" (default) | "csv"
    marks                : float 0-100
    attendance           : float 0-100
    assignment_completion: float 0-100
    participation        : float 0-100
    coding_score         : float 0-100
    communication_score  : float 0-100
"""

import io
import numpy as np
from flask import Blueprint, request, jsonify, send_file, current_app

from utils.validators         import validate_student_input, coerce_student_input
from services.skill_service   import analyze_skills
from services.insight_service import generate_insights
from services.report_service  import generate_pdf_report, generate_csv_report

download_bp  = Blueprint("download", __name__)

FEATURE_ORDER = [
    "marks", "attendance", "assignment_completion",
    "participation", "coding_score", "communication_score",
]


@download_bp.get("/download-report")
def download_report():
    """
    Download a student performance report as PDF or CSV.

    Example:
        GET /download-report?format=pdf&marks=85&attendance=90&
            assignment_completion=80&participation=75&
            coding_score=88&communication_score=70
    """
    fmt  = request.args.get("format", "pdf").lower()
    if fmt not in ("pdf", "csv"):
        return jsonify({"error": "Invalid format. Use 'pdf' or 'csv'."}), 400

    # Build a dict from query params for validation reuse
    raw = {f: request.args.get(f) for f in FEATURE_ORDER}
    if "student_name" in request.args:
        raw["student_name"] = request.args.get("student_name")

    ok, err = validate_student_input(raw)
    if not ok:
        return jsonify({"error": err}), 400

    data = coerce_student_input(raw)

    # ── Run prediction pipeline ───────────────────────────────────────────────
    model  = current_app.extensions["model"]
    X      = np.array([[data[f] for f in FEATURE_ORDER]])
    preds  = model.predict(X)[0]
    
    label_perf    = preds[0]
    label_behav   = preds[1]
    label_dropout = preds[2]
    label_att     = preds[3]

    skills   = analyze_skills(data)
    insights = generate_insights(
        data, 
        label_perf, 
        skills, 
        behavior=label_behav, 
        dropout=label_dropout, 
        attendance_pred=label_att
    )

    # ── Generate file ─────────────────────────────────────────────────────────
    if fmt == "pdf":
        buffer   = generate_pdf_report(data, label_perf, skills, insights)
        mimetype = "application/pdf"
        filename = "student_performance_report.pdf"
    else:
        buffer   = generate_csv_report(data, label_perf, skills, insights)
        mimetype = "text/csv"
        filename = "student_performance_report.csv"

    return send_file(
        buffer,
        mimetype=mimetype,
        as_attachment=True,
        download_name=filename,
    )
