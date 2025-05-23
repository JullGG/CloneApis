const axios = require('axios');

async function bratSticker(text) {
  if (!text) throw new Error('Teks tidak boleh kosong.');

  const bratUrl = `https://api.nekorinn.my.id/maker/brat-v2?text=${encodeURIComponent(text)}`;
  const imageRes = await axios.get(bratUrl, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(imageRes.data);

  const catboxUrl = await uploadToCatbox(buffer);
  return catboxUrl;
}

async function uploadToCatbox(imageBuffer, filename = 'image.webp') {
  const boundary = '----WebKitFormBoundary' + Date.now();
  const CRLF = '\r\n';

  const parts = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="reqtype"${CRLF}`,
    `fileupload`,
    `--${boundary}`,
    `Content-Disposition: form-data; name="userhash"${CRLF}`,
    ``,
    `--${boundary}`,
    `Content-Disposition: form-data; name="fileToUpload"; filename="${filename}"`,
    `Content-Type: image/webp${CRLF}`,
  ].join(CRLF);

  const ending = `${CRLF}--${boundary}--${CRLF}`;

  const pre = Buffer.from(parts + CRLF);
  const post = Buffer.from(ending);
  const fullBody = Buffer.concat([pre, imageBuffer, post]);

  const res = await axios.post('https://catbox.moe/user/api.php', fullBody, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': fullBody.length
    },
    maxBodyLength: Infinity
  });

  if (!res.data.startsWith('https://')) throw new Error('Gagal upload ke Catbox');
  return res.data;
}

module.exports = bratSticker;
