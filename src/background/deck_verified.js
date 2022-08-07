import SessionCache from "./common/session_cache";
import cachedFetch from "./common/cached_fetch";

/** Cache for the Deck Verifications. */
const cache = new SessionCache("deck_verified");

/**
 * Fetches Deck Verified Status.
 * @param {string} appId ID of the app to fetch
 * @return {Promise<{resolved_category: (0|1|2|3)}|null>}
 */
async function fetchDeckVerified(appId) {
  const url = `https://www.protondb.com/proxy/steam/deck-verified?nAppID=${appId}`;
  return await cachedFetch(cache, appId, url);
}

export default fetchDeckVerified;
