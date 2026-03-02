import { NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

export async function POST() {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
    return NextResponse.json(
      { error: "ElevenLabs not configured" },
      { status: 500 },
    );
  }

  const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "xi-api-key": ELEVENLABS_API_KEY },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    return NextResponse.json(
      { error: `ElevenLabs API error: ${text}` },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json({ signed_url: data.signed_url });
}
