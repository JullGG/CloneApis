const axios = require('axios');

async function scrapeSeaArt(text) {
  if (!text) throw new Error('Parameter "text" tidak boleh kosong');

  const url = `https://api.nekorinn.my.id/ai-img/seaart-infinity?text=${encodeURIComponent(text)}`;

  try {
    const { data } = await axios.get(url);

    if (!data.status || !Array.isArray(data.result)) {
      throw new Error('Respons dari API tidak valid atau gagal');
    }

    return data.result; // Mengembalikan array URL gambar
  } catch (err) {
    console.error('Gagal scrape seaart-infinity:', err.message);
    throw err;
  }
}

module.exports = scrapeSeaArt;
