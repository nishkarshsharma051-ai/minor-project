"""
validators.py
-------------
Input validation for student feature payloads.
Keeps validation logic out of route handlers for reusability and testability.
"""

from typing import Tuple, Optional

# ── Constants ─────────────────────────────────────────────────────────────────
REQUIRED_FIELDS: tuple[str, ...] = (
    "marks",
    "attendance",
    "assignment_completion",
    "participation",
    "coding_score",
    "communication_score",
)

_FIELD_RANGE: dict[str, tuple[float, float]] = {
    "marks":                  (0.0, 100.0),
    "attendance":             (0.0, 100.0),
    "assignment_completion":  (0.0, 100.0),
    "participation":          (0.0, 100.0),
    "coding_score":           (0.0, 100.0),
    "communication_score":    (0.0, 100.0),
}


def validate_student_input(data: dict) -> Tuple[bool, Optional[str]]:
    """
    Validate a student feature dictionary.

    Parameters
    ----------
    data : dict
        Raw JSON body from the request.

    Returns
    -------
    (True, None)       – if valid
    (False, str)       – if invalid, with a human-readable error message
    """
    if not isinstance(data, dict):
        return False, "Request body must be a JSON object."

    # Check presence
    missing = [f for f in REQUIRED_FIELDS if f not in data]
    if missing:
        return False, f"Missing required field(s): {', '.join(missing)}"

    # Check types and ranges
    errors: list[str] = []
    for field in REQUIRED_FIELDS:
        value = data[field]
        try:
            value = float(value)
        except (TypeError, ValueError):
            errors.append(f"'{field}' must be a number.")
            continue

        lo, hi = _FIELD_RANGE[field]
        if not (lo <= value <= hi):
            errors.append(f"'{field}' must be between {lo} and {hi}, got {value}.")

    if errors:
        return False, " | ".join(errors)

    return True, None


def coerce_student_input(data: dict) -> dict:
    """
    Return a new dict with all field values coerced to Python floats.
    Call only after validate_student_input returns (True, None).
    """
    return {field: float(data[field]) for field in REQUIRED_FIELDS}
