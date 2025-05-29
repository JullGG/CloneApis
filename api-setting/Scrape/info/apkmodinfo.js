const axios = require('axios');
const cheerio = require('cheerio');

async function DetailByPonta(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(html);

    // Ambil JSON-LD
    const jsonLdRaw = $('script[type="application/ld+json"]')
      .map((i, el) => $(el).html())
      .get()
      .find(j => j.includes('"@type":"SoftwareApplication"'));

    let schema = {};
    if (jsonLdRaw) {
      try {
        schema = JSON.parse(jsonLdRaw);
      } catch {
        // Abaikan error parsing
      }
    }

    const judul = schema.name || $('title').text().trim();
    const versi = schema.softwareVersion || '';
    const size = schema.fileSize || '';
    const rating = schema.aggregateRating?.ratingValue || '';
    const ratingCount = schema.aggregateRating?.ratingCount || '';
    const lastUpdate = schema.dateModified || '';
    const developer = schema.author?.name || '';
    const requirements = schema.operatingSystem || '';
    const deskripsi = schema.description || $('meta[name="description"]').attr('content') || '';

    // Thumbnail fix
    let thumbnail = schema.thumbnailUrl || '';
    if (thumbnail && !/^https?:\/\//.test(thumbnail)) {
      thumbnail = new URL(thumbnail, url).href;
    }

    // Ambil kategori dari breadcrumb
    let category = 'apk';
    try {
      const breadcrumbJsonLd = $('script[type="application/ld+json"]')
        .map((i, el) => $(el).html())
        .get()
        .find(j => j.includes('"@type":"BreadcrumbList"'));

      if (breadcrumbJsonLd) {
        const breadcrumb = JSON.parse(breadcrumbJsonLd);
        const catItem = breadcrumb.itemListElement.find(i => i.position === 3);
        if (catItem) category = catItem.name || category;
      }
    } catch {
      // Abaikan error
    }

    // Cari link download
    let downloadLink = '';
    $('a').each((i, el) => {
      const a = $(el);
      const href = a.attr('href');
      const text = a.text().toLowerCase();
      if (href && text.includes('download')) {
        downloadLink = href.startsWith('http') ? href : new URL(href, url).href;
        return false; // break
      }
    });

    return {
      judul,
      versi,
      size,
      rating,
      ratingCount,
      lastUpdate,
      developer,
      thumbnail,
      category,
      requirements,
      downloadLink,
      deskripsi
    };
  } catch (err) {
    throw new Error(`❌ Gagal mengambil detail dari halaman: ${err.message}`);
  }
}

module.exports = DetailByPonta;
