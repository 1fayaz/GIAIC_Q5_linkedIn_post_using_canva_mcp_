"""
Deterministic skills engine for the Agent Factory LinkedIn content workflow.

This module encodes the rules from the three skill files under /skills as pure
Python (no LLM call required). Each function is self-contained and reusable for
any input topic or brand:

  - linkedin_post_skill      -> build_linkedin_post()
  - design_optimization_skill -> build_design_brief()
  - master_prompt_skill       -> build_content_package()

The output mirrors what the markdown skills specify in their ## Outputs sections.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal, Optional

Goal = Literal["engagement", "lead_generation", "brand_awareness"]
Tone = Literal["professional", "conversational", "thought_leadership", "founder_voice"]
AssetType = Literal["single_image", "carousel", "video_cover"]


# ---------------------------------------------------------------------------
# linkedin_post_skill
# ---------------------------------------------------------------------------

HOOK_PATTERNS = {
    "contrarian": "Most {topic} advice gets this backwards.",
    "bold_stat": "We changed our approach to {topic} — and the results surprised us.",
    "vulnerability": "I got {topic} wrong for longer than I'd like to admit.",
    "question": "What if everything you believe about {topic} is only half true?",
    "specificity": "It was the smallest detail in {topic} that changed everything.",
}

TONE_DEFAULTS = {
    "professional": "measured, credible, precise",
    "conversational": "warm, direct, peer-to-peer",
    "thought_leadership": "confident, opinionated, point-of-view driven",
    "founder_voice": "first-person, candid, story-driven",
}

CTA_BY_GOAL = {
    "engagement": "What would you do differently? 👇",
    "lead_generation": "I put the full breakdown in the comments — grab it there.",
    "brand_awareness": "Repost ♻️ if this is worth sharing, and follow for more.",
}


def _infer_tone(audience: str, tone: Optional[str]) -> Tone:
    if tone in TONE_DEFAULTS:
        return tone  # type: ignore[return-value]
    a = (audience or "").lower()
    if any(w in a for w in ("founder", "startup", "entrepreneur")):
        return "founder_voice"
    if any(w in a for w in ("executive", "enterprise", "director", "cto", "ceo")):
        return "professional"
    if any(w in a for w in ("leader", "manager", "head of")):
        return "thought_leadership"
    return "conversational"


def _pick_hook(tone: Tone, goal: Goal, proof_points: Optional[str]) -> str:
    if proof_points:
        return "bold_stat"
    if tone == "founder_voice":
        return "vulnerability"
    if tone == "thought_leadership":
        return "contrarian"
    if goal == "engagement":
        return "question"
    return "specificity"


@dataclass
class LinkedInPost:
    body: str
    tone: str
    hook_pattern: str
    goal: str
    hashtags: list[str]
    assumptions: list[str] = field(default_factory=list)


def _hashtags_for(topic: str) -> list[str]:
    """Return 3-5 tags: a mix of broad + niche, CamelCased, deduped."""
    words = [w for w in "".join(c if c.isalnum() else " " for c in topic).split() if len(w) > 2]
    niche = "".join(w.capitalize() for w in words[:3]) or "Insights"
    broad = ["Leadership", "Growth", "Strategy"]
    tags = ["#" + niche, "#ProfessionalDevelopment"] + ["#" + b for b in broad[:2]]
    # dedupe preserving order, cap at 5
    seen: list[str] = []
    for t in tags:
        if t not in seen:
            seen.append(t)
    return seen[:4]


def build_linkedin_post(
    topic: str,
    audience: str,
    goal: Goal = "engagement",
    tone: Optional[str] = None,
    brand_name: Optional[str] = None,
    key_message: Optional[str] = None,
    proof_points: Optional[str] = None,
) -> LinkedInPost:
    """Apply linkedin_post_skill rules deterministically."""
    assumptions: list[str] = []

    chosen_tone = _infer_tone(audience, tone)
    if tone not in TONE_DEFAULTS:
        assumptions.append(f"Tone inferred as '{chosen_tone}' from audience '{audience}'.")

    hook_key = _pick_hook(chosen_tone, goal, proof_points)
    hook_line = HOOK_PATTERNS[hook_key].format(topic=topic)

    takeaway = key_message or f"the real lesson in {topic} is to start before you feel ready"
    proof = proof_points or "the change paid off faster than we expected"

    # Narrative arc: setup -> tension -> insight -> resolution -> lesson
    body = "\n\n".join(
        [
            hook_line,
            f"Here's the setup: most people approach {topic} on autopilot, and so did we.",
            f"The tension showed up fast — what we assumed would work simply didn't, and "
            f"it cost us time and momentum.",
            f"The turn came when we stopped guessing and looked at what {audience} actually "
            f"needed. One insight reframed the whole problem.",
            f"The resolution: {proof}.",
            f"The lesson — {takeaway}.",
            CTA_BY_GOAL[goal],
        ]
    )

    hashtags = _hashtags_for(topic)
    body_with_tags = body + "\n\n" + " ".join(hashtags)

    if brand_name:
        assumptions.append(f"Brand voice anchored to '{brand_name}'.")
    if not key_message:
        assumptions.append("key_message inferred (none provided).")
    if not proof_points:
        assumptions.append("proof_points are generic placeholders (none provided).")

    return LinkedInPost(
        body=body_with_tags,
        tone=chosen_tone,
        hook_pattern=hook_key,
        goal=goal,
        hashtags=hashtags,
        assumptions=assumptions,
    )


# ---------------------------------------------------------------------------
# design_optimization_skill
# ---------------------------------------------------------------------------

CANVAS_SIZES = {
    "single_image": "1080 x 1350 px (portrait)",
    "carousel": "1080 x 1080 px square pages (multi-page PDF)",
    "video_cover": "1920 x 1080 px (16:9)",
}

# Machine-readable pixel dimensions used by the in-app image renderer.
CANVAS_DIMS = {
    "single_image": {"width": 1080, "height": 1350},
    "carousel": {"width": 1080, "height": 1080},
    "video_cover": {"width": 1920, "height": 1080},
}

# tone -> visual mood mapping (used by master skill handoff)
TONE_TO_MOOD = {
    "founder_voice": "warm, human, honest",
    "thought_leadership": "bold, confident, high-contrast",
    "professional": "clean, restrained, corporate",
    "conversational": "approachable, modern, friendly",
}

PALETTES = {
    "warm, human, honest": {"primary": "#1B2A4A", "secondary": "#F5F1EA", "accent": "#E8743B"},
    "bold, confident, high-contrast": {"primary": "#0A2540", "secondary": "#FFFFFF", "accent": "#5B8DEF"},
    "clean, restrained, corporate": {"primary": "#14213D", "secondary": "#FFFFFF", "accent": "#3A86FF"},
    "approachable, modern, friendly": {"primary": "#22223B", "secondary": "#F2E9E4", "accent": "#FF6B6B"},
}


@dataclass
class DesignBrief:
    asset_type: str
    canvas_size: str
    mood: str
    typography: list[dict]
    palette: dict
    layout: list[str]
    canva_notes: list[str]
    # Fields that power the in-app image renderer:
    dimensions: dict = field(default_factory=dict)
    headline: str = ""
    subhead: str = ""
    slides: list[dict] = field(default_factory=list)
    assumptions: list[str] = field(default_factory=list)


def _title_case(text: str) -> str:
    """Headline-style casing that keeps short connector words lowercase."""
    small = {"a", "an", "the", "and", "or", "for", "to", "of", "in", "on", "vs"}
    words = text.split()
    out = []
    for i, w in enumerate(words):
        out.append(w if (w.lower() in small and i != 0) else w[:1].upper() + w[1:])
    return " ".join(out)


def _build_slides(topic: str, asset_type: str, slide_count: int) -> list[dict]:
    """Generate concise per-slide cover/body/cta text for the renderer."""
    headline = _title_case(topic)
    if asset_type != "carousel":
        return [{"kind": "cover", "title": headline, "body": ""}]

    n = max(3, min(slide_count, 8))
    slides = [{"kind": "cover", "title": headline, "body": ""}]
    middles = [
        {"kind": "point", "title": "The problem", "body": f"Most people approach {topic} on autopilot."},
        {"kind": "point", "title": "The shift", "body": "Stop guessing. Look at what your audience actually needs."},
        {"kind": "point", "title": "The insight", "body": "One reframing changes the whole approach."},
        {"kind": "point", "title": "The payoff", "body": "Better results, faster — and repeatable."},
    ]
    # Fit middle slides between the cover and the CTA slide.
    needed = n - 2
    for i in range(needed):
        slides.append(middles[i % len(middles)])
    slides.append({"kind": "cta", "title": "Your turn", "body": "Which part will you try first?"})
    return slides


def build_design_brief(
    topic: str,
    asset_type: AssetType = "single_image",
    mood: Optional[str] = None,
    brand_colors: Optional[dict] = None,
    slide_count: int = 6,
) -> DesignBrief:
    """Apply design_optimization_skill rules deterministically."""
    assumptions: list[str] = []

    chosen_mood = mood or "bold, confident, high-contrast"
    if not mood:
        assumptions.append("Mood defaulted to 'bold, confident, high-contrast' (none provided).")

    palette = brand_colors or PALETTES.get(chosen_mood, PALETTES["bold, confident, high-contrast"])
    if not brand_colors:
        assumptions.append("Color palette inferred (no brand colors provided).")

    typography = [
        {"element": "Headline", "font": "Montserrat (geometric sans)", "size": "88 px", "weight": "Bold"},
        {"element": "Subhead", "font": "Montserrat", "size": "48 px", "weight": "Medium"},
        {"element": "Body", "font": "Inter (humanist sans)", "size": "32 px", "weight": "Regular"},
    ]

    layout = [
        "Thirds grid; focal point on a thirds intersection, not dead center.",
        "Generous margins (>= 8% of canvas on each edge); keep white space.",
        "One clear focal point per asset (headline or single image).",
        "Single-image text ratio <= 30-40% of canvas.",
    ]
    if asset_type == "carousel":
        layout.append(
            f"Carousel ({slide_count} slides): slide 1 = hook cover (headline only); "
            f"middle slides = one point each, consistent layout; final slide = recap + CTA; "
            f"fixed bottom-right slide-number indicator."
        )

    canva_notes = [
        f"Start a blank Canva design at {CANVAS_SIZES[asset_type]}.",
        f"Set brand colors as a Brand Kit: primary {palette['primary']}, "
        f"secondary {palette['secondary']}, accent {palette['accent']} (60/30/10).",
        "Lock the Montserrat (headline) / Inter (body) font pairing.",
        "Build a master slide, then duplicate for consistency across the set.",
        "Name layers: bg/ headline/ subhead/ body/ accent-shape/ logo/ cta/ ; prefix carousel slides s1_, s2_…",
        "Export single images as PNG/JPG; export carousels as multi-page PDF.",
    ]

    headline = _title_case(topic)
    subhead = {
        "single_image": "A LinkedIn-ready visual",
        "carousel": "Swipe to see how →",
        "video_cover": "Watch the full breakdown",
    }[asset_type]
    slides = _build_slides(topic, asset_type, slide_count)

    return DesignBrief(
        asset_type=asset_type,
        canvas_size=CANVAS_SIZES[asset_type],
        mood=chosen_mood,
        typography=typography,
        palette=palette,
        layout=layout,
        canva_notes=canva_notes,
        dimensions=CANVAS_DIMS[asset_type],
        headline=headline,
        subhead=subhead,
        slides=slides,
        assumptions=assumptions,
    )


# ---------------------------------------------------------------------------
# master_prompt_skill (orchestration)
# ---------------------------------------------------------------------------

@dataclass
class ContentPackage:
    topic: str
    post: LinkedInPost
    brief: DesignBrief
    pairing_rationale: str
    canva_query: str
    assumptions: list[str]


def _build_canva_query(topic: str, brief: DesignBrief, post: LinkedInPost) -> str:
    """A ready-to-use prompt for Canva's generate-design / Magic Design."""
    p = brief.palette
    return (
        f"Create a {brief.asset_type.replace('_', ' ')} for LinkedIn about '{topic}'. "
        f"Canvas {brief.canvas_size}. Mood: {brief.mood}. "
        f"Palette: primary {p['primary']}, secondary {p['secondary']}, accent {p['accent']} "
        f"(accent highlights key words). Montserrat Bold headlines, Inter body. "
        f"Generous white space, one idea per slide, slide numbers bottom-right."
    )


