import SessionCache from "./common/session_cache";

/** Cache for the Steam Deck HQ game review ratings. */
const ratingCache = new SessionCache("sdhq_rating");

/**
 * Fetches Steam Deck HQ game review ratings.
 * @param {string} appId ID of the app to fetch
 * @return {Promise<sdhq_rating[0] | null>}
 */
async function fetchSteamDeckHQRating(appId) {
  const url = `https://steamdeckhq.com/wp-json/wp/v2/game-reviews/?meta_key=steam_app_id&meta_value=${appId}`;
  let data = await cachedFetch(sdhqRatingCache, appId, url);
  return data ? data[0] ?? null : null;
}

/** Cache for the author avatars. */
const avatarCache = new SessionCache("sdhq_avatar");

/**
 * Fetches Steam Deck HQ author avatar data.
 * @param {number} authorId ID of the author to fetch avatar for
 * @return {Promise<{mpp_avatar: {[24 | 48 | 96 | 150 | 300 | full]: string}} | null>}
 */
async function fetchSteamDeckHQAuthorAvatar(authorId) {
  const url = `https://steamdeckhq.com/wp-json/wp/v2/users/${authorId}`;
  return await cachedFetch(sdhqAuthorAvatarCache, authorId, url);
}

/**
 * Fetches Steam Deck HQ game review and author avatar data.
 * @param {number|string} appId appId ID of the app to fetch
 * @return {Promise<{rating: sdhq_rating[0] | null, avatar: {mpp_avatar: {[24 | 48 | 96 | 150 | 300 | full]: string}} | null}>}
 */
async function fetchSteamDeckHQData(appId) {
  let rating = await fetchSteamDeckHQRating(appId);
  let avatar = await fetchSteamDeckHQAuthorAvatar(rating?.author);
  return {rating, avatar};
}

export default fetchSteamDeckHQData;
