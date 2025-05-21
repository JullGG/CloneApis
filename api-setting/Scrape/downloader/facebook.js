const axios = require("axios");

async function getFBInfo(url, cookie, useragent) {
  if (!url || !url.trim()) throw new Error("Please specify the Facebook URL");

  if (["facebook.com", "fb.watch"].every(domain => !url.includes(domain))) {
    throw new Error("Please enter a valid Facebook URL");
  }

  const headers = {
    "sec-fetch-user": "?1",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-site": "none",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "cache-control": "max-age=0",
    authority: "www.facebook.com",
    "upgrade-insecure-requests": "1",
    "accept-language": "en-GB,en;q=0.9",
    "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    "user-agent": useragent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    cookie: cookie || "sb=Rn8B...; datr=...; c_user=...; xs=...; fr=...;",
  };

  const parseString = (str) => JSON.parse(`{"text": "${str}"}`).text;

  try {
    const { data: raw } = await axios.get(url, { headers });
    const data = raw.replace(/&quot;/g, '"').replace(/&amp;/g, "&");

    const sdMatch = data.match(/"browser_native_sd_url":"(.*?)"/) ||
                    data.match(/"playable_url":"(.*?)"/) ||
                    data.match(/sd_src\s*:\s*"([^"]*)"/) ||
                    data.match(/(?<="src":")[^"]*(https:\/\/[^"]*)/);

    const hdMatch = data.match(/"browser_native_hd_url":"(.*?)"/) ||
                    data.match(/"playable_url_quality_hd":"(.*?)"/) ||
                    data.match(/hd_src\s*:\s*"([^"]*)"/);

    const titleMatch = data.match(/<meta\sname="description"\scontent="(.*?)"/);
    const thumbMatch = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);

    if (sdMatch && sdMatch[1]) {
      return {
        url,
        sd: parseString(sdMatch[1]),
        hd: hdMatch && hdMatch[1] ? parseString(hdMatch[1]) : "",
        title: titleMatch && titleMatch[1] ? parseString(titleMatch[1]) : data.match(/<title>(.*?)<\/title>/)?.[1] ?? "",
        thumbnail: thumbMatch && thumbMatch[1] ? parseString(thumbMatch[1]) : "",
      };
    } else {
      throw new Error("Unable to fetch video information at this time. Please try again");
    }
  } catch {
    throw new Error("Unable to fetch video information at this time. Please try again");
  }
}

module.exports = getFBInfo;
