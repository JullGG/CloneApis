const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeKomiku(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('.seriestuhead h1.entry-title').text().trim();
        const description = $('.entry-content.entry-content-single').text().trim();
        const image = $('.seriestucontl .thumb img').attr('src');
        const rating = $('.rating-prc .num').text().trim();
        const alternative = $('td:contains("Alternative")').next().text().trim();
        const status = $('td:contains("Status")').next().text().trim();
        const type = $('td:contains("Type")').next().text().trim();
        const released = $('td:contains("Released")').next().text().trim();
        const author = $('td:contains("Author")').next().text().trim();

        const latestChapterText = $('.inepcx a:contains("Terbaru") .epcur.epcurlast').text().trim();
        const latestChapterLink = $('.inepcx a:contains("Terbaru")').attr('href');

        // Ambil daftar semua chapter
        const chapters = [];
        $('li[data-num]').each((i, el) => {
            const chapNum = $(el).attr('data-num');
            const chapLink = $(el).find('a').attr('href');
            const chapName = $(el).find('.chapternum').text().trim();
            const chapDate = $(el).find('.chapterdate').text().trim();

            chapters.push({
                number: chapNum,
                name: chapName,
                url: chapLink,
                date: chapDate
            });
        });

        return {
            title,
            description,
            image,
            rating,
            alternative,
            status,
            type,
            released,
            author,
            latestChapter: {
                name: latestChapterText,
                url: latestChapterLink
            },
            chapters
        };
    } catch (error) {
        console.error('Scraping error:', error.message);
        return null;
    }
}

module.exports = scrapeKomiku;
