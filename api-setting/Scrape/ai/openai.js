const axios = require('axios');

async function aiOpenAI(text) {
  if (!text) throw new Error('Teks tidak boleh kosong.');

  const apiUrl = `https://api.nekorinn.my.id/ai/openai?text=${encodeURIComponent(text)}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      throw new Error('Gagal mendapatkan respons AI.');
    }

    return data.result;
  } catch (err) {
    console.error('Error saat mengakses AI OpenAI:', err.message);
    throw err;
  }
}

module.exports = aiOpenAI;
