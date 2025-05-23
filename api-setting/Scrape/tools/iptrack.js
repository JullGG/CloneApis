const axios = require('axios');
const ipinfoToken = '882ffefc502ce1'; // Ganti dengan token kamu

async function getIPInfo(ip) {
  if (!ip) throw new Error('IP address tidak boleh kosong.');
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) throw new Error('Format IP tidak valid.');

  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${ipinfoToken}`);
    return {
      ip: response.data.ip,
      city: response.data.city,
      region: response.data.region,
      country: response.data.country,
      loc: response.data.loc,
      org: response.data.org,
      timezone: response.data.timezone
    };
  } catch (error) {
    throw new Error('Gagal mengambil data IP info: ' + error.message);
  }
}

module.exports = getIPInfo;
