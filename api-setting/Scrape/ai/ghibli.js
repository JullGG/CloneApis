const axios = require('axios');
const FormData = require('form-data');

async function generateAndUploadGhibliImage(prompt) {
  try {
    // Generate gambar dari GhibliArt
    const { data } = await axios.post(
      'https://ghibliart.net/api/generate-image',
      { prompt },
      {
        headers: {
          'accept': '*/*',
          'content-type': 'application/json',
          'origin': 'https://ghibliart.net',
          'referer': 'https://ghibliart.net/',
          'user-agent': 'Mozilla/5.0'
        }
      }
    );

    const img = data?.image || data?.url;
    if (!img) throw new Error("Image not found in response.");

    // Siapkan buffer gambar
    let buffer;
    if (img.startsWith('data:image/') || img.startsWith('iVBORw')) {
      const base64 = img.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64, 'base64');
    } else {
      const resp = await axios.get(img, { responseType: 'arraybuffer' });
      buffer = Buffer.from(resp.data);
    }

    // Upload ke catbox
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, 'image.png');

    const { data: uploadUrl } = await axios.post(
      'https://catbox.moe/user/api.php',
      form,
      { headers: form.getHeaders() }
    );

    return uploadUrl;

  } catch (err) {
    throw new Error(`Error: ${err.message}`);
  }
}

module.exports = generateAndUploadGhibliImage;
