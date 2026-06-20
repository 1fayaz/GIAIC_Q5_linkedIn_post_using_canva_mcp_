"""
FastAPI backend for the Agent Factory LinkedIn content workflow.

Exposes the three deterministic skills as HTTP endpoints. No API key required.
Designed to deploy to Vercel as a Python serverless function (see vercel.json).
"""
from __future__ import annotations

import os
from typing import Optional
from urllib.parse import quote

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .skills_engine import (
    build_content_package,
    build_design_brief,
    build_linkedin_post,
)

app = FastAPI(
    title="Agent Factory — LinkedIn Skills API",
    description="Deterministic LinkedIn post + design brief + Canva handoff.",
    version="1.0.0",
)

# CORS: allow the frontend origin (configurable via env for production).
_allowed = os.environ.get("ALLOWED_ORIGINS", "*")
origins = ["*"] if _allowed == "*" else [o.strip() for o in _allowed.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------- request models --------------------------------

class PostRequest(BaseModel):
    topic: str = Field(..., min_length=2)
    audience: str = Field(..., min_length=2)
    goal: str = "engagement"
    tone: Optional[str] = None
    brand_name: Optional[str] = None
    key_message: Optional[str] = None
    proof_points: Optional[str] = None


class DesignRequest(BaseModel):
    topic: str = Field(..., min_length=2)
    asset_type: str = "single_image"
    mood: Optional[str] = None
    slide_count: int = 6


class PackageRequest(BaseModel):
    topic: str = Field(..., min_length=2)
    audience: str = Field(..., min_length=2)
    asset_type: str = "single_image"
    goal: str = "engagement"
    tone: Optional[str] = None
    brand_name: Optional[str] = None
    key_message: Optional[str] = None
    proof_points: Optional[str] = None


# --------------------------- helpers ---------------------------------------

def _canva_create_url(query: str) -> str:
    """A best-effort deep link to start a matching design in Canva.

    The Connect API is OAuth-gated, so we return a public Canva entry point and
    pass the design intent as a search query. The frontend also surfaces the
    full `canva_query` so it can be pasted into Canva's Magic Design / our MCP.
    """
    return f"https://www.canva.com/design?create&type=Instagram-Post&q={quote(query)}"


# --------------------------- routes ----------------------------------------

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "linkedin-skills-api", "version": "1.0.0"}


@app.post("/api/post")
def post(req: PostRequest):
    p = build_linkedin_post(
        topic=req.topic,
        audience=req.audience,
        goal=req.goal,  # type: ignore[arg-type]
        tone=req.tone,
        brand_name=req.brand_name,
        key_message=req.key_message,
        proof_points=req.proof_points,
    )
    return {
        "body": p.body,
        "tone": p.tone,
        "hook_pattern": p.hook_pattern,
        "goal": p.goal,
        "hashtags": p.hashtags,
        "assumptions": p.assumptions,
    }


@app.post("/api/design")
def design(req: DesignRequest):
    b = build_design_brief(
        topic=req.topic,
        asset_type=req.asset_type,  # type: ignore[arg-type]
        mood=req.mood,
        slide_count=req.slide_count,
    )
    return {
        "asset_type": b.asset_type,
        "canvas_size": b.canvas_size,
        "mood": b.mood,
        "typography": b.typography,
        "palette": b.palette,
        "layout": b.layout,
        "canva_notes": b.canva_notes,
        "dimensions": b.dimensions,
        "headline": b.headline,
        "subhead": b.subhead,
        "slides": b.slides,
        "assumptions": b.assumptions,
    }


@app.post("/api/package")
def package(req: PackageRequest):
    pkg = build_content_package(
        topic=req.topic,
        audience=req.audience,
        asset_type=req.asset_type,  # type: ignore[arg-type]
        goal=req.goal,  # type: ignore[arg-type]
        tone=req.tone,
        brand_name=req.brand_name,
        key_message=req.key_message,
        proof_points=req.proof_points,
    )
    return {
        "topic": pkg.topic,
        "post": {
            "body": pkg.post.body,
            "tone": pkg.post.tone,
            "hook_pattern": pkg.post.hook_pattern,
            "goal": pkg.post.goal,
            "hashtags": pkg.post.hashtags,
        },
        "brief": {
            "asset_type": pkg.brief.asset_type,
            "canvas_size": pkg.brief.canvas_size,
            "mood": pkg.brief.mood,
            "typography": pkg.brief.typography,
            "palette": pkg.brief.palette,
            "layout": pkg.brief.layout,
            "canva_notes": pkg.brief.canva_notes,
            "dimensions": pkg.brief.dimensions,
            "headline": pkg.brief.headline,
            "subhead": pkg.brief.subhead,
            "slides": pkg.brief.slides,
        },
        "pairing_rationale": pkg.pairing_rationale,
        "canva_query": pkg.canva_query,
        "canva_create_url": _canva_create_url(pkg.canva_query),
        "assumptions": pkg.assumptions,
    }


# Root convenience
@app.get("/")
def root():
    return {"message": "Agent Factory LinkedIn Skills API. See /docs for endpoints."}
