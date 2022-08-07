import SessionCache from "./common/session_cache";
import cachedFetch from "./common/cached_fetch";

/** Cache for the Deck Verifications. */
const cache = new SessionCache("proton_db");

/**
 * Fetches ProtonDB entries.
 * @param {string} appId ID of the app to fetch
 * @return {Promise<null|{tier: string}>}
 */
async function fetchProtonDB(appId) {
  const url = `https://www.protondb.com/api/v1/reports/summaries/${appId}.json`;
  return await cachedFetch(cache, appId, url);
}

export default fetchProtonDB;
