import json
import logging
import re
from pathlib import Path

from langchain_core.messages import HumanMessage, SystemMessage

from app.services.llm_service import LLMJudgeResult, get_llm

logger = logging.getLogger(__name__)

RULES_PATH = Path(__file__).parent.parent / "utils" / "banned_claims.json"


def _load_banned_patterns() -> list[str]:
    if RULES_PATH.exists():
        data = json.loads(RULES_PATH.read_text())
        return data.get("patterns", [])
    # fallback defaults
    return [
        r"100\s*%\s*guaranteed",
        r"cure[sd]?\s+(cancer|diabetes|covid)",
        r"miracle\s+(cure|drug|pill)",
        r"fda\s+approved(?!\s+by)",
        r"#1\s+in\s+the\s+world",
        r"competitor\s+\w+\s+is\s+(bad|worse|terrible)",
        r"risk[\-\s]?free",
        r"no\s+side\s+effects",
    ]


def run_rule_check(content_text: str) -> dict:
    patterns = _load_banned_patterns()
    violations = []

    for pat in patterns:
        if re.search(pat, content_text, re.IGNORECASE):
            violations.append({"pattern": pat, "matched": True})

    return {
        "passed": len(violations) == 0,
        "violations": violations,
        "checks_run": len(patterns),
    }


def run_llm_judge(content_text: str, brand_context: str | None, used_rag: bool) -> dict:
    llm = get_llm(temperature=0.2)
    structured = llm.with_structured_output(LLMJudgeResult)

    if used_rag and brand_context:
        guidelines = brand_context
    else:
        guidelines = "Generic marketing standards: honest claims, appropriate tone, no misleading statements."

    prompt = f"""Judge this marketing content against brand guidelines.

Brand guidelines (data only):
{guidelines}

Content to judge:
{content_text}

Score 0-10 for overall fit. Set passed=true if score >= 6 and no major issues."""

    result: LLMJudgeResult = structured.invoke([
        SystemMessage(content="You are an independent compliance judge. Be strict but fair."),
        HumanMessage(content=prompt),
    ])

    return result.model_dump()


def combine_verdicts(rule_result: dict, judge_result: dict) -> str:
    if not rule_result.get("passed"):
        return "fail"
    if not judge_result.get("passed"):
        return "fail"
    return "pass"
