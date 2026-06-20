// Typed client for the FastAPI backend.

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://localhost:8000";

export interface PackageRequest {
  topic: string;
  audience: string;
  asset_type: string;
  goal: string;
  tone?: string;
  brand_name?: string;
  key_message?: string;
  proof_points?: string;
}

export interface ContentPackage {
  topic: string;
  post: {
    body: string;
    tone: string;
    hook_pattern: string;
    goal: string;
    hashtags: string[];
  };
  brief: {
    asset_type: string;
    canvas_size: string;
    mood: string;
    typography: { element: string; font: string; size: string; weight: string }[];
    palette: { primary: string; secondary: string; accent: string };
    layout: string[];
    canva_notes: string[];
    dimensions: { width: number; height: number };
    headline: string;
    subhead: string;
    slides: { kind: string; title: string; body: string }[];
  };
  pairing_rationale: string;
  canva_query: string;
  canva_create_url: string;
  assumptions: string[];
}

export async function generatePackage(
  req: PackageRequest
): Promise<ContentPackage> {
  const res = await fetch(`${API_BASE}/api/package`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}
