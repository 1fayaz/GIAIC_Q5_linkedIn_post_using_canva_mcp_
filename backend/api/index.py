"""Vercel Python serverless entrypoint.

Vercel's @vercel/python runtime detects the ASGI `app` object exported here and
serves it. All routes are rewritten to this handler via vercel.json.
"""
from app.main import app  # noqa: F401  (re-exported for Vercel to detect)
