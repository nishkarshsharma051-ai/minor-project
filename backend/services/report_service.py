"""
report_service.py
-----------------
Generates downloadable PDF and CSV reports containing student input,
prediction, skill scores, and insights.

Libraries:
  - reportlab : PDF generation (no external binary required)
  - pandas    : CSV serialisation
"""

from __future__ import annotations
import io
from datetime import datetime

import pandas as pd
from reportlab.lib            import colors
from reportlab.lib.pagesizes  import A4
from reportlab.lib.styles     import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units      import cm
from reportlab.platypus       import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)


# ── Colour palette ────────────────────────────────────────────────────────────
PRIMARY   = colors.HexColor("#1a73e8")
SECONDARY = colors.HexColor("#34a853")
WARNING   = colors.HexColor("#ea4335")
LIGHT_BG  = colors.HexColor("#f8f9fa")
DARK_TXT  = colors.HexColor("#202124")


# ── Styles (cached) ───────────────────────────────────────────────────────────
_STYLES = getSampleStyleSheet()

_TITLE_STYLE = ParagraphStyle(
    "Title", fontSize=22, textColor=PRIMARY, spaceAfter=6,
    fontName="Helvetica-Bold",
)
_SUBTITLE_STYLE = ParagraphStyle(
    "Subtitle", fontSize=11, textColor=colors.grey, spaceAfter=20,
    fontName="Helvetica",
)
_SECTION_STYLE = ParagraphStyle(
    "Section", fontSize=13, textColor=PRIMARY, spaceBefore=14, spaceAfter=6,
    fontName="Helvetica-Bold",
)
_BODY_STYLE = ParagraphStyle(
    "Body", fontSize=10, textColor=DARK_TXT, spaceAfter=4,
    fontName="Helvetica",
)
_BULLET_STYLE = ParagraphStyle(
    "Bullet", fontSize=10, textColor=DARK_TXT, spaceAfter=3,
    leftIndent=14, fontName="Helvetica",
)


def _prediction_color(prediction: str) -> colors.Color:
    return {"high": SECONDARY, "medium": PRIMARY, "low": WARNING}.get(
        prediction.lower(), DARK_TXT
    )


