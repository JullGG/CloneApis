const axios = require('axios');

async function scrapeGPT(prompt) {
  try {
    const response = await axios.get("https://tools.revesery.com/ai/ai.php?query=" + encodeURIComponent(prompt), {
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36'
      }
    });
    const res = response.data;
    const result = res.result;
    return { prompt, result }; // disini return prompt juga
  } catch (error) {
    console.error(error);
    return { prompt, error: error.message };
  }
}

module.exports = { scrapeGPT };
