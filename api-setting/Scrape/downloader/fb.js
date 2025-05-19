const axios = require("axios");
const cheerio = require("cheerio");

async function facebook(url) {
  if (!url) throw new Error("URL Facebook tidak boleh kosong!");

  try {
    const form = new URLSearchParams({ url });

    const { data } = await axios.post("https://www.getfvid.com/downloader", form, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    const video_sd = $('a.btn-download[href*="video"]').attr("href") || null;
    const video_hd = $('a[href*="hd"]').attr("href") || null;
    const audio = $('a[href*=".mp3"]').attr("href") || null;

    return {
      video_sd,
      video_hd,
      audio,
    };
  } catch (err) {
    throw new Error("Gagal scrap data Facebook: " + err.message);
  }
}

module.exports = facebook;
