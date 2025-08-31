import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    const response = await fetch("http://127.0.0.1:11434/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages: [{ role: "user", content: lastMessage }]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error("Ollama API error: " + text);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "bad request" },
      { status: 400 }
    );
  }
}
