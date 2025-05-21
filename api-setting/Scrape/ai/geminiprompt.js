const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = 'AIzaSyBrlNXn_q0kl6oZguecy5ahr0C-eEBTMEw';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function generateTextResponse(userText, prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: prompt
        ? [
            {
              role: 'user',
              parts: [{ text: prompt }]
            },
            {
              role: 'model',
              parts: [{ text: 'Oke, saya akan mengikuti instruksi tersebut.' }]
            }
          ]
        : []
    });

    const result = await chatSession.sendMessage(userText);
    return result.response.text();
  } catch (error) {
    console.error('Error dalam generateTextResponse:', error.message);
    throw error;
  }
}

module.exports = generateTextResponse;
