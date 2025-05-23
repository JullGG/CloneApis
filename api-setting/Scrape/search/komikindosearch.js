const axios = require('axios');

async function searchKomikindo(query) {
  if (!query) throw new Error('Parameter "query" harus diisi');

  const url = `https://api.nekorinn.my.id/search/komikindo?q=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(url);

    if (!data.status || !Array.isArray(data.result)) {
      throw new Error('Hasil pencarian tidak valid atau kosong');
    }

    return data.result.map(item => ({
      title: item.title,
      rating: item.rating,
      cover: item.cover,
      url: item.url
    }));
  } catch (err) {
    console.error('Gagal melakukan pencarian Komikindo:', err.message);
    throw err;
  }
}

module.exports = searchKomikindo;
