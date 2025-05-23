const axios = require('axios');

async function ytPlaySearch(query) {
  if (!query) throw new Error('Keyword pencarian tidak boleh kosong.');

  const apiUrl = `https://api.nekorinn.my.id/downloader/ytplay-savetube?q=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      throw new Error('Gagal mengambil data dari YouTube.');
    }

    return {
      title: data.result.metadata.title,
      channel: data.result.metadata.channel,
      duration: data.result.metadata.duration,
      cover: data.result.metadata.cover,
      youtubeUrl: data.result.metadata.url,
      downloadUrl: data.result.downloadUrl
    };
  } catch (err) {
    console.error('Error saat download YouTube:', err.message);
    throw err;
  }
}

module.exports = ytPlaySearch;
