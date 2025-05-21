const axios = require('axios');

process.env['SPOTIFY_CLIENT_ID'] = '4c4fc8c3496243cbba99b39826e2841f';
process.env['SPOTIFY_CLIENT_SECRET'] = 'd598f89aba0946e2b85fb8aefa9ae4c8';

function convert(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

async function spotifyCreds() {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (!response.data.access_token) {
      return {
        creator: 'Budy x creator',
        status: false,
        msg: 'Can\'t generate token!'
      };
    }

    return {
      creator: 'Budy x creator',
      status: true,
      data: response.data
    };

  } catch (error) {
    return {
      creator: 'Budy x creator',
      status: false,
      msg: error.message
    };
  }
}

async function searching(query, type = 'track', limit = 20) {
  const creds = await spotifyCreds();
  if (!creds.status) return creds;

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=${type}&offset=0&limit=${limit}`,
      {
        headers: {
          Authorization: 'Bearer ' + creds.data.access_token
        }
      }
    );

    if (!response.data.tracks.items || response.data.tracks.items.length < 1) {
      return {
        creator: 'Budy x creator',
        status: false,
        msg: 'Music not found!'
      };
    }

    const data = response.data.tracks.items.map(v => ({
      title: v.album.artists[0].name + ' - ' + v.name,
      duration: convert(v.duration_ms),
      popularity: v.popularity + '%',
      preview: v.preview_url,
      url: v.external_urls.spotify
    }));

    return {
      creator: 'Budy x creator',
      status: true,
      data
    };

  } catch (error) {
    return {
      creator: 'Budy x creator',
      status: false,
      msg: error.message
    };
  }
}

module.exports = searching;
