const axios = require('axios');

async function stalkMinecraft(username) {
  try {
    const url = `https://api.nekorinn.my.id/stalk/minecraft?username=${encodeURIComponent(username)}`;
    const { data } = await axios.get(url);

    if (!data.status) throw new Error('Gagal mengambil data');

    return {
      username: data.result.username,
      id: data.result.id,
      raw_id: data.result.raw_id,
      avatar: data.result.avatar,
      skin_texture: data.result.skin_texture,
      name_history: data.result.name_history
    };
  } catch (err) {
    return { error: true, message: err.message };
  }
}

module.exports = stalkMinecraft;
