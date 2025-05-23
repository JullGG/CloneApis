const axios = require('axios');

async function hdrEnhance(imageUrl) {
  try {
    const apiUrl = `https://api.vreden.my.id/api/artificial/hdr?url=${encodeURIComponent(imageUrl)}&pixel=4`;
    const { data } = await axios.get(apiUrl);

    const resultUrl = data?.result?.data?.downloadUrls?.[0];
    if (!resultUrl) throw new Error('Gagal mengambil URL hasil HDR');

    return resultUrl;
  } catch (err) {
    console.error('HDR Enhance Error:', err.message);
    throw err;
  }
}

module.exports = hdrEnhance;
