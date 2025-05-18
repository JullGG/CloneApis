const axios = require('axios');
const cheerio = require('cheerio');

async function pinterestSearch(query) {
  if (!query) throw new Error('Parameter query wajib diisi');

  // Encode query ke URL search Pinterest
  const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    // Cari elemen pin pada halaman
    $('div[data-test-id="pin"]').each((_, el) => {
      const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      const title = $(el).find('img').attr('alt') || null;
      const link = $(el).find('a').attr('href');

      if (img && link) {
        results.push({
          title,
          image: img,
          link: `https://www.pinterest.com${link}`
        });
      }
    });

    // Batasi hasil maksimal 20
    return results.slice(0, 20);

  } catch (error) {
    throw new Error(`Gagal scrape Pinterest: ${error.message}`);
  }
}

module.exports = pinterestSearch;
