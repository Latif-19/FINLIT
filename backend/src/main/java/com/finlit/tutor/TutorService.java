package com.finlit.tutor;

import com.finlit.common.exception.ServiceUnavailableException;
import com.finlit.common.exception.UpstreamServiceException;
import com.finlit.gamification.BadgeService;
import com.finlit.tutor.dto.TutorChatResponse;
import com.finlit.tutor.dto.TutorMessageDto;
import com.finlit.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * The AI Tutor. Proxies Google Gemini server-side so the API key never reaches
 * the app. Ported from the frontend's tutor route: same system prompt, same
 * request shape. A successful reply unlocks the "Curious Mind" badge.
 */
@Service
public class TutorService {

    private static final Logger log = LoggerFactory.getLogger(TutorService.class);

    private static final String SYSTEM_PROMPT = """
            You are the FinLit AI Tutor, a friendly financial literacy coach for users in Ghana.

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
            - Keep answers short, warm, and engaging — aim for 1-2 short paragraphs or a few tight bullet points, and stay under about 110 words unless the user explicitly asks for more detail. This is read on a mobile phone, so be concise and skip filler and long preambles.
            - Use Ghanaian context and the cedi (GH₵) in financial examples.
            - Be encouraging and plain-spoken; explain any technical term or jargon you use.
            - Answer all questions about yourself, your sources of financial knowledge, and the FinLit app directly and warmly.
            - Respond to friendly greetings (like "hi!!", "hello!!", "hey", etc.) with a warm, professional greeting and invite the user to ask about personal finance in Ghana.
            - If a question is completely unrelated to personal finance or the app, or if you cannot answer it, respond in a professional and polite manner. Acknowledge the user's input, explain that you are designed specifically to assist with financial literacy and the FinLit app, and offer to guide them back to those topics.
            - Never provide regulated investment advice or guarantee specific returns; explain options, mechanisms, and trade-offs.""";

    private final RestClient restClient = RestClient.create();
    private final String apiKey;
    private final String model;
    private final int thinkingBudget;
    private final UserRepository userRepository;
    private final BadgeService badgeService;

    public TutorService(@Value("${app.gemini.api-key:}") String apiKey,
                        @Value("${app.gemini.model:gemini-2.5-flash}") String model,
                        @Value("${app.gemini.thinking-budget:128}") int thinkingBudget,
                        UserRepository userRepository,
                        BadgeService badgeService) {
        this.apiKey = apiKey;
        this.model = model;
        this.thinkingBudget = thinkingBudget;
        this.userRepository = userRepository;
        this.badgeService = badgeService;
    }

    @Transactional
    public TutorChatResponse chat(UUID userId, String message, List<TutorMessageDto> history) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ServiceUnavailableException(
                    "The AI Tutor is not configured. Set a GEMINI_API_KEY to enable it.");
        }

        // Map our history + the new message into Gemini's "contents" format.
        // Gemini uses roles "user" and "model" (not "assistant").
        List<Map<String, Object>> contents = new ArrayList<>();
        if (history != null) {
            for (TutorMessageDto turn : history) {
                if (turn.content() == null || turn.content().isBlank()) {
                    continue;
                }
                String role = "assistant".equals(turn.role()) ? "model" : "user";
                contents.add(Map.of("role", role, "parts", List.of(Map.of("text", turn.content()))));
            }
        }
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", message))));

        // Cap "thinking" to keep replies fast. Newer Gemini flash models reason
        // silently before answering, which adds several seconds of latency; a low
        // budget trims that while keeping answer quality. Tunable via
        // app.gemini.thinking-budget (set negative to omit and use model default).
        Map<String, Object> generationConfig = new java.util.HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 800);
        if (thinkingBudget >= 0) {
            generationConfig.put("thinkingConfig", Map.of("thinkingBudget", thinkingBudget));
        }

        Map<String, Object> requestBody = Map.of(
                "systemInstruction", Map.of("parts", List.of(Map.of("text", SYSTEM_PROMPT))),
                "contents", contents,
                "generationConfig", generationConfig
        );

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + model + ":generateContent";

        Map<?, ?> response;
        try {
            response = restClient.post()
                    .uri(url)
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientResponseException httpEx) {
            // Log the full upstream error server-side; return a clean message.
            log.error("Gemini API error {}: {}", httpEx.getStatusCode(), snippet(httpEx.getResponseBodyAsString()));
            throw new UpstreamServiceException("The tutor could not generate a response right now.");
        } catch (Exception ex) {
            log.error("Tutor call failed", ex);
            throw new UpstreamServiceException("Could not reach the AI Tutor service.");
        }

        String reply = extractText(response);
        if (reply == null || reply.isBlank()) {
            throw new UpstreamServiceException("The tutor returned an empty response.");
        }

        // First tutor use unlocks the "Curious Mind" badge.
        userRepository.findById(userId).ifPresent(user -> {
            if (!user.isTutorUsed()) {
                user.setTutorUsed(true);
                userRepository.save(user);
            }
        });
        badgeService.evaluate(userId);

        return new TutorChatResponse(reply);
    }

    /** Trims/collapses an upstream error body to a short, readable snippet. */
    private String snippet(String text) {
        if (text == null) return "";
        String cleaned = text.replaceAll("\\s+", " ").trim();
        return cleaned.length() > 300 ? cleaned.substring(0, 300) : cleaned;
    }

    /** Pulls the reply text out of Gemini's nested response structure. */
    private String extractText(Map<?, ?> response) {
        if (response == null) {
            return null;
        }
        if (!(response.get("candidates") instanceof List<?> candidates) || candidates.isEmpty()) {
            return null;
        }
        if (!(candidates.get(0) instanceof Map<?, ?> candidate)) {
            return null;
        }
        if (!(candidate.get("content") instanceof Map<?, ?> content)) {
            return null;
        }
        if (!(content.get("parts") instanceof List<?> parts)) {
            return null;
        }
        StringBuilder text = new StringBuilder();
        for (Object part : parts) {
            if (part instanceof Map<?, ?> partMap && partMap.get("text") != null) {
                text.append(partMap.get("text"));
            }
        }
        return text.toString().trim();
    }
}
