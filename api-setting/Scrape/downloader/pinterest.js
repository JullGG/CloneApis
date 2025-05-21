const axios = require('axios');
const cheerio = require('cheerio');

async function pinterestDownloader(url) {
  const regex = /^https:\/\/([a-z]+\.)?pinterest\.com\/pin\/\d+/;
  if (!regex.test(url)) {
    return { status: false, message: 'URL Pinterest tidak valid!' };
  }

  try {
    const { data } = await axios.get(
      `https://www.savepin.app/download.php?url=${encodeURIComponent(url)}&lang=en&type=redirect`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://www.savepin.app/'
        }
      }
    );

    const $ = cheerio.load(data);
    const results = [];

    const table = $('table').has('tr:contains("Quality"), tr:contains("480p")').first();

    table.find('tr').each((_, el) => {
      const quality = $(el).find('.video-quality').text().trim();
      const format = $(el).find('td:nth-child(2)').text().trim();
      const link = $(el).find('a').attr('href');
      if (quality && link) {
        results.push({
          quality,
          format,
          media: 'https://www.savepin.app' + link
        });
      }
    });

    return results.length
      ? { status: true, result: results }
      : { status: false, message: 'Tidak ada media yang bisa diunduh.' };

  } catch (error) {
    return { status: false, message: error.message };
  }
}

module.exports = pinterestDownloader;
