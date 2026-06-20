# Agent Factory — LinkedIn Content Studio

> Turn **one topic** into a publish-ready **LinkedIn post** + a matching **visual** —
> generated and downloadable right in your browser. Built on a reusable **Skills** library.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

---

## ✨ What it does

1. You enter a **topic** + **audience**.
2. The app generates:
   - a **LinkedIn post** (hook → story → CTA → hashtags),
   - a **visual design brief** (canvas size, palette, fonts, layout),
   - the **actual image(s)** rendered on an HTML canvas, and
   - a Canva prompt + "Create in Canva" link.
3. You **download** a PNG (single image) or a multi-page **PDF carousel** and post it
   straight to LinkedIn.

No AI API key required — generation is **deterministic**, driven by the rules in
[`/skills`](./skills).

### Canva Gallery

The app also has a **Canva Gallery** section showcasing real LinkedIn carousels
generated through the **Canva MCP** (in the Claude Code CLI). Because a deployed web
app can't call the session-only MCP, those designs are generated ahead of time and
curated in [`frontend/lib/canvaDesigns.ts`](./frontend/lib/canvaDesigns.ts) — each
card links straight into Canva to open and edit. To refresh them, re-run the Canva MCP
and paste the new design URLs/thumbnails into that file.

## 🗂 Project structure

```
.
├── skills/                      # Reusable skill definitions (source of truth)
│   ├── linkedin_post_skill.md
│   ├── design_optimization_skill.md
│   └── master_prompt_skill.md
├── backend/                     # FastAPI service (deterministic skills engine)
│   ├── app/main.py              # API routes
│   ├── app/skills_engine.py     # The 3 skills, as pure Python
│   ├── api/index.py             # Vercel serverless entrypoint
│   ├── requirements.txt
│   └── vercel.json
└── frontend/                    # Next.js 14 + TypeScript + Tailwind
    ├── app/                     # page.tsx, layout.tsx
    ├── components/              # ResultView, ImageStudio, ThemeToggle
    └── lib/api.ts
```

## 🚀 Run locally (two terminals)

**Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1        # Windows PowerShell
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
copy .env.example .env.local      # NEXT_PUBLIC_API_BASE=http://localhost:8000
npm run dev
```

Open **http://localhost:3000** · API docs at **http://localhost:8000/docs**

## ☁️ Deploy to Vercel (two projects)

Deploy `backend/` and `frontend/` as **two separate Vercel projects** from the same repo
(set each project's **Root Directory** accordingly).

### 1. Backend (`backend/`)
- Runtime auto-detected via `@vercel/python` (`api/index.py` + `vercel.json` rewrites).
- Set env var **`ALLOWED_ORIGINS`** = your frontend URL (e.g. `https://your-frontend.vercel.app`).
- Note the deployed URL.

### 2. Frontend (`frontend/`)
- Framework auto-detected: **Next.js**.
- Set env var **`NEXT_PUBLIC_API_BASE`** = your backend URL.
- Redeploy so the frontend points at the live backend.

## 🐙 Push to GitHub

```bash
git init
git add .
git commit -m "Agent Factory LinkedIn Content Studio"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git

```

(`node_modules`, `.next`, `.venv`, `.env*`, and logs are already git-ignored.)

## 💼 Post to LinkedIn

1. **Generate** a package in the app.
2. **Copy post** → paste into LinkedIn's "Start a post" box. Put any link in the
   **first comment** (protects reach).
3. Download the visual:
   - **Single image** → *Download this slide (PNG)* → attach as a photo.
   - **Carousel** → *Download carousel PDF* → in LinkedIn choose **Add a document**,
     upload the PDF, give it a title, and post.
4. Publish. 🎉

## 🔌 API reference

| Method | Path           | Purpose                                   |
|--------|----------------|-------------------------------------------|
| GET    | `/api/health`  | Health check                              |
| POST   | `/api/post`    | LinkedIn post only                        |
| POST   | `/api/design`  | Design brief only (incl. render data)     |
| POST   | `/api/package` | Full package (post + brief + image data)  |
| GET    | `/docs`        | Swagger UI                                |

## 📄 License

[MIT](./LICENSE)
