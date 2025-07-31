import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing Gemini API key" },
      { status: 500 }
    );
  }

  const { messages, model } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Missing messages array" },
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const supportedModels = ["gemini-1.5-flash"];
    const selectedModel = supportedModels.includes(model) ? model : "gemini-1.5-flash";

    const chatModel = genAI.getGenerativeModel({
      model: selectedModel,
    });

    const history = messages
      .filter((m: Message) => m.role !== "system")
      .map((m: Message) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    const result = await chatModel.generateContent({ contents: history });
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    let errorMessage = "Gemini API error";

    if (typeof err === "object" && err !== null) {
      const maybeResponse = (err as { response?: unknown }).response;

      if (
        typeof maybeResponse === "object" &&
        maybeResponse !== null &&
        "data" in maybeResponse
      ) {
        const data = (maybeResponse as { data: unknown }).data;
        console.error("Gemini error response:", data);
        errorMessage = "Gemini API response error";
      } else if (
        "message" in err &&
        typeof (err as { message: unknown }).message === "string"
      ) {
        errorMessage = (err as { message: string }).message;
        console.error("Gemini error:", errorMessage);
      } else {
        console.error("Gemini unknown error (object):", err);
      }
    } else {
      console.error("Gemini unknown error (non-object):", err);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
