const axios = require('axios');

async function gptScraper(prompt) {
  try {
    const url = `https://tools.revesery.com/ai/ai.php?query=${encodeURIComponent(prompt)}`;
    const response = await axios.get(url, {
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36'
      }
    });

    if (response.data && response.data.result) {
      return { success: true, answer: response.data.result };
    } else {
      return { success: false, error: 'No result found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Module export supaya bisa dipakai di API route
module.exports = { gptScraper };
