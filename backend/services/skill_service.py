"""
skill_service.py
-----------------
Maps raw student input features to normalised skill scores (0–100).

Design decisions:
  - Weights per skill allow tuning without changing downstream logic.
  - Returns a typed dict so callers enjoy IDE completion and type safety.
  - Pure function — no I/O, no side-effects → trivially unit-testable.
"""

from __future__ import annotations
from typing import TypedDict


class SkillScores(TypedDict):
    discipline:    float   # derived from attendance
    consistency:   float   # derived from assignment_completion
    technical:     float   # derived from coding_score
    communication: float   # derived from communication_score
    analytical:    float   # derived from marks + participation composite


# ── Weight tuning table ───────────────────────────────────────────────────────
_ANALYTICAL_MARK_W        = 0.70
_ANALYTICAL_PARTICIPATION_W = 0.30


def analyze_skills(data: dict) -> SkillScores:
    """
    Infer skill scores from a coerced student feature dictionary.

    Parameters
    ----------
    data : dict
        Validated + coerced student features (all values are float 0-100).

    Returns
    -------
    SkillScores
        A dict of skill_name → score (float, 0-100).
    """
    analytical = round(
        _ANALYTICAL_MARK_W         * data["marks"] +
        _ANALYTICAL_PARTICIPATION_W * data["participation"],
        2,
    )

    return SkillScores(
        discipline    = round(data["attendance"], 2),
        consistency   = round(data["assignment_completion"], 2),
        technical     = round(data["coding_score"], 2),
        communication = round(data["communication_score"], 2),
        analytical    = min(100.0, round(analytical, 2)),   # cap at 100
    )
