> const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAndGetDownload(episodeUrl) {
  const { data: episodeHtml } = await axios.get(episodeUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const $ = cheerio.load(episodeHtml);

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

  // Cari yang labelnya 'GDRIVE' (bukan HD)
  const gdriveLinkObj = videoLinks.find(
    v => v.label.toLowerCase() === 'gdrive'
  );
  if (!gdriveLinkObj) throw new Error('GDRIVE link not found');

  const { data: gdriveHtml } = await axios.get(gdriveLinkObj.videoUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const $$ = cheerio.load(gdriveHtml);

  const gdriveRawLink = $$('#subtitlez').text().trim();

  if (!gdriveRawLink || !gdriveRawLink.includes('drive.google.com')) {
    throw new Error('Google Drive raw link not found in embed page');
  }

  const idMatch = gdriveRawLink.match(/\/d\/([^\/]+)\//) || gdriveRawLink.match(/id=([^&]+)/);
  if (!idMatch) throw new Error('Google Drive file ID not found');
  const fileId = idMatch[1];

  const driveApiUrl = `https://drive.google.com/uc?id=${fileId}&authuser=0&export=download`;

  const driveResponse = await axios.post(driveApiUrl, null, {
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

  const jsonStr = driveResponse.data.slice(4);
  const json = JSON.parse(jsonStr);

  if (!json.downloadUrl) throw new Error('Download URL limit or not found');

  const fileDownloadUrl = json.downloadUrl;
  const fileName = json.fileName;
  const fileSize = json.sizeBytes;

  const headResponse = await axios.head(fileDownloadUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const mimetype = headResponse.headers['content-type'];

  return {
    title,
    description,
    downloadUrl: fileDownloadUrl,
    fileName
  };
}

module.exports = scrapeAndGetDownload;
