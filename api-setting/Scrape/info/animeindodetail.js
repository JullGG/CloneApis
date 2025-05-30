const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeAnimeDetailFromUrl(url) {
  const baseUrl = "https://anime-indo.lol";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const title = $("h1.title").text().trim();

  let imageSrc = $(".detail img").attr("src") || "";
  if (imageSrc.startsWith("/")) {
    imageSrc = baseUrl + imageSrc;
  }

  const genres = [];
  $(".detail li a").each((_, el) => {
    genres.push($(el).text().trim());
  });

  const description = $(".detail p").text().trim();

  const episodes = [];
  $(".ep a").each((_, el) => {
    let epLink = $(el).attr("href");
    if (epLink.startsWith("/")) {
      epLink = baseUrl + epLink;
    }
    episodes.push({
      episode: $(el).text().trim(),
      link: epLink,
    });
  });

  return {
    title,
    image: imageSrc,
    genres,
    description,
    episodes,
  };
}

module.exports = scrapeAnimeDetailFromUrl;
