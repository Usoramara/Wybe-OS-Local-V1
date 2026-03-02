import { NextResponse } from "next/server";
import {
  listConversations,
  createConversation,
  getConversation,
  addMessage,
  deleteConversation,
} from "@/lib/conversations";
import { nanoid } from "nanoid";

// GET /api/conversations — list all conversations
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const conv = getConversation(id);
    if (!conv) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(conv);
  }

  return NextResponse.json(listConversations());
}

// POST /api/conversations — create or add message
export async function POST(request: Request) {
  const body = await request.json();

  // Create new conversation
  if (body.action === "create") {
    const id = nanoid(12);
    const conv = createConversation(id);
    return NextResponse.json(conv, { status: 201 });
  }

  // Add message to conversation
  if (body.action === "message" && body.conversationId && body.message) {
    const conv = addMessage(body.conversationId, {
      id: nanoid(12),
      role: body.message.role,
      content: body.message.content,
      createdAt: Date.now(),
    });
    return NextResponse.json(conv);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// DELETE /api/conversations?id=xxx
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const deleted = deleteConversation(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
