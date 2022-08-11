/**
 * Tiered cache using a map and the session storage as caching layers.
 */
class SessionCache {
  /** Map used as tier 1 cache. */
  cache = new Map();

  /**
   * Namespace for the session storage.
   * @type {string}
   */
  namespace;

  /**
   * Constructs a session cache.
   * @param {string} namespace namespace for the session storage
   */
  constructor(namespace) {
    this.namespace = namespace;
  }

  /**
   * Helper function used to construct the key for the session storage.
   * @param {string} key basic key for the cache
   * @return {string}
   */
  storageKey(key) {
    return `cache-${this.namespace}: ${key}`;
  }

  /**
   * Returns the results from the cache.
   *
   * Firstly this tries to return data from the primary in-memory cache.
   * Secondly this tries to return data from the secondary session storage.
   *
   * Data that is in the session storage but not in the internal map will be
   * pushed to it.
   * @param {string|number} key key to retrieve data from
   * @return {Promise<any>}
   */
  async get(key) {
    let mapResult = this.cache.get(key);
    if (mapResult) return mapResult;
    if (!chrome.storage.session) return undefined;
    let storageResult = await chrome.storage.session.get(this.storageKey(key));
    if (storageResult && Object.keys(storageResult).length) {
      this.cache.set(key, storageResult);
      return storageResult;
    }
    return undefined;
  }

  /**
   * Store the value in both cache tiers.
   * @param {string|number} key key to insert data for
   * @param {Promise<any>} value data to insert
   */
  async set(key, value) {
    this.cache.set(key, value);
    let store = {};
    store[this.storageKey(key)] = value;
    await chrome.storage.session?.set(store);
  }
}

export default SessionCache;
