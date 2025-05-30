const axios = require('axios');
const cheerio = require('cheerio');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function scrapeAndDownloadGDriveEpisode(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const $ = cheerio.load(data);

    const title = $('h1.title').first().text().trim();
    const description = $('.detail p').text().trim();

    const videoLinks = [];
    $('.servers a.server').each((_, el) => {
      const label = $(el).text().trim();
      let videoUrl = $(el).attr('data-video');
      if (videoUrl && videoUrl.startsWith('//')) {
        videoUrl = 'https:' + videoUrl;
      }
      videoLinks.push({ label, videoUrl });
    });

    const gdriveServer = videoLinks.find(v => v.label.toLowerCase().includes('gdrive'));
    if (!gdriveServer) throw new Error('No GDrive server found');

    const embedPageUrl = gdriveServer.videoUrl;
    const { data: embedHtml } = await axios.get(embedPageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const _$ = cheerio.load(embedHtml);
    const gdriveLink = _$('#subtitlez').text().trim();

    if (!gdriveLink || !gdriveLink.includes('drive.google.com')) {
      throw new Error('GDrive link not found in embed page');
    }

    const idMatch = gdriveLink.match(/[\?&]id=([^&]+)/) || gdriveLink.match(/\/d\/([^/]+)/);
    const id = idMatch ? idMatch[1] : null;
    if (!id) throw new Error('Google Drive ID not found');

    const postUrl = `https://drive.google.com/uc?id=${id}&authuser=0&export=download`;
    const res = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'accept-encoding': 'gzip, deflate, br',
        'content-length': 0,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'origin': 'https://drive.google.com',
        'user-agent': 'Mozilla/5.0',
        'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
        'x-drive-first-party': 'DriveWebUi',
        'x-json-requested': 'true'
      }
    });

    const rawText = await res.text();
    const json = JSON.parse(rawText.slice(4));
    if (!json.downloadUrl) throw new Error('Download limit reached or link invalid');

    return {
      title,
      description,
      gdrive: {
        downloadUrl: json.downloadUrl
      }
    };

  } catch (err) {
    throw new Error(`Failed to scrape & download GDrive episode: ${err.message}`);
  }
}

module.exports = scrapeAndDownloadGDriveEpisode;
