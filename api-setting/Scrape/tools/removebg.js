const axios = require('axios');

async function removeBackground(imageUrl) {
  try {
    const apiUrl = `https://api.vanzpanz.xyz/tools/removebg?url=${encodeURIComponent(imageUrl)}`;
    const response = await axios.get(apiUrl);

    const result = response.data?.result;
    return result;
  } catch (error) {
    console.error('Error removing background:', error.message);
    return null;
  }
}

module.exports = removeBackground;
