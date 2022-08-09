/** Enum of all the settings the extension uses. */
export const Setting = {
  PROTON_DB: "toggleProtonDB",
  DECK_VERIFIED: "toggleDeckVerified",
  SDHQ: "toggleSteamDeckHQ"
}

/**
 * Fetches the settings from the browser.
 * @param {Setting} keys keys to fetch settings
 * @return {Promise<{[key: Setting]: boolean | undefined}>}
 */
function fetchSettings(...keys) {
  return new Promise(resolve => {
    chrome.storage.sync.get(keys, resolve);
  });
}

export default fetchSettings;
