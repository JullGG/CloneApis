const axios = require('axios');
const cheerio = require('cheerio');

const userAgent = 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36';

async function scrape(query) {
  if (!query) throw new Error('Parameter "query" diperlukan');

  const searchUrl = `https://www.maid.my.id/?s=${encodeURIComponent(query)}`;

  const { data } = await axios.get(searchUrl, {
    headers: {
      'User-Agent': userAgent
    }
  });

  const $ = cheerio.load(data);
  const results = [];

  $('.flexbox2-item').each((_, el) => {
    const title = $(el).find('.flexbox2-title .title').text().trim();
    const link = $(el).find('a').attr('href');
    const image = $(el).find('img').attr('src');
    const studio = $(el).find('.flexbox2-title .studio').text().trim();
    const type = $(el).find('.type').text().trim();
    const score = $(el).find('.score').text().replace(/[^0-9.]/g, '');
    const season = $(el).find('.season').text().trim();
    const synopsis = $(el).find('.synops p').text().trim();
    const genres = [];
    $(el).find('.genres a').each((_, genreEl) => {
      genres.push($(genreEl).text().trim());
    });

    results.push({ title, link, image, studio, type, score, season, synopsis, genres });
  });

  return results;
}

module.exports = scrape;
