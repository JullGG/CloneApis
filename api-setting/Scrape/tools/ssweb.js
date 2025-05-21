const axios = require("axios");

async function ssweb(url) {
  if (!url) throw new Error("Parameter 'query' tidak ditemukan.");

  const baseURL = "https://image.thum.io/get/png/fullpage/viewportWidth/2400";
  const finalURL = `${baseURL}/${encodeURIComponent(url)}`;

  try {
    const response = await axios.get(finalURL, {
      responseType: "arraybuffer"
    });

    return {
      kode: 200,
      mime: "image/png",
      data: response.data,
      url: query
    };
  } catch (e) {
    throw new Error(`Gagal mengambil gambar: ${e.message}`);
  }
}

module.exports = ssweb;
