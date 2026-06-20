"use client";

import { useState } from "react";
import { generatePackage, type ContentPackage } from "@/lib/api";
import ResultView from "@/components/ResultView";
import ThemeToggle from "@/components/ThemeToggle";
import CanvaGallery from "@/components/CanvaGallery";

export default function Home() {
  const [form, setForm] = useState({
    topic: "",
    audience: "",
    asset_type: "carousel",
    goal: "engagement",
    tone: "",
    brand_name: "",
    key_message: "",
    proof_points: "",
  });
  const [data, setData] = useState<ContentPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (k: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const payload = {
        ...form,
        tone: form.tone || undefined,
        brand_name: form.brand_name || undefined,
        key_message: form.key_message || undefined,
        proof_points: form.proof_points || undefined,
      };
      setData(await generatePackage(payload));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero-light dark:bg-hero-dark">
      {/* Top nav */}
      <nav className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-lg dark:border-slate-700/50 dark:bg-slate-900/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white shadow-glow">
              AF
            </span>
            <span className="font-semibold tracking-tight">
              Agent Factory
            </span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-10">
        {/* Hero */}
        <header className="mb-10 text-center animate-fade-up">
          <span className="chip mb-4 inline-block">
            ✨ LinkedIn Content Studio
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Turn one idea into a{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              scroll-stopping post
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-slate-400">
            One topic → a publish-ready LinkedIn post plus a matching Canva
            visual brief. Crafted with deterministic content skills.
          </p>
        </header>

        {/* Form card */}
        <form
          onSubmit={onSubmit}
          className="surface space-y-5 p-6 animate-fade-up sm:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="label">Topic *</span>
              <input
                className="field mt-1.5"
                required
                value={form.topic}
                onChange={set("topic")}
                placeholder="lessons from a failed product launch"
              />
            </label>
            <label className="block">
              <span className="label">Audience *</span>
              <input
                className="field mt-1.5"
                required
                value={form.audience}
                onChange={set("audience")}
                placeholder="early-stage founders"
              />
            </label>
            <label className="block">
              <span className="label">Asset type</span>
              <select
                className="field mt-1.5"
                value={form.asset_type}
                onChange={set("asset_type")}
              >
                <option value="single_image">Single image</option>
                <option value="carousel">Carousel</option>
                <option value="video_cover">Video cover</option>
              </select>
            </label>
            <label className="block">
              <span className="label">Goal</span>
              <select
                className="field mt-1.5"
                value={form.goal}
                onChange={set("goal")}
              >
                <option value="engagement">Engagement</option>
                <option value="lead_generation">Lead generation</option>
                <option value="brand_awareness">Brand awareness</option>
              </select>
            </label>
            <label className="block">
              <span className="label">Tone (optional)</span>
              <select
                className="field mt-1.5"
                value={form.tone}
                onChange={set("tone")}
              >
                <option value="">Auto-infer</option>
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="thought_leadership">Thought-leadership</option>
                <option value="founder_voice">Founder-voice</option>
              </select>
            </label>
            <label className="block">
              <span className="label">Brand name (optional)</span>
              <input
                className="field mt-1.5"
                value={form.brand_name}
                onChange={set("brand_name")}
                placeholder="Acme Co."
              />
            </label>
          </div>

          <label className="block">
            <span className="label">Key message (optional)</span>
            <input
              className="field mt-1.5"
              value={form.key_message}
              onChange={set("key_message")}
              placeholder="ship to learn, not to impress"
            />
          </label>
          <label className="block">
            <span className="label">Proof points (optional)</span>
            <input
              className="field mt-1.5"
              value={form.proof_points}
              onChange={set("proof_points")}
              placeholder="adoption went from 2% to 38%"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-brand-gradient px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Generating…
              </span>
            ) : (
              "Generate content package"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-10 animate-fade-up">
            <ResultView data={data} />
          </div>
        )}

        {!data && !loading && (
          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No API key required · runs on deterministic content skills
          </p>
        )}

        {/* Real Canva designs generated via the Canva MCP */}
        <CanvaGallery />
      </main>
    </div>
  );
}
