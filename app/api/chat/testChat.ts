import fetch from "node-fetch"; 

async function testChat() {
  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Hello Ollama!" }]
    }),
  });

  const data = await res.json();
  console.log("Reply from backend:", data.reply);
}

testChat();
