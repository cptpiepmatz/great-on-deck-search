/**
 * Utility function to fetch data but check the cache first.
 * @param {SessionCache} cache cache to check
 * @param {number|string} requestId id to request data for
 * @param {string} fetchUrl url to request data from if cache miss
 * @return {Promise<null|any>}
 */
async function cachedFetch(cache, requestId, fetchUrl) {
  // return null if the request id is invalid
  if (!requestId) return null;

  // return data from cache if possible
  let cached = await cache.get(requestId);
  if (cached !== undefined) return cached;

  // fetch the data from the url
  try {
    // if fetching fails, just return null for now
    // cache will not be updated so next request we try again
    let res = await fetch(fetchUrl);
    if (res.ok) {
      let json = await res.json();
      await cache.set(requestId, json);
      return json;
    }
    await cache.set(requestId, null);
    return null;
  }
  catch (e) {
    return null;
  }
}

export default cachedFetch;
