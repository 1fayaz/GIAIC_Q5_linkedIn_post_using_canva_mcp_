---
name: linkedin_post_skill
description: >
  Drafts, rewrites, and optimizes high-performing LinkedIn posts from any topic,
  calibrating tone, hook, narrative structure, CTA, and hashtags to the audience
  and goal. Use this skill whenever the user asks to write, draft, rewrite, polish,
  or optimize a LinkedIn post — and also whenever they describe a professional or
  thought-leadership social post (founder update, career story, launch announcement,
  industry take) even if they never say the word "LinkedIn." Do NOT use it for ad
  copy, long-form blogs, or visual/design work (see design_optimization_skill).
---

## Purpose

This skill turns a raw topic into a publish-ready LinkedIn post that earns attention
in the first two lines, holds it with a clear narrative, and ends with an action that
fits the author's goal. It exists because LinkedIn rewards a specific shape of
writing — short opening hook, scannable body, single clear CTA, restrained hashtags —
that is easy to get wrong by default. The skill encodes that shape as deterministic
rules so any topic, brand, or voice can be turned into a strong post without guesswork.

## Instructions

Follow these steps in order every time this skill is invoked:

1. **Collect inputs.** Read the user's request and map it onto the fields in `## Inputs`.
   If a required field is missing, infer a sensible default and state the assumption
   explicitly (e.g., "Assuming audience = mid-level marketers"). Never block on missing
   optional fields.
2. **Choose the goal.** Classify the post goal as one of: `engagement`,
   `lead_generation`, or `brand_awareness`. This choice drives the CTA in step 6.
3. **Calibrate tone.** Select exactly one primary tone from `## Tone` based on audience
   and brand voice. Note any secondary modifier (e.g., "professional with a touch of wit").
4. **Select a hook.** Pick one hook pattern from `## Hooks` using the decision rules in
   that section. Write the first line so it works as a standalone scroll-stopper —
   LinkedIn truncates after ~210 characters before the "see more" fold.
5. **Structure the body.** Apply the narrative arc in `## Storytelling structure`. Use
   short paragraphs (1–3 lines), generous line breaks, and at most one short list.
6. **Write the CTA.** Choose a closing pattern from `## CTA` that matches the goal from
   step 2. Use exactly one CTA — never stack multiple asks.
7. **Add hashtags.** Apply the rules in `## Hashtags`: 3–5 tags, mixing broad and niche.
8. **Self-check.** Validate the draft against every item in `## Constraints`. Revise
   until all pass.
9. **Output.** Return the post in the exact format described in `## Outputs`.

## Inputs

- **topic** *(required)* — the subject or core message of the post.
- **audience** *(required)* — who the post is for (e.g., "early-stage founders").
- **goal** *(optional, default: `engagement`)* — `engagement`, `lead_generation`, or
  `brand_awareness`.
- **tone** *(optional, default: inferred from audience/brand)* — one of the named tones
  in `## Tone`, or a brand-voice description.
- **brand_name** *(optional)* — the author's brand or personal name, used for voice.
- **key_message** *(optional)* — the single takeaway the reader must remember.
- **proof_points** *(optional)* — stats, results, or anecdotes that add credibility.
- **link** *(optional)* — a URL for lead-gen or click-through goals.

## Outputs

Return a single markdown block containing, in this order:

1. **Post body** — the ready-to-paste LinkedIn text, including the hook line, body,
   blank lines preserved, CTA, and hashtags on their own final line.
2. **Meta block** (after a `---` divider) — a short labeled summary:
   - `Tone:` chosen tone
   - `Hook pattern:` chosen hook
   - `Goal:` chosen goal
   - `Assumptions:` any inferred inputs

Keep the post body between 80 and 250 words unless the user requests otherwise. Do not
wrap the post in code fences in the final deliverable — it must be copy-paste ready.

## Tone

Calibrate tone to audience and brand voice. Pick exactly one primary option:

- **Professional / authoritative** — measured, credible, light on slang. Use for
  enterprise audiences, regulated industries, or senior decision-makers who value
  precision over personality.
- **Conversational / peer-to-peer** — warm, direct, uses "you" and contractions. Use
  for practitioner audiences and community-building posts where relatability drives reach.
- **Thought-leadership** — confident, opinionated, frames a point of view on an industry
  trend. Use when the goal is to establish authority or spark debate.
- **Founder-voice / personal** — first-person, candid, shares wins and failures. Use for
  personal brands and startup storytelling where vulnerability builds trust.

Rule: match tone to the *audience's* expectations first, then layer the brand voice as a
modifier. When unsure, default to **conversational** for individuals and **professional**
for company pages.

