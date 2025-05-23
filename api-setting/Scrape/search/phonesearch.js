const axios = require('axios');
const cheerio = require('cheerio');

async function getPhoneDetails(phoneName) {
  try {
    // Cari URL detail di GSMArena
    const searchUrl = `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(phoneName)}`;
    const searchRes = await axios.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $search = cheerio.load(searchRes.data);
    const phoneLink = $search('.makers ul li a').first().attr('href');
    if (!phoneLink) return null;

    const detailUrl = `https://www.gsmarena.com/${phoneLink}`;
    const detailRes = await axios.get(detailUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(detailRes.data);

    const specs = {};
    $('div#specs-list table').each((_, table) => {
      const category = $(table).find('th').text().trim();
      const specDetails = {};
      $(table).find('tr').each((_, row) => {
        const key = $(row).find('td.ttl').text().trim();
        const value = $(row).find('td.nfo').text().trim();
        if (key && value) specDetails[key] = value;
      });
      if (category && Object.keys(specDetails).length) specs[category] = specDetails;
    });

    const phoneTitle = $('h1').text().trim();
    const priceEurRaw = specs['Misc']?.['Price'] || 'N/A';
    let prices = { EUR: priceEurRaw };
    
    if (priceEurRaw !== 'N/A' && priceEurRaw.includes('EUR')) {
      const eurValue = parseFloat(priceEurRaw.match(/[\d.]+/)[0]);
      const fx = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
      const rates = fx.data.rates;
      prices = {
        EUR: `${eurValue.toFixed(2)} EUR`,
        USD: (eurValue * rates.USD).toFixed(2) + ' USD',
        IDR: (eurValue * rates.IDR).toFixed(0) + ' IDR'
      };
    }

    const imageUrl = $('.specs-photo-main img').attr('src') || 'N/A';

    return {
      phoneName: phoneTitle,
      specs,
      prices,
      imageUrl,
      detailUrl
    };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

module.exports = getPhoneDetails;
