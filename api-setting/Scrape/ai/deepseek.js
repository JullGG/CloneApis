const axios = require('axios');

async function aiDeepSeek(text) {
  if (!text) throw new Error('Teks tidak boleh kosong.');

  const apiUrl = `https://api.nekorinn.my.id/ai/deepseek-r1?text=${encodeURIComponent(text)}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result || !data.result.text) {
      throw new Error('Gagal mendapatkan balasan dari DeepSeek.');
    }

    return data.result.text;
  } catch (err) {
    console.error('Error saat mengakses DeepSeek-R1:', err.message);
    throw err;
  }
}

module.exports = aiDeepSeek;
