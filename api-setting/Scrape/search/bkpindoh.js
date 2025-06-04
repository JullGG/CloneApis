const axios = require('axios');
const cheerio = require('cheerio');

async function bkp(query) {
  try {
    const url = `https://bokepindoh.yoga/?s=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results = [];

    $('article.loop-video').each((i, el) => {
      const a = $(el).find('a').first();
      const link = a.attr('href');
      const title = a.attr('title');
      const img = $(el).find('img').attr('data-src') || '';
      const duration = $(el).find('.duration').text().trim();
      const views = $(el).find('.views').text().trim();
      const rating = $(el).find('.rating-bar span').last().text().trim();

      results.push({ title, link, img, duration, views, rating });
    });

    return results;
  } catch (err) {
    throw err;
  }
}

module.exports = bkp;
