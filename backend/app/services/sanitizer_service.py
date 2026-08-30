import logging
import re

logger = logging.getLogger(__name__)

# patterns that look like prompt injection attempts
INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?previous\s+instructions",
    r"disregard\s+(all\s+)?prior",
    r"system\s*:",
    r"you\s+are\s+now",
    r"new\s+instructions\s*:",
    r"forget\s+everything",
    r"override\s+instructions",
    r"act\s+as\s+(if\s+you\s+are\s+)?",
    r"jailbreak",
    r"do\s+not\s+follow",
]

_compiled = [re.compile(p, re.IGNORECASE) for p in INJECTION_PATTERNS]


def sanitize_text(text: str) -> tuple[str, list[str]]:
    """
    Strip suspicious instruction-like content from untrusted uploads.
    Returns cleaned text + list of flagged patterns found.
    """
    flagged: list[str] = []
    cleaned = text

    for pattern in _compiled:
        matches = pattern.findall(cleaned)
        if matches:
            flagged.append(pattern.pattern)
            cleaned = pattern.sub("[REDACTED]", cleaned)

    if flagged:
        logger.warning("Sanitizer flagged %d injection pattern(s): %s", len(flagged), flagged)

    return cleaned.strip(), flagged
