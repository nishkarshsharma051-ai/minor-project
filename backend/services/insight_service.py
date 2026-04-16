"""
insight_service.py
------------------
Rule-based engine that converts raw student data, a prediction label, and
skill scores into structured, human-readable insights.

Why rule-based and not another ML model?
  - Fully deterministic → easy to audit, test, and extend.
  - No extra training data required.
  - Outputs are always explainable to end-users.
"""

from __future__ import annotations
from dataclasses import dataclass, asdict
from typing import Literal
from datetime import datetime

# ── Thresholds (single source of truth) ──────────────────────────────────────
WEAK_THRESHOLD   = 50.0   # below this = needs attention
STRONG_THRESHOLD = 75.0   # above this = strong

# ── Human-readable field labels ───────────────────────────────────────────────
_FIELD_LABEL: dict[str, str] = {
    "marks":                 "Academic Marks",
    "attendance":            "Attendance",
    "assignment_completion": "Assignment Completion",
    "participation":         "Class Participation",
    "coding_score":          "Coding Score",
    "communication_score":   "Communication Score",
}

_SUGGESTIONS: dict[str, str] = {
    "marks":                 "Focus on revising core subjects and practice past-year exam questions.",
    "attendance":            "Regular attendance is critical — aim for at least 75% to stay on track.",
    "assignment_completion": "Complete all assignments on time; consistency builds examination confidence.",
    "participation":         "Active participation in discussions deepens conceptual understanding.",
    "coding_score":          "Daily coding practice on platforms like LeetCode or HackerRank will accelerate improvement.",
    "communication_score":   "Join a debate club or take part in group presentations to sharpen communication.",
}


@dataclass
class Insights:
    summary:     str
    risk:        str
    suggestions: list[str]
    strengths:   list[str]


def generate_insights(
    data:            dict,
    prediction:      Literal["low", "medium", "high"],
    skills:          dict,
    behavior:        str = "N/A",
    dropout:         str = "N/A",
    attendance_pred: str = "N/A",
) -> dict:
    """
    Build structured insights from student data and model prediction.

    Parameters
    ----------
    data            : Validated, coerced student feature dict.
    prediction      : The predicted performance label.
    skills          : Output of skill_service.analyze_skills().
    behavior        : Predicted behavior label.
    dropout         : Predicted dropout risk.
    attendance_pred : Predicted attendance trend.

    Returns
    -------
    dict  – serialisable Insights dataclass.
    """
    pred_display = prediction.capitalize()

    # ── Summary ───────────────────────────────────────────────────────────────
    summary_map = {
        "high":   f"Student is performing at a {pred_display} level. "
                  f"Behaviour is {behavior.lower()} and dropout risk is {dropout.lower()}.",
        "medium": f"Student is at a {pred_display} performance level. "
                  f"Attendance trend is {attendance_pred.lower()}.",
        "low":    f"⚠️  Student is currently at a {pred_display} performance level. "
                  f"CRITICAL: Dropout risk is {dropout.upper()} and behavior is {behavior.lower()}.",
    }
    summary = summary_map.get(prediction, f"Performance level: {pred_display}.")

    # ── Risk detection ────────────────────────────────────────────────────────
    weak_fields = [f for f in _FIELD_LABEL if data.get(f, 100) < WEAK_THRESHOLD]
    if dropout.lower() == "high" or prediction == "low":
        risk = (
            f"HIGH RISK: Student is at significant risk (Dropout: {dropout.upper()}). "
            f"Immediate intervention required in: {', '.join(_FIELD_LABEL[f] for f in weak_fields) or 'overall metrics'}."
        )
    elif dropout.lower() == "medium" or weak_fields:
        risk = (
            f"MODERATE RISK: Potential issues detected. "
            f"Behavior is {behavior.lower()} and attendance trend is {attendance_pred.lower()}."
        )
    else:
        risk = "LOW RISK: Stable trajectory. Behavior and attendance metrics are positive."

    # ── Improvement suggestions ───────────────────────────────────────────────
    suggestions = [_SUGGESTIONS[f] for f in weak_fields]
    if dropout.lower() != "low":
        suggestions.append("Schedule a one-on-one counseling session to address dropout triggers.")
    if behavior.lower() == "poor":
        suggestions.append("Engage with the student to understand factors affecting classroom behavior.")
    
    if not suggestions:
        suggestions = ["Maintain current performance and explore advanced elective topics."]

    # ── Strengths ─────────────────────────────────────────────────────────────
    strong_fields = [f for f in _FIELD_LABEL if data.get(f, 0) >= STRONG_THRESHOLD]
    strengths = [f"Strong {_FIELD_LABEL[f]}" for f in strong_fields]
    if behavior.lower() == "good":
        strengths.append("Excellent classroom behavior and etiquette.")
    
    if not strengths:
        strengths = ["Consistent effort across all evaluated areas."]

    return asdict(Insights(
        summary     = summary,
        risk        = risk,
        suggestions = suggestions,
        strengths   = strengths,
    ))


def generate_institutional_insights(metrics: dict) -> dict:
    """
    Generate a summary of institutional health based on aggregate metrics.
    """
    perf = metrics.get("institutionalPerformance", 0)
    att = metrics.get("avgAttendance", 0)
    ret = metrics.get("retentionRate", 0)
    
    summary = f"Overall institutional performance is at {perf}%. "
    if perf >= 80:
        summary += "The cohort is exhibiting exceptional academic proficiency and engagement."
    elif perf >= 60:
        summary += "Performance is currently stable, maintaining a baseline of consistent learning outcomes."
    else:
        summary += "⚠️  Alert: Performance metrics have dipped below the target threshold. Immediate review of curriculum delivery is advised."
        
    focus_areas = []
    if att < 75:
        focus_areas.append("Low attendance levels detected: Implement outreach for disengaged students.")
    if ret < 90:
        focus_areas.append("Retention trends are fluctuating: Strengthening student support and counseling is recommended.")
    if perf < 60:
        focus_areas.append("Academic performance bottleneck: Consider introducing peer-assisted learning sessions.")
        
    if not focus_areas:
        focus_areas.append("Stable trajectory: Maintain current standards while diversifying elective offerings.")
        
    return {
        "summary":     summary,
        "focus_areas": focus_areas,
        "timestamp":   datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

