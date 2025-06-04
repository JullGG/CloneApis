const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeKomiku(query) {
  const url = `https://komiku.in/?s=${encodeURIComponent(query)}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const results = [];

    // Select each manga entry block
    $('.listupd .bsx > a').each((_, el) => {
      const el$ = $(el);
      const title = el$.attr('title');
      const link = el$.attr('href');
      const type = el$.find('.type').text().trim();
      const chapter = el$.find('.epxs').text().trim();
      const rating = el$.find('.numscore').text().trim();
      const image = el$.find('img.ts-post-image').attr('src');

      results.push({ title, link, type, chapter, rating, image });
    });

    return results;
  } catch (error) {
    console.error('Error scraping Komiku:', error.message);
    return null;
  }
}

module.exports = scrapeKomiku; 
