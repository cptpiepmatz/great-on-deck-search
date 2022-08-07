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
   * @return {any}
   */
  get(key) {
    let mapResult = this.cache.get(key);
    if (mapResult) return mapResult;
    let storageResult = sessionStorage.getItem(this.storageKey(key));
    if (storageResult) {
      let obj = JSON.parse(storageResult);
      this.cache.set(key, obj);
      return obj;
    }
    return undefined;
  }

  /**
   * Store the value in both cache tiers.
   * @param {string|number} key key to insert data for
   * @param {any} value data to insert
   */
  set(key, value) {
    this.cache.set(key, value);
    sessionStorage.setItem(this.storageKey(key), JSON.stringify(value));
  }
}

export default SessionCache;
