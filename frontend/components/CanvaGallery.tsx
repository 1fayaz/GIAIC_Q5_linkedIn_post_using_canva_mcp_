"use client";

import { useState } from "react";
import {
  CANVA_DESIGNS,
  CANVA_GALLERY_TOPIC,
  type CanvaDesign,
} from "@/lib/canvaDesigns";

function DesignCard({ design }: { design: CanvaDesign }) {
  const [imgOk, setImgOk] = useState(true);
  const cover = design.thumbnails[0];

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-brand-accent hover:shadow-soft dark:border-slate-700 dark:bg-slate-800/50">
      {/* Cover thumbnail */}
      <a
        href={design.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900"
      >
        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={design.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImgOk(false)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-gradient text-center text-sm font-semibold text-white">
            {design.title}
          </div>
        )}
      </a>

      {/* Meta + thumbnail strip */}
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">{design.title}</span>
          <span className="chip">{design.thumbnails.length} slides</span>
        </div>
        <div className="mb-3 flex gap-1.5 overflow-x-auto">
          {design.thumbnails.slice(0, 6).map((t, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={t}
              alt={`slide ${i + 1}`}
              className="h-9 w-9 flex-shrink-0 rounded-md border border-slate-200 object-cover dark:border-slate-700"
              loading="lazy"
            />
          ))}
        </div>
        <a
          href={design.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-xs font-semibold text-white transition hover:opacity-95"
        >
          Open in Canva ↗
        </a>
      </div>
    </div>
  );
}

export default function CanvaGallery() {
  return (
    <section className="surface mt-10 p-6 animate-fade-up">
      <div className="mb-1 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-white">
          C
        </span>
        <h2 className="text-lg font-semibold tracking-tight">
          Canva Gallery
        </h2>
        <span className="chip">generated via Canva MCP</span>
      </div>
      <p className="mb-5 text-sm text-slate-600 dark:text-slate-400">
        Real Canva carousels generated for{" "}
        <span className="font-medium text-slate-800 dark:text-slate-200">
          “{CANVA_GALLERY_TOPIC}”
        </span>
        . Click any design to open and edit it in Canva.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CANVA_DESIGNS.map((d) => (
          <DesignCard key={d.candidateId} design={d} />
        ))}
      </div>
    </section>
  );
}
