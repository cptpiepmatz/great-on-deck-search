/** Types of messages for content-background communication. */
const MessageType = {
  PROTON_DB: "protonDb",
  DECK_VERIFIED: "deckVerified",
  PROTON_DB_AND_DECK_VERIFIED: "protonDb_and_deckVerified"
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
      case MessageType.PROTON_DB_AND_DECK_VERIFIED:
        return port.postMessage({
          type,
          appId,
          data: {
            protonDb: await fetchProtonDb(appId),
            deckVerified: await fetchDeckVerified(appId)
          }
        });
      default: console.error(new Error(`${type} unknown`));
    }
  })
});
