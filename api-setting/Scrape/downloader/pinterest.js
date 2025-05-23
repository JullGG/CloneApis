const axios = require('axios');

async function pinterestScraper(url) {
  try {
    if (!url) {
      throw new Error('URL Pinterest tidak boleh kosong!');
    }

    const encoded = encodeURIComponent(url);
    const { data } = await axios.get(`https://api.nekorinn.my.id/downloader/pinterest?url=${encoded}`);

    if (data?.status && data.result?.length > 0) {
      return {
        status: true,
        image: data.result[0]
      };
    } else {
      return {
        status: false,
        message: 'Gagal mengambil data Pinterest.'
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message
    };
  }
}

module.exports = pinterestScraper;
