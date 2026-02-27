import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.VITE_GROK_API_KEY,
    baseURL: 'https://api.x.ai/v1'
});

async function test() {
    try {
        const response = await openai.chat.completions.create({
            model: 'grok-2-latest',
            messages: [
                { role: "user", content: "Test message" }
            ],
            temperature: 0.7,
        });
        console.log("SUCCESS:", response.choices[0].message.content);
    } catch (error) {
        console.error("ERROR:", error.message);
        if (error.response) {
            console.error("RESPONSE DATA:", error.response.data);
        }
    }
}
test();
