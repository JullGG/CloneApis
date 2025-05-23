const axios = require('axios');

async function ytmp3Downloader(youtubeUrl) {
  const videoIdMatch = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/i);
  if (!videoIdMatch) throw new Error("URL YouTube tidak valid.");

  const videoId = videoIdMatch[1];
  const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(fullUrl)}&quality=128kbps&server=auto`;

  const { data } = await axios.get(apiUrl);

  if (data.status !== 200) throw new Error("Gagal mengunduh audio dari API.");

  const { title, metadata, author, url, media } = data.result;

  return {
    title,
    channel: author.name,
    duration: metadata.duration,
    views: metadata.views,
    thumbnail: metadata.thumbnail,
    description: metadata.description || '',
    url,
    download: media
  };
}

module.exports = ytmp3Downloader;
