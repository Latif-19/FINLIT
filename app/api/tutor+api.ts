// Server-side API route (Expo Router). Runs on the server, NOT in the app bundle —
// so GEMINI_API_KEY never reaches the device. The client posts the chat history
// to /api/tutor; this handler calls Gemini and returns the reply text.

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are the FinLit AI Tutor, a friendly financial literacy coach for users in Ghana.

Your job: explain Ghanaian personal-finance concepts in simple, practical terms.
You are an expert on local topics including:
- Mobile Money (MoMo) and the Electronic Transfer Levy (E-levy)
- Bank of Ghana Treasury Bills (T-Bills) and how they are bought at a discount
- The SSNIT / NPRA 3-Tier pension system
- Money market and mutual funds (e.g. Databank Mfund, EDC funds)
- Budgeting, saving, and avoiding debt traps in cedis (GH₵)

Guidelines:
- Keep answers short and clear — aim for 2-4 short paragraphs or a tight list. This is read on a phone.
- Use Ghanaian context and the cedi (GH₵) in examples.
- Be encouraging and plain-spoken; avoid heavy jargon, and define any term you must use.
- If a question is outside personal finance, gently steer back to financial topics.
- Never give specific regulated investment advice or guarantee returns; explain options and trade-offs instead.`;

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Tutor is not configured. Missing GEMINI_API_KEY on the server." },
      { status: 503 }
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  // Map our chat history to Gemini's `contents` format. Gemini uses
  // role "user" and "model" (not "ai"), and skips the local welcome message.
  const contents = messages
    .filter((m) => m.text && m.text.trim())
    .map((m) => ({
      role: m.sender === "ai" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

  try {
    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, detail);
      return Response.json(
        { error: "The tutor could not generate a response right now." },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("")
        .trim();

    if (!text) {
      return Response.json(
        { error: "The tutor returned an empty response." },
        { status: 502 }
      );
    }

    return Response.json({ text });
  } catch (err) {
    console.error("Tutor route failed:", err);
    return Response.json(
      { error: "Could not reach the tutor service." },
      { status: 502 }
    );
  }
}
