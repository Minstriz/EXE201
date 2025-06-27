import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }
  const { messages, model } = await req.json();
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Missing messages array" }, { status: 400 });
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "gpt-3.5-turbo-0125",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "OpenAI API error" },
        { status: 500 }
      );
    }
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 