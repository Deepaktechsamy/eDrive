require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(prompt) {
    try {
        console.log("Generating response via Gemini...");

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are a helpful assistant."
        });

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        console.log("AI Response:", reply);
        return reply;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error generating response from Gemini.";
    }
}

module.exports = { generateResponse };
