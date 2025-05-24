const axios = require('axios');

async function searchSoundCloud(query) {
  try {
    if (!query) throw new Error('Query pencarian tidak boleh kosong!');

    const encoded = encodeURIComponent(query);
    const { data } = await axios.get(`https://api.nekorinn.my.id/search/soundcloud?q=${encoded}`);

    if (data?.status && data.result?.length > 0) {
      return {
        status: true,
        results: data.result
      };
    } else {
      return {
        status: false,
        message: 'Tidak ditemukan hasil untuk query tersebut.'
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message
    };
  }
}

module.exports = searchSoundCloud;
