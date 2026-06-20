---
name: design_optimization_skill
description: >
  Produces a precise, replicable visual design brief for social and presentation assets —
  covering brand application, typography, color, layout, and Canva-ready production specs.
  Use this skill whenever the user asks to design, lay out, style, or optimize a graphic,
  carousel, banner, slide, or social visual — and also whenever they describe wanting
  something to "look good," "be on-brand," or "match a post" even if they don't say
  "design." Do NOT use it to write post copy (see linkedin_post_skill); it shapes how
  the visual looks, not what the words say.
---

## Purpose

This skill converts a topic, message, and any available brand signals into a concrete
visual design brief that a human (or a designer) can replicate in Canva in minutes. It
exists because strong copy paired with weak or inconsistent visuals underperforms, and
because most requests arrive with little or no formal brand book. The skill encodes
deterministic rules for typography, color, layout, and Canva production so the output is
specific enough to execute without further questions, and consistent across every asset
in a series.

## Instructions

Follow these steps in order every time this skill is invoked:

1. **Collect inputs.** Map the request onto `## Inputs`. For any missing brand
   information, run the fallback inference checklist in `## Brand guidelines` and state
   each inferred decision as a labeled assumption.
2. **Lock the brand basis.** Establish brand voice, allowed colors, fonts, and any
   logo/usage rules. If none exist, define a minimal provisional brand kit and label it
   "provisional."
3. **Set the format.** Pick the asset type and exact canvas size from `## Canva
   optimization` (single image, carousel, or video cover).
4. **Define typography.** Choose a font pairing and define the headline/subhead/body
   hierarchy with sizes and weights per `## Typography`.
5. **Define color.** Build or apply a primary/secondary/accent palette and verify
   contrast per `## Color`.
6. **Compose layout.** Apply the grid, white-space, focal-point, and text-to-image rules
   in `## Layout`. For carousels, specify slide-by-slide structure.
7. **Write Canva production notes.** Provide canvas size, layer naming, and replication
   steps per `## Canva optimization`.
8. **Self-check.** Validate against `## Constraints`. Revise until all pass.
9. **Output.** Return the brief in the exact structure described in `## Outputs`.

## Inputs

- **topic** *(required)* — subject of the visual.
- **asset_type** *(required)* — `single_image`, `carousel`, or `video_cover`.
- **key_message** *(optional)* — the headline idea the visual must communicate.
- **brand_name** *(optional)* — brand or author name.
- **brand_colors** *(optional)* — hex codes or named colors; inferred if absent.
- **brand_fonts** *(optional)* — font names; inferred if absent.
- **logo** *(optional)* — whether a logo exists and any usage rules.
- **mood** *(optional)* — desired feel (e.g., bold, minimal, warm, technical).
- **slide_count** *(optional, carousels)* — number of slides (default 5–7).

## Outputs

Return a single markdown brief with these labeled sections:

1. **Brand basis** — confirmed or provisional brand kit (voice, do's/don'ts).
2. **Format & canvas size** — asset type and exact pixel dimensions.
3. **Typography spec** — font pairing + hierarchy table (element, font, size, weight).
4. **Color palette** — primary/secondary/accent with hex codes and usage + contrast note.
5. **Layout** — composition description; for carousels, a slide-by-slide outline.
6. **Canva production notes** — canvas size, layer naming, step-by-step replication tips.
7. **Assumptions** — every inferred brand/format decision, clearly labeled.

## Brand guidelines

Capture and apply brand inputs. When no brand book is provided, infer identity using this
fallback checklist and state each answer as a provisional assumption:

1. **Industry & audience** — what field, and is the audience formal or casual? (Drives
   palette saturation and font choice.)
2. **Personality in 3 words** — e.g., "bold, modern, trustworthy." (Drives mood.)
3. **Existing assets** — any website, profile, or prior post colors to echo?
4. **Color anchor** — one primary color the brand should own; if none, pick a versatile,
   high-contrast hue suited to the industry.
5. **Logo** — does one exist? If yes, reserve clear space equal to the logo's cap-height
   on all sides and never stretch, recolor, or place it on low-contrast backgrounds. If
   no, use a clean wordmark of the brand name in the headline font.
6. **Do's / don'ts** — at minimum: do keep consistent fonts/colors across assets; don't
   mix more than 2 font families or more than 3–4 core colors.

Apply the same inferred kit across every asset in a series so the set looks cohesive.

## Typography

- **Pairing:** use at most 2 font families — one for headlines (distinctive, higher
  weight) and one for body (highly legible, neutral). A safe default pairing is a strong
  geometric/grotesque sans for headlines + a clean humanist sans for body.
- **Hierarchy (relative scale):** Headline ≈ 2.5–3.5× body size and bold; Subhead ≈
  1.5–2× body and medium; Body = base size and regular. Maintain a clear jump between
  levels so the eye knows where to land first.
- **Readability rules:** line length 30–45 characters on social graphics; line-height
  1.2–1.4; avoid all-caps for long text (fine for short labels); ensure text never sits on
  a busy area of an image without a scrim/overlay.

## Color

- **Palette structure:** define **primary** (dominant, ~60%), **secondary** (~30%), and
  **accent** (~10%, used for CTAs/highlights). This is the 60/30/10 rule.