def build_content_package(
    topic: str,
    audience: str,
    asset_type: AssetType = "single_image",
    goal: Goal = "engagement",
    tone: Optional[str] = None,
    brand_name: Optional[str] = None,
    key_message: Optional[str] = None,
    proof_points: Optional[str] = None,
    brand_colors: Optional[dict] = None,
) -> ContentPackage:
    """Orchestrate post + matching brief per master_prompt_skill."""
    post = build_linkedin_post(
        topic=topic,
        audience=audience,
        goal=goal,
        tone=tone,
        brand_name=brand_name,
        key_message=key_message,
        proof_points=proof_points,
    )

    mood = TONE_TO_MOOD.get(post.tone, "bold, confident, high-contrast")
    brief = build_design_brief(
        topic=topic,
        asset_type=asset_type,
        mood=mood,
        brand_colors=brand_colors,
    )

    rationale = (
        f"The '{post.hook_pattern}' hook sets a clear emotional frame, so the visual adopts a "
        f"'{brief.mood}' palette ({brief.palette['accent']} accent) that points the reader's eye "
        f"to the same takeaway the copy lands. Tone '{post.tone}' maps to this mood so the post "
        f"and design read as one intentional, cohesive piece."
    )

    canva_query = _build_canva_query(topic, brief, post)

    assumptions = list(dict.fromkeys(post.assumptions + brief.assumptions))
    assumptions.append(f"asset_type = {asset_type}; goal = {goal}.")

    return ContentPackage(
        topic=topic,
        post=post,
        brief=brief,
        pairing_rationale=rationale,
        canva_query=canva_query,
        assumptions=assumptions,
    )
