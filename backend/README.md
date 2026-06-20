# Backend — Agent Factory LinkedIn Skills API

FastAPI service exposing the three deterministic skills as HTTP endpoints.
No API key required (pure rule-based engine).

## Endpoints

| Method | Path           | Purpose                                   |
|--------|----------------|-------------------------------------------|
| GET    | `/api/health`  | Health check                              |
| POST   | `/api/post`    | LinkedIn post only                        |
| POST   | `/api/design`  | Design brief only                         |
| POST   | `/api/package` | Full package (post + brief + Canva link)  |
| GET    | `/docs`        | Interactive Swagger UI                    |

## Run locally

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate      # PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs

### Example

```bash
curl -X POST http://localhost:8000/api/package \
  -H "Content-Type: application/json" \
  -d '{"topic":"lessons from a failed launch","audience":"founders","asset_type":"carousel","goal":"engagement"}'
```

## Deploy to Vercel

`vercel.json` is configured for the `@vercel/python` runtime.

```bash
cd backend
vercel            # first deploy (links project)
vercel --prod     # production
```

Set `ALLOWED_ORIGINS` env var in the Vercel dashboard to your frontend URL.
