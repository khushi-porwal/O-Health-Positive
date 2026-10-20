const ngoKnowledge = require("../../knowledge/ngoKnowledge");
const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const chatWithGemini = async (req, res) => {
    try {
        const { message } = req.body;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid message.",
            });
        }

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: message.trim(),
            config: {
                systemInstruction: `
You are the official AI assistant for O Positive Health.

Use the following verified organization information to answer:
${ngoKnowledge}

Rules:
- Answer in the visitor's language.
- Be polite, clear, and helpful.
- Never confuse this NGO with a supplement company.
- Do not invent facts or donation details.
- If the answer is not available, say so and direct the
  visitor to the NGO's official contact page.
- Never provide a medical diagnosis.
    `,
            },
        });

        return res.status(200).json({
            success: true,
            reply: response.text,
        });
    } catch (error) {
        console.error("Gemini error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to generate a response.",
        });
    }
};

module.exports = { chatWithGemini };
