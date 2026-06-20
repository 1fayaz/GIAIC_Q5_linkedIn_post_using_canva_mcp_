---
name: master_prompt_skill
description: >
  Orchestrates a complete LinkedIn content package — a publish-ready post PLUS a matching
  visual design brief — from a single topic input. Use this skill whenever the user wants
  a full content deliverable in one go (a post AND its visual direction), or says things
  like "create a LinkedIn post with a graphic," "give me a content package," "post +
  carousel," or "something I can publish and design." It composes linkedin_post_skill and
  design_optimization_skill as reusable sub-components. Prefer this over invoking the two
  skills separately whenever the user wants the copy and the visual to ship together and
  feel intentionally paired.
---

## Purpose

This skill produces a single, unified LinkedIn content package from one topic input by
sequencing two underlying skills: it first generates the post copy, then a visual brief
that deliberately matches that copy's hook and tone, and finally assembles both into one
labeled deliverable with a short rationale connecting them. It exists so users can go from
"here's my topic" to "here's everything I need to publish" without manually coordinating
two separate skills or reconciling mismatched copy and visuals.

## Instructions

Follow this sequence exactly when invoked:

1. **Gather & confirm inputs.** Map the request onto `## Inputs`. Fill missing required
   fields with sensible defaults and record each as a labeled assumption. Do not block on
   optional fields.
2. **Produce the post.** Apply `linkedin_post_skill.md` logic end-to-end to generate the
   post body, then capture three handoff values: the **chosen tone**, the **hook pattern**,
   and the **goal**. (Do not duplicate that skill's internal guidance here — invoke it.)
3. **Produce the matching visual brief.** Apply `design_optimization_skill.md` logic,
   passing the topic, key message, and — critically — the tone/hook/goal handoff from
   step 2 so the visual mood, color energy, and layout reinforce the post rather than
   clash. Map tone → mood (e.g., founder-voice → warm/human; thought-leadership →
   bold/confident; professional → clean/restrained).
4. **Write the pairing rationale.** In 2–4 sentences, explain why this visual direction
   fits this hook and tone (e.g., "the bold-stat hook pairs with a high-contrast accent
   color so the number is the focal point").
5. **Assemble the unified deliverable** in the exact format in `## Outputs`.
6. **Self-check** against `## Constraints` AND against the constraints of both
   sub-skills. Revise until all pass.

## Inputs

- **topic** *(required)* — the subject for the whole package.
- **audience** *(required)* — who it's for.
- **asset_type** *(optional, default: `single_image`)* — `single_image`, `carousel`, or
  `video_cover` for the visual.
- **goal** *(optional, default: `engagement`)* — drives both CTA and visual emphasis.
- **tone** *(optional, default: inferred)* — see linkedin_post_skill tones.
- **brand_name** *(optional)* — used for both voice and visual brand basis.
- **brand_colors / brand_fonts / logo** *(optional)* — passed to the design sub-skill.
- **key_message** *(optional)* — the single takeaway shared by post and visual.

## Outputs

Return ONE document with these clearly labeled sections, in order:

1. **# LinkedIn Content Package — [topic]**
2. **## LinkedIn Post** — the full copy-paste-ready post (from linkedin_post_skill,
   including hook, body, CTA, hashtags).
3. **## Visual Design Brief** — the full brief (from design_optimization_skill: brand
   basis, canvas size, typography, color, layout, Canva notes).
4. **## Why They Pair** — the 2–4 sentence rationale connecting hook/tone to the visual.
5. **## Assumptions** — every inferred input across both sub-skills, consolidated.

## Examples

**Input**

- topic: how a small team shipped faster after cutting meetings
- audience: engineering managers
- asset_type: carousel
- goal: engagement
- (no brand details provided)

**Output (abridged)**

# LinkedIn Content Package — Cutting meetings to ship faster

## LinkedIn Post
We deleted 70% of our recurring meetings. Output went *up*.

[setup → tension → insight → resolution → lesson body, short paragraphs]

What's the one meeting you'd kill tomorrow? 👇

#EngineeringLeadership #Productivity #RemoteWork #TeamCulture

## Visual Design Brief
- Format: carousel, 1080×1080 px PDF.
- Brand basis (provisional): modern, confident, technical.
- Typography: geometric sans headline / humanist sans body, clear 3-level hierarchy.
- Color: navy primary, white secondary, amber accent (the "70%" stat highlighted in amber).
- Layout: thirds grid, one point per slide, slide-1 cover = stat only, final slide = CTA.
- Canva notes: blank 1080×1080 → Brand Kit colors → master slide → duplicate → export PDF.

## Why They Pair
The bold-stat hook makes a number the star, so the visual makes that same number the
focal point in the accent color on slide 1 — copy and design point the reader's eye to the
identical takeaway. The confident, technical tone maps to a clean high-contrast palette
rather than playful color.

## Assumptions
Brand colors, fonts, and personality inferred (none provided); asset_type carousel as
requested; goal = engagement (default).

## Constraints

**Do:**
- Always output ONE unified document with both labeled sections plus the pairing rationale.
- Derive the visual mood from the post's tone/hook/goal — never design in isolation.
- Keep the post compliant with linkedin_post_skill constraints AND the brief compliant with
  design_optimization_skill constraints.
- Consolidate all assumptions into a single final section.

**Don't:**
- Don't duplicate the full internal guidance of the sub-skills here — reference and invoke
  them; this file stays an orchestration layer.
- Don't let the copy and visual contradict each other (e.g., a vulnerable personal story
  paired with a cold corporate palette).
- Don't output two disconnected deliverables; the package must read as one coherent piece.
- Don't bake in a real brand unless the user provides one.

**Quality bar:** a reader should be able to publish the post and hand the brief to a
non-designer, and the result should look and read like one intentional, cohesive piece.
