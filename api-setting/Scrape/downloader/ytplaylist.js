// scraper yt playlist
// credit © Nazir

const axios = require('axios');
const cheerio = require('cheerio');

async function ytPlaylist(url) {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };

        // Fetch the playlist page
        const response = await axios.get(url, { headers });
        const html = response.data;
        const $ = cheerio.load(html);

        // Find the script containing ytInitialData
        const scripts = $('script').contents();
        let ytInitialData = null;

        scripts.each((index, element) => {
            if (element.type === 'text') {
                const match = element.data.match(/var ytInitialData\s*=\s*(\{.*\});/s);
                if (match && match[1]) {
                    try {
                        ytInitialData = JSON.parse(match[1]);
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        });

        if (!ytInitialData) {
            throw new Error('Could not find ytInitialData in page');
        }

        // Extract videos from the JSON data
        const videos = [];
        try {
            const contents = ytInitialData?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]
                ?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
                ?.itemSectionRenderer?.contents?.[0]
                ?.playlistVideoListRenderer?.contents;

            if (!contents) throw new Error('Video list not found');

            for (const item of contents) {
                if (item.playlistVideoRenderer) {
                    const video = item.playlistVideoRenderer;
                    const videoId = video.videoId;
                    const title = video.title?.runs?.[0]?.text || 'No title';
                    const duration = video.lengthText?.simpleText || '0:00';
                    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

                    videos.push({
                        title,
                        url: videoUrl,
                        duration,
                        videoId
                    });
                }
            }
        } catch (e) {
            console.error('Error parsing video data:', e);
            return [];
        }

        return videos;
    } catch (error) {
        console.error('Error scraping playlist:', error.message);
        return [];
    }
}

module.exports = ytPlaylist;
