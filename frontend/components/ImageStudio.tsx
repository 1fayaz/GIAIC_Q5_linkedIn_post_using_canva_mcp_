"use client";

import { useEffect, useRef, useState } from "react";
import type { ContentPackage } from "@/lib/api";

type Slide = { kind: string; title: string; body: string };

/** Wrap text to a max pixel width, returning lines. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Draw one slide onto the canvas at full resolution. */
function drawSlide(
  canvas: HTMLCanvasElement,
  slide: Slide,
  index: number,
  total: number,
  palette: { primary: string; secondary: string; accent: string },
  topicTag: string
) {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const isLightBg =
    palette.secondary.toLowerCase() === "#ffffff" ||
    /f[0-9a-f]/i.test(palette.secondary.slice(1, 3));

  // Cover & CTA slides use the primary color as background; middle slides use secondary.
  const coverLike = slide.kind === "cover" || slide.kind === "cta";
  const bg = coverLike ? palette.primary : palette.secondary;
  const fg = coverLike ? "#FFFFFF" : palette.primary;
  const muted = coverLike ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)";

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const margin = Math.round(W * 0.08);

  // Accent shape (top-left bar)
  ctx.fillStyle = palette.accent;
  ctx.fillRect(margin, margin, Math.round(W * 0.12), Math.round(H * 0.012));

  // Kicker / eyebrow
  ctx.fillStyle = palette.accent;
  ctx.font = `600 ${Math.round(W * 0.026)}px Inter, Arial, sans-serif`;
  ctx.textBaseline = "top";
  const kicker =
    slide.kind === "cover"
      ? topicTag.toUpperCase()
      : slide.kind === "cta"
      ? "TAKE ACTION"
      : `POINT ${index}`;
  ctx.fillText(kicker, margin, margin + Math.round(H * 0.04));

  // Title
  ctx.fillStyle = fg;
  const titleSize = coverLike ? Math.round(W * 0.082) : Math.round(W * 0.06);
  ctx.font = `800 ${titleSize}px Montserrat, Arial, sans-serif`;
  const titleLines = wrapText(ctx, slide.title, W - margin * 2);
  let y = Math.round(H * 0.3);
  const lineH = titleSize * 1.12;
  for (const ln of titleLines) {
    ctx.fillText(ln, margin, y);
    y += lineH;
  }

  // Body
  if (slide.body) {
    ctx.fillStyle = muted;
    const bodySize = Math.round(W * 0.034);
    ctx.font = `400 ${bodySize}px Inter, Arial, sans-serif`;
    const bodyLines = wrapText(ctx, slide.body, W - margin * 2);
    y += Math.round(H * 0.03);
    for (const ln of bodyLines) {
      ctx.fillText(ln, margin, y);
      y += bodySize * 1.4;
    }
  }

  // Footer: brand dot + slide number
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(margin + 8, H - margin, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = muted;
  ctx.font = `600 ${Math.round(W * 0.024)}px Inter, Arial, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.fillText("Agent Factory", margin + 28, H - margin);

  if (total > 1) {
    const label = `${index + 1} / ${total}`;
    ctx.textAlign = "right";
    ctx.fillText(label, W - margin, H - margin);
    ctx.textAlign = "left";
  }
  ctx.textBaseline = "top";
}

export default function ImageStudio({ data }: { data: ContentPackage }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { dimensions, palette, slides } = data.brief;
  const safeSlides: Slide[] =
    slides && slides.length
      ? slides
      : [{ kind: "cover", title: data.brief.headline, body: data.brief.subhead }];

  const [active, setActive] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const topicTag = data.topic.split(" ").slice(0, 3).join(" ");

  // Wait for web fonts so canvas text uses Montserrat/Inter, not a fallback.
  useEffect(() => {
    let cancelled = false;
    const done = () => !cancelled && setFontsReady(true);
    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      (document as any).fonts.ready.then(done).catch(done);
    } else {
      done();
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Redraw whenever the active slide, data, or font readiness changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = dimensions?.width || 1080;
    canvas.height = dimensions?.height || 1080;
    drawSlide(
      canvas,
      safeSlides[active],
      active,
      safeSlides.length,
      palette,
      topicTag
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, data, fontsReady]);

  function downloadCurrent() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `agent-factory-slide-${active + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function downloadAll() {
    // Render each slide off the visible canvas and trigger a download per slide.
    safeSlides.forEach((s, i) => {
      const off = document.createElement("canvas");
      off.width = dimensions?.width || 1080;
      off.height = dimensions?.height || 1080;
      drawSlide(off, s, i, safeSlides.length, palette, topicTag);
      const link = document.createElement("a");
      link.download = `agent-factory-slide-${i + 1}.png`;
      link.href = off.toDataURL("image/png");
      link.click();
    });
  }

  async function downloadPdf() {
    // LinkedIn document/carousel posts are uploaded as a single multi-page PDF.
    const { default: JsPDF } = await import("jspdf");
    const w = dimensions?.width || 1080;
    const h = dimensions?.height || 1080;
    const pdf = new JsPDF({
      orientation: w >= h ? "landscape" : "portrait",
      unit: "px",
      format: [w, h],
      compress: true,
    });
    safeSlides.forEach((s, i) => {
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      drawSlide(off, s, i, safeSlides.length, palette, topicTag);
      const img = off.toDataURL("image/png");
      if (i > 0) pdf.addPage([w, h], w >= h ? "landscape" : "portrait");
      pdf.addImage(img, "PNG", 0, 0, w, h);
    });
    pdf.save("agent-factory-carousel.pdf");
  }

  return (
    <section className="surface p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-white">
          🖼️
        </span>
        <h2 className="text-lg font-semibold tracking-tight">
          Generated Image{safeSlides.length > 1 ? "s" : ""}
        </h2>
      </div>

      {/* Canvas preview */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50">
        <canvas
          ref={canvasRef}
          className="mx-auto block h-auto w-full max-w-[420px]"
        />
      </div>

      {/* Slide navigation (carousel) */}
      {safeSlides.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            disabled={active === 0}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700"
          >
            ← Prev
          </button>
          {safeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
                i === active
                  ? "bg-brand-gradient text-white"
                  : "border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setActive((a) => Math.min(safeSlides.length - 1, a + 1))}
            disabled={active === safeSlides.length - 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700"
          >
            Next →
          </button>
        </div>
      )}

      {/* Download actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={downloadCurrent}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
        >
          ⬇ Download this slide (PNG)
        </button>
        {safeSlides.length > 1 && (
          <>
            <button
              onClick={downloadPdf}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-accent/50 bg-brand-accent/10 px-4 py-2.5 text-sm font-semibold text-brand-accent transition hover:bg-brand-accent/20"
            >
              ⬇ Download carousel PDF (LinkedIn)
            </button>
            <button
              onClick={downloadAll}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-accent hover:text-brand-accent dark:border-slate-700 dark:text-slate-200"
            >
              ⬇ All slides (PNG)
            </button>
          </>
        )}
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {dimensions?.width}×{dimensions?.height}px · ready for LinkedIn
        </span>
      </div>
    </section>
  );
}
