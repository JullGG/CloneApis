const axios = require('axios');
const jimp = require('jimp');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

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

  async function generateTextResponse(userText) {
    try {
      const chatSession = model.startChat({
        generationConfig
      });

      const result = await chatSession.sendMessage(userText);
      return result.response.text();
    } catch (error) {
      console.error('Error dalam fungsi conversation:', error);
      throw error;
    }
  }

 module.exports = generateTextResponse;
