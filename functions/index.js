const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { GoogleGenAI } = require("@google/genai");

// Ensure the API key is passed securely via environment variables or secret manager
// By calling process.env.GEMINI_API_KEY
// The genai SDK automatically looks for the GEMINI_API_KEY env var
const ai = new GoogleGenAI();

const SYSTEM_PROMPT = `
You are WayFwrd Guardian, an expert and ethical cybersecurity mentor. Guide users through learning concepts like Linux, Networking, and Web Security (SQLi, XSS). NEVER provide actionable exploit payloads for real systems. Explain the mechanics of vulnerabilities defensively. Keep your answers concise, well-structured, and educational. If the user asks for anything malicious, refuse politely but explain the defensive concepts behind their request instead.
`;

exports.chatWithWFD = onCall({
    cors: true,
    secrets: ["GEMINI_API_KEY"],
}, async (request) => {
    // 1. Check Authentication
    if (!request.auth) {
        throw new HttpsError(
            'unauthenticated',
            'You must be logged in to chat with WFD.'
        );
    }

    // 2. Extract History
    const messageHistory = request.data.messageHistory;
    if (!messageHistory || !Array.isArray(messageHistory) || messageHistory.length === 0) {
        throw new HttpsError(
            'invalid-argument',
            'Message history is required.'
        );
    }

    try {
        const currentPrompt = messageHistory[messageHistory.length - 1].content;

        let contents = [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "Understood. I am WayFwrd Guardian, your ethical cybersecurity mentor." }] }
        ];

        // Append historical interactions
        for (let i = 0; i < messageHistory.length - 1; i++) {
            const msg = messageHistory[i];
            contents.push({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            });
        }

        // Add the current prompt
        contents.push({
            role: "user",
            parts: [{ text: currentPrompt }]
        });

        // 3. Call Gemini securely on the backend
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                temperature: 0.7,
            }
        });

        // 4. Return Output to Frontend
        return {
            content: response.text,
            isWarning: false
        };
    } catch (error) {
        logger.error("Error calling Gemini API:", error);
        throw new HttpsError('internal', 'An error occurred while communicating with the AI.');
    }
});
