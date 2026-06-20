# Frontend — Agent Factory LinkedIn Content Studio

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Light/dark mode, an in-browser
image generator (HTML Canvas), and PNG/PDF export for LinkedIn.

## Run locally

```bash
npm install
copy .env.example .env.local   # set NEXT_PUBLIC_API_BASE (defaults to http://localhost:8000)
npm run dev                    # http://localhost:3000
```

## Environment

| Variable               | Purpose                                  | Example                          |
|------------------------|------------------------------------------|----------------------------------|
| `NEXT_PUBLIC_API_BASE` | Base URL of the deployed FastAPI backend | `https://your-backend.vercel.app`|

## Deploy to Vercel

1. Import this `frontend/` folder as a Vercel project (framework auto-detected: Next.js).
2. Add env var `NEXT_PUBLIC_API_BASE` = your deployed backend URL.
3. Deploy. `npm run build` runs automatically.

## Structure

- `app/page.tsx` — input form + orchestration
- `app/layout.tsx` — theme no-flash script + Google Fonts (Montserrat/Inter)
- `components/ResultView.tsx` — post + design brief renderer
- `components/ImageStudio.tsx` — Canvas image generator + PNG/PDF download
- `components/ThemeToggle.tsx` — light/dark switch
- `lib/api.ts` — typed backend client