def generate_pdf_report(
    data:       dict,
    prediction: str,
    skills:     dict,
    insights:   dict,
) -> io.BytesIO:
    """
    Build a formatted A4 PDF report and return it as a BytesIO buffer.

    Parameters
    ----------
    data       : Coerced student features.
    prediction : Predicted performance label ('low'|'medium'|'high').
    skills     : Skill score dict from skill_service.
    insights   : Insight dict from insight_service.

    Returns
    -------
    io.BytesIO  – ready to send as a file response.
    """
    buffer = io.BytesIO()
    doc    = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm,
    )
    story   = []
    ts      = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # ── Header ────────────────────────────────────────────────────────────────
    story.append(Paragraph("Student Performance Report", _TITLE_STYLE))
    student_name = data.get("student_name", "Anonymous Student")
    story.append(Paragraph(f"Student: {student_name}", _SECTION_STYLE))
    story.append(Paragraph(f"Generated: {ts}", _SUBTITLE_STYLE))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY))
    story.append(Spacer(1, 12))

    # ── Prediction badge ──────────────────────────────────────────────────────
    pred_color = _prediction_color(prediction)
    story.append(Paragraph("Prediction", _SECTION_STYLE))
    pred_table = Table(
        [[Paragraph(prediction.upper(), ParagraphStyle(
            "Pred", fontSize=14, textColor=colors.white,
            fontName="Helvetica-Bold", alignment=1,
        ))]],
        colWidths=[6*cm],
    )
    pred_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), pred_color),
        ("ROUNDEDCORNERS", [4]),
        ("TOPPADDING",    (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(pred_table)
    story.append(Spacer(1, 12))

    # ── Advanced Predictions ──────────────────────────────────────────────────
    story.append(Paragraph("Behaviour & Risk Analysis", _SECTION_STYLE))
    adv_rows = [
        ["Metric", "Prediction"],
        ["Behaviour Score", insights.get("behavior", "N/A").capitalize()],
        ["Dropout Risk",    insights.get("dropout", "N/A").capitalize()],
        ["Attendance Trend", insights.get("attendance_pred", "N/A").capitalize()],
    ]
    adv_table = Table(adv_rows, colWidths=[9*cm, 4*cm])
    adv_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), WARNING if insights.get("dropout") == "high" else SECONDARY),
        ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN",         (1, 0), (1, -1), "CENTER"),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [LIGHT_BG, colors.white]),
        ("GRID",          (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("FONTSIZE",      (0, 0), (-1, -1), 10),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(adv_table)
    story.append(Spacer(1, 12))

    # ── Input data ────────────────────────────────────────────────────────────
    story.append(Paragraph("Input Features", _SECTION_STYLE))
    feature_rows = [["Feature", "Score"]] + [
        [k.replace("_", " ").title(), f"{float(v):.1f}"] for k, v in data.items() if k != "student_name"
    ]
    ft = Table(feature_rows, colWidths=[9*cm, 4*cm])
    ft.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN",         (1, 0), (1, -1), "CENTER"),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [LIGHT_BG, colors.white]),
        ("GRID",          (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("FONTSIZE",      (0, 0), (-1, -1), 10),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(ft)
    story.append(Spacer(1, 12))

    # ── Skill scores ──────────────────────────────────────────────────────────
    story.append(Paragraph("Skill Analysis", _SECTION_STYLE))
    skill_rows = [["Skill", "Score (0–100)"]] + [
        [k.replace("_", " ").title(), f"{v:.1f}"] for k, v in skills.items()
    ]
    st = Table(skill_rows, colWidths=[9*cm, 4*cm])
    st.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), SECONDARY),
        ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN",         (1, 0), (1, -1), "CENTER"),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [LIGHT_BG, colors.white]),
        ("GRID",          (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("FONTSIZE",      (0, 0), (-1, -1), 10),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(st)
    story.append(Spacer(1, 12))

    # ── Insights ──────────────────────────────────────────────────────────────
    story.append(Paragraph("Insights", _SECTION_STYLE))
    story.append(Paragraph(f"<b>Summary:</b> {insights['summary']}", _BODY_STYLE))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"<b>Risk Assessment:</b> {insights['risk']}", _BODY_STYLE))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Strengths:</b>", _BODY_STYLE))
    for s in insights.get("strengths", []):
        story.append(Paragraph(f"• {s}", _BULLET_STYLE))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Improvement Suggestions:</b>", _BODY_STYLE))
    for s in insights.get("suggestions", []):
        story.append(Paragraph(f"• {s}", _BULLET_STYLE))

    # ── Build ─────────────────────────────────────────────────────────────────
    doc.build(story)
    buffer.seek(0)
    return buffer


def generate_csv_report(
    data:       dict,
    prediction: str,
    skills:     dict,
    insights:   dict,
) -> io.BytesIO:
    """
    Build a multi-section CSV report and return it as a BytesIO buffer.
    """
    rows: list[dict] = []

    # Section 1 – Student Information
    student_name = data.get("student_name", "Anonymous Student")
    rows.append({"Section": "Student Info", "Key": "Student Name", "Value": student_name})

    # Section 2 – Input features
    for k, v in data.items():
        if k != "student_name":
            rows.append({"Section": "Input", "Key": k.replace("_", " ").title(), "Value": v})

    # Section 2 – Prediction
    rows.append({"Section": "Prediction", "Key": "Performance Level", "Value": prediction.capitalize()})

    # Section 3 – Skills
    for k, v in skills.items():
        rows.append({"Section": "Skills", "Key": k.replace("_", " ").title(), "Value": v})

    # Section 4 – Insights
    rows.append({"Section": "Insights", "Key": "Summary",         "Value": insights["summary"]})
    rows.append({"Section": "Insights", "Key": "Risk Assessment", "Value": insights["risk"]})
    rows.append({"Section": "Insights", "Key": "Strengths",       "Value": " | ".join(insights.get("strengths", []))})
    rows.append({"Section": "Insights", "Key": "Suggestions",     "Value": " | ".join(insights.get("suggestions", []))})

    buffer = io.BytesIO()
    pd.DataFrame(rows).to_csv(buffer, index=False)
    buffer.seek(0)
    return buffer
