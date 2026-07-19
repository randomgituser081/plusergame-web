import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.PLUSER_API_BASE_URL ??
  process.env.NEXT_PUBLIC_SERVER_URI ??
  "https://buzzycash.viaspark.site/api/v1";

async function forward(req: NextRequest, segments: string[]) {
  const search = req.nextUrl.search ?? "";
  // Do not force a trailing slash — buzzycash redirects `/path/` → `/path` (307),
  // and some runtimes drop POST bodies when following that redirect.
  const path = segments.filter(Boolean).join("/").replace(/\/+$/, "");
  const target = `${BASE_URL.replace(/\/$/, "")}/${path}${search}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const auth = req.headers.get("authorization");
  if (auth) headers.Authorization = auth;

  const idempotency = req.headers.get("idempotency-key");
  if (idempotency) headers["Idempotency-Key"] = idempotency;

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      init.body = await req.formData();
    } else {
      const body = await req.text();
      if (body) {
        headers["Content-Type"] = contentType || "application/json";
        init.body = body;
      }
    }
  }

  try {
    const res = await fetch(target, init);
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to reach Pluser Game backend." },
      { status: 502 }
    );
  }
}

interface RouteContext {
  params: { path: string[] };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  return forward(req, params.path);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  return forward(req, params.path);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  return forward(req, params.path);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  return forward(req, params.path);
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  return forward(req, params.path);
}
