"use client";

import { useState } from "react";
import type { ContentPackage } from "@/lib/api";
import ImageStudio from "@/components/ImageStudio";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-accent hover:text-brand-accent dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

function Swatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-7 w-7 rounded-lg border border-black/10 shadow-sm dark:border-white/10"
        style={{ backgroundColor: hex }}
      />
      <span className="text-xs text-slate-600 dark:text-slate-400">
        {name}{" "}
        <code className="font-medium text-slate-900 dark:text-slate-200">
          {hex}
        </code>
      </span>
    </div>
  );
}

function SectionTitle({
  children,
  badge,
}: {
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {badge && (
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-white">
          {badge}
        </span>
      )}
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {children}
      </h2>
    </div>
  );
}

export default function ResultView({ data }: { data: ContentPackage }) {
  return (
    <div className="space-y-6">
      {/* LinkedIn Post */}
      <section className="surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle badge="in">LinkedIn Post</SectionTitle>
          <CopyButton text={data.post.body} label="Copy post" />
        </div>
        <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 font-sans text-sm leading-relaxed text-slate-800 dark:bg-slate-800/50 dark:text-slate-200">
          {data.post.body}
        </pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="chip">Tone: {data.post.tone}</span>
          <span className="chip">Hook: {data.post.hook_pattern}</span>
          <span className="chip">Goal: {data.post.goal}</span>
        </div>
      </section>

      {/* Visual Design Brief */}
      <section className="surface p-6">
        <SectionTitle badge="🎨">Visual Design Brief</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            <div>
              <p className="label">Format</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {data.brief.asset_type} — {data.brief.canvas_size}
              </p>
            </div>
            <div>
              <p className="label">Mood</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {data.brief.mood}
              </p>
            </div>
          </div>
          <div>
            <p className="label">Palette (60 / 30 / 10)</p>
            <div className="mt-2 space-y-2">
              <Swatch hex={data.brief.palette.primary} name="Primary" />
              <Swatch hex={data.brief.palette.secondary} name="Secondary" />
              <Swatch hex={data.brief.palette.accent} name="Accent" />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="label">Typography</p>
          <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2">Element</th>
                  <th className="px-3 py-2">Font</th>
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Weight</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                {data.brief.typography.map((t) => (
                  <tr
                    key={t.element}
                    className="border-t border-slate-100 dark:border-slate-700/60"
                  >
                    <td className="px-3 py-2 font-medium">{t.element}</td>
                    <td className="px-3 py-2">{t.font}</td>
                    <td className="px-3 py-2">{t.size}</td>
                    <td className="px-3 py-2">{t.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="label">Layout</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700 dark:text-slate-300">
              {data.brief.layout.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">Canva production notes</p>
            <ul className="mt-2 list-decimal space-y-1 pl-4 text-sm text-slate-700 dark:text-slate-300">
              {data.brief.canva_notes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* In-app generated image(s) */}
      <ImageStudio data={data} />

      {/* Why they pair + Canva CTA */}
      <section className="surface p-6">
        <SectionTitle badge="🔗">Why They Pair</SectionTitle>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {data.pairing_rationale}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={data.canva_create_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
          >
            Create matching design in Canva ↗
          </a>
          <CopyButton text={data.canva_query} label="Copy Canva prompt" />
        </div>
      </section>

      {/* Assumptions */}
      {data.assumptions.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm dark:border-amber-900/40 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-300">
            Assumptions
          </p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-amber-800 dark:text-amber-300/90">
            {data.assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
