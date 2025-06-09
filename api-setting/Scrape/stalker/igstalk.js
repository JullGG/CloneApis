const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeDumporProfile(username) {
  if (!username) throw new Error("Username is required");

  try {
    const url = `https://dumpor.io/v/${username}`;
    const { data: html } = await axios.get(url);

    const $ = cheerio.load(html);

    const profileImage = $(".avatar figure img").attr("src") || null;
    const displayName = $("h2").first().text().trim() || null;
    const usernameExtracted = $("h1").first().text().trim().replace("@", "") || username;

    const stats = {};
    $(".stats .stat").each((_, el) => {
      const title = $(el).find(".stat-title").text().trim().toLowerCase();
      const value = $(el).find(".stat-value").text().trim();
      stats[title] = value;
    });

    const posts = [];
    $(".card").each((_, el) => {
      const postUrl = $(el).find("a").attr("href");
      const img = $(el).find("figure img").attr("src");
      const caption = $(el).find(".card-body p").text().trim();
      posts.push({
        postUrl: postUrl ? "https://dumpor.io" + postUrl : null,
        img,
        caption,
      });
    });

    return {
      username: usernameExtracted,
      displayName,
      profileImage,
      postsCount: stats.posts || null,
      followersCount: stats.followers || null,
      followingCount: stats.following || null,
      posts,
    };
  } catch (error) {
    throw new Error("Failed to scrape dumpor profile: " + error.message);
  }
}

module.exports = scrapeDumporProfile;
