const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeAnimeIndo(query) {
  const url = `https://anime-indo.lol/search/${encodeURIComponent(query)}/`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const baseUrl = "https://anime-indo.lol";
  const results = [];

  $("table.otable").each((_, el) => {
    const element = $(el);

    const title = element.find(".videsc a").text().trim();
    const link = baseUrl + element.find(".videsc a").attr("href");
    const image = baseUrl + element.find("img").attr("src");
    const description = element.find("p.des").text().trim();
    
    const labelEls = element.find(".label");
    const year = labelEls.last().text().trim();

    results.push({
      title,
      link,
      image,
      year,
      description,
    });
  });

  return results;
}

module.exports = scrapeAnimeIndo;
