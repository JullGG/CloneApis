const axios = require('axios');

async function soundcloudDownload(url) {
  if (!url) throw new Error('URL SoundCloud tidak boleh kosong.');

  const apiUrl = `https://api.nekorinn.my.id/downloader/soundcloud?url=${encodeURIComponent(url)}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      throw new Error('Gagal mengambil data dari SoundCloud');
    }

    return {
      title: data.result.title,
      cover: data.result.cover,
      downloadUrl: data.result.downloadUrl
    };
  } catch (err) {
    console.error('Error saat download SoundCloud:', err.message);
    throw err;
  }
}

module.exports = soundcloudDownload;
