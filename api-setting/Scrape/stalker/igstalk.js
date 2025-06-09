const axios = require('axios');

async function stalkInstagram(username) {
  try {
    const url = `https://api.nekorinn.my.id/stalk/instagram-v3?username=${encodeURIComponent(username)}`;
    const { data } = await axios.get(url);

    if (!data.status) throw new Error('Gagal mengambil data');

    return {
      username: data.result.username,
      fullname: data.result.fullname,
      avatar: data.result.avatar,
      bio: data.result.bio,
      verified: data.result.verified === 1,
      followers: data.result.followers,
      hearts: data.result.hearts,
      videos: data.result.videos
    };
  } catch (err) {
    return { error: true, message: err.message };
  }
}

module.exports = stalkInstagram;
