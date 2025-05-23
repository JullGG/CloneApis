const axios = require('axios');

async function getScreenshot(url) {
  if (!url) throw new Error('URL tidak boleh kosong.');

  const apiUrl = `https://loli-chan-api.vercel.app/api/ssweb?url=${encodeURIComponent(url)}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      throw new Error('Gagal mengambil screenshot.');
    }

    return data.result;
  } catch (err) {
    console.error('Gagal ambil screenshot:', err.message);
    throw err;
  }
}

module.exports = getScreenshot;
