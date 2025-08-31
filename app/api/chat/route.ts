import { NextRequest, NextResponse } from "next/server";

// This endpoint handles POST requests from the frontend chat
export async function POST(req: NextRequest) {
  try {
    // Extract the messages array from the request body
    const { messages } = await req.json();

    // Get the last message sent by the user
    const lastMessage = messages[messages.length - 1]?.content || "";

   
    // await saveMessageToDB({ user: "anonymous", message: lastMessage, timestamp: new Date() });

    // Send the user's message to the AI model (Ollama Llama3)
    const response = await fetch("http://127.0.0.1:11434/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages: [{ role: "user", content: lastMessage }]
      })
    });

    // If the AI service returns an error, throw it
    if (!response.ok) {
      const text = await response.text();
      throw new Error("Ollama API error: " + text);
    }

    // Parse the AI response
    const data = await response.json();

    // Extract the AI's reply
    const reply = data.choices[0].message.content;

    // Return the reply to the frontend
    return NextResponse.json({ reply });
  } catch (e: any) {
    // Handle errors and send back a friendly message
    return NextResponse.json(
      { error: e.message ?? "bad request" },
      { status: 400 }
    );
  }
}

