const axios = require('axios');

async function pinterest(query = 'cewe aesthetic', limit = 15) {
  const base = "https://www.pinterest.com";
  const endpoint = "/resource/BaseSearchResource/get/";

  const getCookies = async () => {
    const response = await axios.get(base);
    const cookies = response.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ');
    return cookies || '';
  };

  const cookies = await getCookies();

  const headers = {
    'accept': 'application/json, text/javascript, */*, q=0.01',
    'referer': 'https://www.pinterest.com/',
    'user-agent': 'Postify/1.0.0',
    'x-app-version': 'a9522f',
    'x-pinterest-appstate': 'active',
    'x-pinterest-pws-handler': 'www/[username]/[slug].js',
    'x-pinterest-source-url': `/search/pins/?rs=typed&q=${encodeURIComponent(query)}/`,
    'x-requested-with': 'XMLHttpRequest',
    'cookie': cookies
  };

  const params = {
    source_url: `/search/pins/?q=${encodeURIComponent(query)}`,
    data: JSON.stringify({
      options: {
        isPrefetch: false,
        query,
        scope: "pins",
        bookmarks: [""],
        no_fetch_context_on_resource: false,
        page_size: limit
      },
      context: {}
    }),
    _: Date.now()
  };

  const { data } = await axios.get(base + endpoint, { headers, params });

  const results = data.resource_response?.data?.results?.filter(v => v.images?.orig) || [];

  return results.map(result => ({
    id: result.id,
    title: result.title || "",
    description: result.description || "",
    url: `https://pinterest.com/pin/${result.id}`,
    image: result.images.orig.url
  }));
}

module.exports = pinterest;
