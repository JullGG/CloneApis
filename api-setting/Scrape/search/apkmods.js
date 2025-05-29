const axios = require('axios');
const cheerio = require('cheerio');

async function SearchByPonta(query) {
  try {
    const url = `https://getmodsapk.com/search?query=${encodeURIComponent(query)}`;

    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(html);

    const notFound = $('div').filter((i, el) => $(el).text().includes('Posts not found!')).length > 0;
    if (notFound) {
      return { message: '😢 Nggak ada hasil ditemukan untuk query ini!', results: [] };
    }

    const results = [];
    $('div.grid > a').each((i, element) => {
      const title = $(element).find('h3').text().trim();
      const link = $(element).attr('href');
      const image = $(element).find('img.lazyload').attr('src');
      const status = $(element).find('span.bg-green-100').text().trim();
      const size = $(element).find('span:contains("Size:")').next().text().trim();
      const version = $(element).find('span.text-xs.text-gray-600').first().text().trim();
      const modFeature = $(element).find('span[style*="color: rgb(22, 163, 74)"]').text().trim();

      if (title && link) {
        results.push({
          title,
          link: link.startsWith('http') ? link : `https://getmodsapk.com${link}`,
          image: image ? (image.startsWith('http') ? image : `https://getmodsapk.com${image}`) : 'N/A',
          status: status || 'N/A',
          size: size || 'N/A',
          version: version || 'N/A',
          modFeature: modFeature || 'N/A',
        });
      }
    });

    return {
      message: `🎉 Ditemukan ${results.length} hasil pencarian!`,
      results,
    };
  } catch (error) {
    throw new Error(`❌ Error saat scrape halaman pencarian: ${error.message}`);
  }
}

module.exports = SearchByPonta;
