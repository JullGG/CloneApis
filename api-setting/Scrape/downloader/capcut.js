const axios = require('axios');
const cheerio = require('cheerio');

async function CapCut(url) {
  if (!url) throw new Error('URL tidak boleh kosong');

  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  return {
    videoUrl: $('video').attr('src') || null
  };
}

module.exports = CapCut;
