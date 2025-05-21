const axios = require('axios');

const base64EncodingUrl = (trackUrl, trackName, artistName) => {
    const data = `__/:${trackUrl}:${trackName}:${artistName}`;
    return Buffer.from(data).toString('base64');
};

const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://spotify-down.com/'
};

async function spotifydown(url) {
    if (!/open\.spotify\.com/.test(url)) {
        throw new Error("URL harus dari Spotify");
    }

    const result = {
        status: false,
        success: 500,
        metadata: {},
        download: ''
    };

    try {
        const metadataRes = await axios.post('https://spotify-down.com/api/metadata', null, {
            params: { link: url },
            headers
        });

        const metadata = metadataRes.data?.data;
        if (!metadata) throw new Error("Metadata tidak ditemukan.");

        const encoded = base64EncodingUrl(metadata.link, metadata.title, metadata.artists);

        const downloadRes = await axios.get('https://spotify-down.com/api/download', {
            params: {
                link: metadata.link,
                n: metadata.title,
                a: metadata.artists,
                t: encoded
            },
            headers
        });

        result.status = true;
        result.success = 200;
        result.metadata = metadata;
        result.download = downloadRes.data?.data?.link || '';
        return result;

    } catch (e) {
        return {
            status: false,
            success: 500,
            message: e.message || 'Gagal mengambil data dari Spotify-Down.'
        };
    }
}

module.exports = spotifydown;
