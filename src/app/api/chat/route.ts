import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

function chatBackendBase(): string {
  const url =
    process.env.CHAT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_CHAT_API_URL?.trim() ||
    "http://127.0.0.1:8000";
  return url.replace(/\/$/, "");
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id != null ? String(session.user.id) : "";
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
      ? (body as { message: string }).message.trim()
      : "";

  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const base = chatBackendBase();
  let upstream: Response;
  try {
    upstream = await fetch(`${base}/chat/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, message }),
      cache: "no-store",
    });
  } catch (e) {
    console.error("[api/chat] upstream fetch failed:", e);
    return NextResponse.json(
      { error: "Chat service unreachable" },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("[api/chat] upstream error:", upstream.status, text);
    return NextResponse.json(
      { error: "Chat API error", status: upstream.status },
      { status: 502 }
    );
  }

  const data: unknown = await upstream.json();
  return NextResponse.json(data);
}
