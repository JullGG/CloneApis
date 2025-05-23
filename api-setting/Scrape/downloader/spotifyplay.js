const axios = require('axios');

async function spotifyPlaySearch(query) {
  if (!query) throw new Error('Query lagu tidak boleh kosong.');

  const apiUrl = `https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      throw new Error('Gagal mengambil data dari Spotify');
    }

    return {
      title: data.result.metadata.title,
      artist: data.result.metadata.artist,
      duration: data.result.metadata.duration,
      cover: data.result.metadata.cover,
      spotifyUrl: data.result.metadata.url,
      downloadUrl: data.result.downloadUrl
    };
  } catch (err) {
    console.error('Error saat download Spotify:', err.message);
    throw err;
  }
}

module.exports = spotifyPlaySearch;
