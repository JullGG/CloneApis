const axios = require('axios');
const { load } = require('cheerio');

async function LyricsByPonta(query) {
  if (!query) throw new Error('Harap masukkan judul lagu atau artis.');

  const url = `https://www.lyrics.com/lyrics/${encodeURIComponent(query)}`;
  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.135 Mobile Safari/537.36',
      'Referer': url
    },
    decompress: true
  });

  if (response.status !== 200) {
    throw new Error('Gagal mengambil data dari Lyrics.com');
  }

  const $ = load(response.data);
  const lyricDiv = $('.sec-lyric.clearfix').first();
  if (!lyricDiv.length) throw new Error('Elemen lirik tidak ditemukan.');

  const lyricBody = lyricDiv.find('.lyric-body').text().trim();
  if (!lyricBody) throw new Error('Lirik tidak ditemukan.');

  return lyricBody;
}

module.exports = LyricsByPonta;
