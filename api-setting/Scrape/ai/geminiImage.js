const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

async function imageToBase64(input) {
  if (/^https?:\/\//.test(input)) {
    // Jika input berupa URL
    const res = await axios.get(input, { responseType: 'arraybuffer' });
    return Buffer.from(res.data).toString('base64');
  } else if (fs.existsSync(input)) {
    // Jika input berupa path lokal
    const data = fs.readFileSync(input);
    return Buffer.from(data).toString('base64');
  } else {
    throw new Error('Invalid image input (must be URL or file path)');
  }
}

async function processImageWithPrompt(prompt, imageInput) {
  try {
    const base64Image = await imageToBase64(imageInput);
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    return result.response.text();
  } catch (err) {
    throw new Error('Error processing image: ' + err.message);
  }
}

module.exports = processImageWithPrompt;
