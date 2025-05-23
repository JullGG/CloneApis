const axios = require('axios');

async function getPopularKomikindo() {
  const apiUrl = 'https://api.nekorinn.my.id/info/komikindo-popular';

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.status || !Array.isArray(data.result)) {
      throw new Error('Gagal mengambil data komik populer.');
    }

    return data.result.map(item => ({
      title: item.title,
      author: item.author,
      rating: item.rating,
      cover: item.cover,
      url: item.url
    }));
  } catch (error) {
    console.error('Error saat mengambil komik populer:', error.message);
    throw error;
  }
}

module.exports = getPopularKomikindo;
