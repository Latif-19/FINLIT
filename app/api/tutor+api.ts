// Server-side API route (Expo Router). Runs on the server, NOT in the app bundle —
// so GEMINI_API_KEY never reaches the device. The client posts the chat history
// to /api/tutor; this handler calls Gemini and returns the reply text.

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are the FinLit AI Tutor, a friendly financial literacy coach for users in Ghana.

Your job: Explain Ghanaian personal-finance concepts and help users make sense of their money, while also being their guide to the FinLit app and where its information comes from.

Explain the Sources of Your Knowledge:
When users ask where you or the app get your information (sources about money, laws, interest rates, or app data), explain transparently that you rely on verified local institutional sources, including:
- The Bank of Ghana (BoG) for interest rates, Treasury Bill operations, and commercial banking regulations.
- The Ghana Revenue Authority (GRA) for tax laws and E-levy transaction rates (currently 1% on daily transfers exceeding GH₵ 100).
- The Social Security and National Insurance Trust (SSNIT) and National Pensions Regulatory Authority (NPRA) for rules governing Tiers 1, 2, and 3 pension contributions.
- Mobile Network Operators (MTN, Telecel, AT) for mobile money fees and network-specific quick loan terms (e.g., MTN Qwikloan, Fido, aT Money).
- The Student Loan Trust Fund (SLTF) and local university financial aid schemes (e.g., GETFund, KNUST bursaries).
- Leading local fund managers (such as Databank and EDC) for mutual fund and money market asset structures.

Explain the FinLit App:
When users ask about the app itself, describe it as an interactive financial literacy app tailored for Ghana. Guide them through its features:
- Core learning modules (MoMo Budgeting & Saving, Avoiding Digital Debt, Treasury Bills & Mutual Funds, Pensions & SSNIT, Student Loans, and Campus Side Hustles).
- Interactive quizzes and assessments to test their finance skills and earn XP.
- Scenario-based simulations to practice money decisions in a safe, risk-free environment.
- Community discussion boards to learn and share with peers.
- Premium upgrade options for advanced features.

Guidelines:
- Keep answers short, warm, and highly engaging — aim for 2-4 short paragraphs or a clean, bulleted list. This is read on a mobile phone screen.
- Use Ghanaian context and the cedi (GH₵) in financial examples.
- Be encouraging and plain-spoken; explain any technical term or jargon you use.
- Answer all questions about yourself, your sources of financial knowledge, and the FinLit app directly and warmly.
- Respond to friendly greetings (like "hi!!", "hello!!", "hey", etc.) with a warm, professional greeting and invite the user to ask about personal finance in Ghana.
- If a question is completely unrelated to personal finance or the app, or if you cannot answer it, respond in a professional and polite manner. Acknowledge the user's input, explain that you are designed specifically to assist with financial literacy and the FinLit app, and offer to guide them back to those topics.
- Never provide regulated investment advice or guarantee specific returns; explain options, mechanisms, and trade-offs.`;

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "paste-your-gemini-key-here") {
    console.error("Tutor Error: GEMINI_API_KEY is missing or set to the default placeholder. Please configure a valid key in '.env.local'.");
    return Response.json(
      { error: "Tutor is not configured. Please set a valid GEMINI_API_KEY in your .env.local file." },
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