## Hooks

The first line decides whether the post is read. Choose one pattern:

- **Contrarian statement** — challenge a common belief ("Most onboarding advice is
  wrong."). Use when the goal is debate/engagement and you have a defensible take.
- **Bold stat** — lead with a surprising number ("We cut churn 40% by removing a feature.").
  Use when you have a credible proof point and want authority.
- **Personal vulnerability** — admit a failure or fear ("I almost shut the company down
  last year."). Use for founder-voice and trust-building.
- **Question hook** — open a loop the reader wants closed ("What if your best hire is the
  one you almost rejected?"). Use for broad relatability and comments.
- **Pattern interrupt / specificity** — an oddly specific detail ("At 2am, the dashboard
  showed zero signups."). Use to create cinematic curiosity.

Decision rule: pick the hook whose strength you can actually back up. Have a stat → bold
stat. Have a strong opinion → contrarian. Have a story → vulnerability or specificity.
Want comments → question. Never promise in the hook what the body doesn't deliver.

## Storytelling structure

Apply this repeatable arc to the body:

1. **Setup** — establish the situation in one or two lines (who, where, stakes).
2. **Tension / problem** — name the obstacle, mistake, or surprising challenge.
3. **Insight / turn** — the realization, decision, or pivot that changed things.
4. **Resolution** — what happened as a result (ideally with a concrete proof point).
5. **Lesson** — the transferable takeaway the reader can apply, stated plainly.

Keep each beat to 1–3 short lines. Use whitespace between beats so the post is scannable
on mobile. For pure how-to or list posts, replace beats 2–4 with a tight numbered list,
but keep the setup and lesson framing.

## CTA

End with exactly one CTA matched to the goal:

- **Engagement** — invite a low-friction reply: "What would you have done? 👇" or
  "Agree or disagree?"
- **Lead generation** — point to a resource or next step: "I wrote a full guide — link in
  comments." Place links in the first comment, not the body, to protect reach.
- **Brand awareness** — invite a share/follow: "Repost ♻️ if this helped" or "Follow for
  more on [topic]."

Rule: one ask only. Match the verb to the goal. Avoid generic "Let me know your thoughts"
unless nothing better fits.

## Hashtags

- Use **3–5** hashtags total. More dilutes reach and reads as spam.
- Mix **1–2 broad** tags (large reach, e.g., #Marketing) with **2–3 niche** tags
  (targeted, e.g., #B2BContentStrategy).
- Place hashtags on the **final line**, after the CTA, separated by spaces.
- Use CamelCase for multi-word tags for readability and accessibility (#ProductLaunch).
- Avoid: banned/irrelevant tags, more than 5 tags, hashtags mid-sentence, and tags that
  don't match the topic just to chase reach.

## Examples

**Input**

- topic: launching a feature that flopped and what it taught the team
- audience: early-stage SaaS founders
- goal: engagement
- tone: founder-voice
- key_message: ship to learn, not to impress

**Output**

We spent four months building a feature nobody used.

Three weeks after launch, adoption sat at 2%.

The problem wasn't the code. It was that we built what we *thought* was impressive
instead of what users actually asked for. We never validated the demand — we just assumed
it.

So we killed it. Publicly. And we rebuilt the roadmap around five customer interviews
instead of one founder's hunch.

The next release? 38% adoption in the first week.

The lesson: ship to learn, not to impress. Your roadmap should be a series of questions,
not a list of bets on your own ego.

What's a feature you wish you'd killed sooner? 👇

#StartupLessons #ProductManagement #SaaS #FounderJourney

---
Tone: founder-voice · Hook pattern: bold stat · Goal: engagement · Assumptions: none

## Constraints

**Do:**
- Open with a single hook line under ~210 characters that survives the "see more" fold.
- Keep paragraphs to 1–3 lines with blank lines between beats for mobile scannability.
- Apply the full narrative arc (setup → tension → insight → resolution → lesson) or its
  list-based equivalent.
- Use exactly one CTA matched to the stated goal.
- Use 3–5 hashtags (mix of broad + niche) on the final line.
- State any inferred inputs in the meta block.

**Don't:**
- Don't exceed 250 words unless explicitly requested.
- Don't stack multiple CTAs or multiple links in the body.
- Don't use more than 5 hashtags or place them mid-sentence.
- Don't use clickbait the body can't deliver on.
- Don't bake in a specific real brand, person, or product unless the user provides it.
- Don't output design or layout instructions — that is the design_optimization_skill's job.

**Quality bar:** a reader should grasp the takeaway in under 15 seconds of scanning, and
the hook should make sense as a standalone first line.
