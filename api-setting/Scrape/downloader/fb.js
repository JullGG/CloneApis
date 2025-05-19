const axios = require("axios");
const cheerio = require("cheerio");

async function facebook(url) {
  try {
    const response = await axios.post(
      "https://www.getfvid.com/downloader",
      new URLSearchParams({ url }).toString(),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    const $ = cheerio.load(response.data);

    return {
      video_sd: $(
        "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a"
      ).attr("href"),
      video_hd: $(
        "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a"
      ).attr("href"),
      audio: $(
        "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a"
      ).attr("href"),
    };
  } catch (error) {
    throw error;
  }
}

module.exports = { facebook };
