const axios = require('axios');
const cheerio = require('cheerio');
const CryptoJS = require('crypto-js');

function generateHash(url, token) {
  const key = CryptoJS.enc.Hex.parse(token);
  const iv = CryptoJS.enc.Hex.parse('afc4e290725a3bf0ac4d3ff826c43c10');
  const encrypted = CryptoJS.AES.encrypt(url, key, {
    iv,
    padding: CryptoJS.pad.ZeroPadding
  });
  return encrypted.toString();
}

async function allInOneDownloader(url) {
  // Step 1: Ambil token, path, dan cookie
  let token, path, cookie;

  try {
    const res = await axios.get("https://allinonedownloader.com/");
    const $ = cheerio.load(res.data);
    token = $("#token").val();
    path = $("#scc").val();
    cookie = res.headers['set-cookie']?.join('; ') || '';
  } catch (err) {
    console.error(err);
    return { error: "Gagal mendapatkan token dari web.", result: {} };
  }

  // Step 2: Generate hash dan siapkan form
  const hash = generateHash(url, token);

  const data = new URLSearchParams();
  data.append('url', url);
  data.append('token', token);
  data.append('urlhash', hash);

  // Step 3: Kirim POST request
  try {
    const res = await axios.post(`https://allinonedownloader.com${path}`, data.toString(), {
      headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": `crs_ALLINONEDOWNLOADER_COM=blah; ${cookie}`,
        "Dnt": "1",
        "Origin": "https://allinonedownloader.com",
        "Referer": "https://allinonedownloader.com/",
        "Sec-Ch-Ua": `"Not-A.Brand";v="99", "Chromium";v="124"`,
        "Sec-Ch-Ua-Mobile": "?1",
        "Sec-Ch-Ua-Platform": `"Android"`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    const json = res.data;

    return {
      input_url: url,
      source: json.source,
      result: {
        title: json.title,
        duration: json.duration,
        thumbnail: json.thumbnail,
        thumb_width: json.thumb_width,
        thumb_height: json.thumb_height,
        videoCount: json.videoCount,
        imageCount: json.imageCount,
        downloadUrls: json.links
      },
      error: null
    };
  } catch (e) {
    console.error(e);
    return { error: e.message, result: {} };
  }
}

module.exports = allInOneDownloader;