- **Contrast / accessibility:** body text must meet WCAG AA — contrast ratio ≥ 4.5:1
  against its background (≥ 3:1 for large headline text). When unsure, pair dark text on
  light backgrounds or vice versa, and test the accent color against both.
- **Consistency:** reuse the exact same hex codes across every asset in a set. Don't
  introduce new colors per slide. Limit the total palette to 3–4 core colors plus neutrals
  (white/black/grey).

## Layout

- **Grid:** use a simple column grid (e.g., 12-column or a 3×3 thirds grid) and align all
  elements to it. Place the focal point on a thirds intersection, not dead center, unless
  the design is intentionally symmetric.
- **White space:** keep generous margins (≥ 6–8% of canvas on each edge) and don't fill
  every pixel — negative space increases perceived quality and readability.
- **Focal point:** establish one clear visual priority per asset (usually the headline or
  a single image). Everything else supports it.
- **Text-to-image ratio:** for single images aim for ≤ 30–40% of the canvas as text so it
  doesn't read as cluttered; carousels can be more text-heavy but keep one idea per slide.
- **Carousel structure:** Slide 1 = hook/cover (big headline, minimal text); middle slides
  = one point each with consistent layout; final slide = recap + CTA. Keep a fixed header/
  footer position and a slide-number indicator for continuity.

## Canva optimization

Produce designs that translate cleanly into Canva:

- **Recommended LinkedIn canvas sizes:**
  - Single image post: **1200 × 1200 px** (square) or **1080 × 1350 px** (portrait, more
    feed real estate).
  - Carousel (PDF/document): **1080 × 1080 px** square pages, exported as multi-page PDF.
  - Video cover / thumbnail: **1920 × 1080 px** (16:9) or **1280 × 720 px**.
- **Naming conventions:** name layers/elements descriptively — `bg/`, `headline/`,
  `subhead/`, `body/`, `accent-shape/`, `logo/`, `cta/`. Prefix carousel slides
  `s1_`, `s2_`, etc. Consistent names make replication and edits fast.
- **Replication tips for a human in Canva:**
  1. Start from a blank design at the exact canvas size above.
  2. Set brand colors as a Brand Kit / palette first so they're one click away.
  3. Add fonts via the font picker; lock the headline/body pairing.
  4. Build a master slide/template, then duplicate it for consistency across the set.
  5. Use Canva's alignment guides and "Position" tools to snap elements to the grid.
  6. Group related layers and name them per the convention above.
  7. Export single images as PNG (or JPG for photos) and carousels as PDF.

Structure all instructions as concrete, ordered steps so a non-designer can replicate the
design without interpretation.

## Examples

**Input**

- topic: a data-backed productivity tip
- asset_type: carousel
- key_message: "Batch your deep work"
- mood: minimal, modern
- (no brand colors or fonts provided)

**Output (abridged brief)**

- **Brand basis (provisional):** Minimal, modern, trustworthy. Do: consistent fonts/colors
  across slides. Don't: more than 2 fonts. *(Assumed — no brand book provided.)*
- **Format & canvas size:** Carousel, 1080 × 1080 px square pages, exported as PDF.
- **Typography spec:**
  | Element | Font | Size | Weight |
  |---|---|---|---|
  | Headline | Geometric sans (e.g., Montserrat) | 88 px | Bold |
  | Subhead | same | 48 px | Medium |
  | Body | Humanist sans (e.g., Inter) | 32 px | Regular |
- **Color palette:** Primary #0A2540 (deep navy, 60%), Secondary #FFFFFF (30%), Accent
  #FFB020 (amber, 10%, used for highlights/CTA). Navy-on-white body = high contrast (AA pass).
- **Layout:** Thirds grid; headline top-left of each slide; one point per slide; fixed
  bottom-right slide-number indicator; ≥ 8% margins. Slide 1 cover = big headline only.
- **Canva production notes:** Blank 1080×1080 design → set the 3 colors as Brand Kit →
  lock font pairing → build `s1_` master → duplicate for slides 2–6 → name layers
  `headline/ subhead/ body/ accent-shape/ cta/` → export PDF.
- **Assumptions:** colors, fonts, and brand personality all inferred (none provided).

## Constraints

**Do:**
- Always specify exact canvas pixel dimensions for the chosen asset type.
- Limit to ≤ 2 font families and 3–4 core colors plus neutrals.
- Provide a typography hierarchy with relative or absolute sizing.
- Apply the 60/30/10 palette split and verify AA contrast for body text.
- Give layer naming conventions and ordered Canva replication steps.
- Label every inferred brand decision as a provisional assumption.

**Don't:**
- Don't write the post copy or captions — that's the linkedin_post_skill's job.
- Don't introduce new colors or fonts per slide; keep the set cohesive.
- Don't fill the canvas edge-to-edge; respect margins and white space.
- Don't stretch, recolor, or low-contrast a provided logo.
- Don't exceed a 30–40% text ratio on single-image posts.

**Quality bar:** a non-designer should be able to recreate the asset in Canva from the
brief alone, and every asset in a series should look like it belongs to one set.
