/**
 * Get the ProtonDB entry url.
 * @param {number | string} appId id of the app
 * @return {string}
 */
function dbEntry(appId) {
  return `https://protondb.com/app/${appId}`;
}

export default dbEntry;
