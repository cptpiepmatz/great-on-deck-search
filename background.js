/** Types of messages for content-background communication. */
const MessageType = {
  PROTON_DB: "protonDb",
  DECK_VERIFIED: "deckVerified",
  SD_HQ: "steamDeckHQ",
  ALL: "all"
}

/**
 * Cache for the ProtonDB responses.
 * @type {Map<string, null | {tier: string}>}
 */
const protonDbCache = new Map();

/**
 * Utility function to fetch data while also using a cache.
 * @param {Map} cache
 * @param {number | string} requestId
 * @param {string} fetchUrl
 */
async function cachedFetch(cache, requestId, fetchUrl) {
  if (!requestId) return null;
  if (cache.has(requestId)) return cache.get(requestId);
  let res = await fetch(fetchUrl);
  if (res.ok) {
    let json = await res.json();
    cache.set(requestId, json);
    return json;
  }
  cache.set(requestId, null);
  return null;
}

/**
 * Cache for the Deck Verifications.
 * @type {Map<string, null | {resolved_category: 0 | 1 | 2 | 3}>}
 */
const deckVerifiedCache = new Map();

/**
 * Fetches ProtonDB entries.
 * @param {string} appId ID of the app to fetch
 * @return {Promise<null|{tier: string}>}
 */
async function fetchProtonDb(appId) {
  return await cachedFetch(
    protonDbCache,
    appId,
    `https://www.protondb.com/api/v1/reports/summaries/${appId}.json`
  );
}

/**
 * Fetches Deck Verfied Status.
 * @param {string} appId ID of the app to fetch
 * @return {Promise<{resolved_category: (0|1|2|3)}|null>}
 */
async function fetchDeckVerified(appId) {
  let data = await cachedFetch(
    deckVerifiedCache,
    appId,
    `https://www.protondb.com/proxy/steam/deck-verified?nAppID=${appId}`
  );
  return data?.results ?? null;
}

/**
 * A numerical ranking between 1 and 5.
 * @typedef {1 | 2 | 3 | 4 | 5} rating
 */

/**
 * The data received from the Steam Deck HQ game ratings page.
 * @typedef {[undefined | {
 *   acf: {
 *     sdhq_rating: rating,
 *     sdhq_rating_categories: {
 *       performance: rating,
 *       visuals: rating,
 *       stability: rating,
 *       controls: rating,
 *       battery: rating,
 *       score_breakdown: string
 *     }
 *   },
 *   link: string,
 *   author: number,
 *   author_meta: {
 *     author_link: string,
 *     display_name: string
 *   }
 * }]} sdhq_rating
 */

/** Cache for the Steam Deck HQ game review ratings. */
const sdhqRatingCache = new Map();

/**
 * Fetches Steam Deck HQ game review ratings.
 * @param {string} appId ID of the app to fetch
 * @return {Promise<sdhq_rating[0] | null>}
 */
async function fetchSteamDeckHQRating(appId) {
  let data = await cachedFetch(
    sdhqRatingCache,
    appId,
    `https://steamdeckhq.com/wp-json/wp/v2/game-reviews/?meta_key=steam_app_id&meta_value=${appId}`
  );
  return data ? data[0] ?? null : null;
}

/** Cache for the author avatars. */
const sdhqAuthorAvatarCache = new Map();

/**
 * Fetches Steam Deck HQ author avatar data.
 * @param {number} authorId ID of the author to fetch avatar for
 * @return {Promise<{mpp_avatar: {[24 | 48 | 96 | 150 | 300 | full]: string}} | null>}
 */
async function fetchSteamDeckHQAuthorAvatar(authorId) {
  return await cachedFetch(
    sdhqAuthorAvatarCache,
    authorId,
    `https://steamdeckhq.com/wp-json/wp/v2/users/${authorId}`
  );
}

/**
 * Fetches Steam Deck HQ game review and author avatar data.
 * @param appId
 * @return {Promise<{rating: sdhq_rating[0] | null, avatar: {mpp_avatar: {[24 | 48 | 96 | 150 | 300 | full]: string}} | null}>}
 */
async function fetchSteamDeckHQData(appId) {
  let rating = await fetchSteamDeckHQRating(appId);
  let avatar = await fetchSteamDeckHQAuthorAvatar(rating?.author);
  return {rating, avatar};
}

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(async ({type, appId}) => {
    switch (type) {
      case MessageType.PROTON_DB:
        return port.postMessage({
          type,
          appId,
          data: await fetchProtonDb(appId)
        });
      case MessageType.DECK_VERIFIED:
        return port.postMessage({
          type,
          appId,
          data: await fetchDeckVerified(appId)
        });
      case MessageType.SD_HQ:
        return port.postMessage({
          type,
          appId,
          data: await fetchSteamDeckHQData(appId)
        });
      case MessageType.ALL:
        return port.postMessage({
          type,
          appId,
          data: {
            protonDb: await fetchProtonDb(appId),
            deckVerified: await fetchDeckVerified(appId),
            sdhq: await fetchSteamDeckHQData(appId)
          }
        });
      default: console.error(new Error(`${type} unknown`));
    }
  })
});
