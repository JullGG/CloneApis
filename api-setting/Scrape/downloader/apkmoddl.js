const axios = require('axios');
const cheerio = require('cheerio');

async function DownloadByPonta(downloadPageUrl) {
  try {
    const { data: html } = await axios.get(downloadPageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    const $ = cheerio.load(html);

    let latestUrl = '';
    const links = [];

    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text();
      if (href && /\/download\/\d+/.test(href)) {
        const fullUrl = href.startsWith('http') ? href : new URL(href, downloadPageUrl).href;
        const versionMatch = text.match(/v?(\d+\.\d+\.\d+)/i);
        const version = versionMatch ? versionMatch[1] : null;
        links.push({ fullUrl, version });
      }
    });

    links.sort((a, b) => compareVersions(b.version, a.version));
    const latestLink = links[0];

    if (latestLink) {
      const { data: html2 } = await axios.get(latestLink.fullUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
      const $2 = cheerio.load(html2);

      $2('a').each((i, el) => {
        const href = $2(el).attr('href');
        if (href && /\/dl-track\//.test(href)) {
          let url = href.startsWith('http') ? href : new URL(href, latestLink.fullUrl).href;
          if (!url.endsWith('.apk')) url += '.apk';
          latestUrl = url;
          return false; // break loop
        }
      });
    }

    if (latestUrl) {
      return latestUrl;
    } else {
      throw new Error('Link download tidak ditemukan');
    }

  } catch (err) {
    throw new Error(`❌ Gagal mengambil link download: ${err.message}`);
  }
}

function compareVersions(v1, v2) {
  if (!v1) return -1;
  if (!v2) return 1;
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

module.exports = DownloadByPonta;
