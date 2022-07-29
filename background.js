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
 * Cache for the Deck Verifications.
 * @type {Map<string, null | {resolved_category: 0 | 1 | 2 | 3}>}
 */
const deckVerifiedCache = new Map();

/** Cache for the Steam Deck HQ game review ratings. */
const sdhqRatingCache = new Map();

/**
 * Fetches ProtonDB entries.
 * @param {string} appId ID of the app to fetch
 * @return {Promise<null|{tier: string}>}
 */
async function fetchProtonDb(appId) {
  if (!appId) return null;
  if (protonDbCache.has(appId)) return protonDbCache.get(appId);
  let res = await fetch(`https://www.protondb.com/api/v1/reports/summaries/${appId}.json`);
  switch (res.ok) {
    case false:
      protonDbCache.set(appId, null);
      return null;
    case true:
      let json = await res.json();
      protonDbCache.set(appId, json);
      return json;
  }
}

/**
 * Fetches Deck Verfied Status.
 * @param {string} appId ID of the app to fetch
 * @return {Promise<{resolved_category: (0|1|2|3)}|null>}
 */
async function fetchDeckVerified(appId) {
  if (!appId) return null;
  if (deckVerifiedCache.has(appId)) return deckVerifiedCache.get(appId);
  let res = await fetch(`https://www.protondb.com/proxy/steam/deck-verified?nAppID=${appId}`);
  switch (res.ok) {
    case false:
      deckVerifiedCache.set(appId, null);
      return null;
    case true:
      let json = await res.json();
      deckVerifiedCache.set(appId, json.results);
      return json.results;
  }
}

/**
 * Fetches Steam Deck HQ game review ratings.
 * @param {string} appId ID of the app to fetch
 * @return {Promise<{acf: {sdhq_rating: number}, link: string, title: {rendered: string}} | null>}
 */
async function fetchSteamDeckHQRating(appId) {
  if (!appId) return null;
  if (sdhqRatingCache.has(appId)) return sdhqRatingCache.get(appId);
  let res = await fetch(`https://steamdeckhq.com/wp-json/wp/v2/game-reviews/?meta_key=steam_app_id&meta_value=${appId}&_fields=title,acf.sdhq_rating,link`);
  switch (res.ok) {
    case false:
      sdhqRatingCache.set(appId, null);
      return null;
    case true:
      let json = await res.json();
      let data = json[0] ?? null;
      sdhqRatingCache.set(appId, data);
      return data;
  }
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
          data: await fetchSteamDeckHQRating(appId)
        });
      case MessageType.ALL:
        return port.postMessage({
          type,
          appId,
          data: {
            protonDb: await fetchProtonDb(appId),
            deckVerified: await fetchDeckVerified(appId),
            sdhq: await fetchSteamDeckHQRating(appId)
          }
        });
      default: console.error(new Error(`${type} unknown`));
    }
  })
});
