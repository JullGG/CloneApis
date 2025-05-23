const axios = require('axios');

async function getKomikindoImages(komikUrl) {
  if (!komikUrl) throw new Error('Parameter "komikUrl" wajib diisi');

  const apiUrl = `https://api.nekorinn.my.id/info/komikindo-getimage?url=${encodeURIComponent(komikUrl)}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (!data.status || !Array.isArray(data.result)) {
      throw new Error('Respons API tidak valid atau tidak berisi gambar');
    }

    return data.result; // array URL gambar komik
  } catch (err) {
    console.error('Gagal mengambil gambar dari Komikindo:', err.message);
    throw err;
  }
}

module.exports = getKomikindoImages;
