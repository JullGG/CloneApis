const axios = require("axios");

function parseString(string) {
  return JSON.parse(`{"text": "${string}"}`).text;
}

async function facebook(url) {
  if (!url || !url.trim()) throw "Parameter 'url' wajib diisi";

  if (!url.includes("facebook.com") && !url.includes("fb.watch"))
    throw "Masukkan URL Facebook yang valid";

  const headers = {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*",
  };

  const { data } = await axios.get(url, { headers });
  const html = data.replace(/&quot;/g, '"').replace(/&amp;/g, "&");

  const sdMatch =
    html.match(/"browser_native_sd_url":"(.*?)"/) ||
    html.match(/"playable_url":"(.*?)"/) ||
    html.match(/sd_src\s*:\s*"([^"]*)"/) ||
    html.match(/(?<="src":")[^"]*(https:\/\/[^"]*)/);

  const hdMatch =
    html.match(/"browser_native_hd_url":"(.*?)"/) ||
    html.match(/"playable_url_quality_hd":"(.*?)"/) ||
    html.match(/hd_src\s*:\s*"([^"]*)"/);

  const titleMatch = html.match(/<meta\sname="description"\scontent="(.*?)"/);
  const thumbMatch = html.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);

  if (!sdMatch || !sdMatch[1]) throw "Video tidak ditemukan";

  return {
    url,
    sd: parseString(sdMatch[1]),
    hd: hdMatch?.[1] ? parseString(hdMatch[1]) : "",
    title: titleMatch?.[1] ? parseString(titleMatch[1]) : "",
    thumbnail: thumbMatch?.[1] ? parseString(thumbMatch[1]) : "",
  };
}

module.exports = { facebook };
