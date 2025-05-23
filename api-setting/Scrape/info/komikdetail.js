const axios = require('axios');

async function komikindoDetail(komikUrl) {
  if (!komikUrl) throw new Error('Parameter "komikUrl" wajib diisi');

  const apiUrl = `https://api.nekorinn.my.id/info/komikindo-detail?url=${encodeURIComponent(komikUrl)}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      throw new Error('Data tidak ditemukan atau format response salah');
    }

    const result = data.result;

    return {
      title: result.title,
      status: result.status,
      author: result.author,
      illustrator: result.illustrator,
      graphic: result.graphic,
      theme: result.theme,
      type: result.type,
      synopsis: result.synopsis,
      url: result.url,
      officialLinks: result.official || [],
      infoLinks: result.informasi || [],
      genres: result.genre?.map(g => g.name) || [],
      spoilerImages: result.spoiler?.map(s => s.image) || [],
      chapters: result.chapters?.map(ch => ({
        title: ch.title,
        url: ch.url,
        date: ch.date
      })) || []
    };
  } catch (err) {
    console.error('Gagal mengambil detail komik:', err.message);
    throw err;
  }
}

module.exports = komikindoDetail;
