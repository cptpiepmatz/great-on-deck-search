/** Enum of all the settings the extension uses. */
export const Setting = {
  PROTON_DB: "toggleProtonDB",
  DECK_VERIFIED: "toggleDeckVerified",
  SDHQ: "toggleSteamDeckHQ",
  SDHQ_FIRST_LOOK: "toggleSteamDeckHQFirstLook"
}

/**
 * Fetches the settings from the browser.
 * @param {Setting} keys keys to fetch settings
 * @return {Promise<{[key: Setting]: boolean | undefined}>}
 */
function fetchSettings(...keys) {
  return new Promise(resolve => {
    chrome.storage.sync.get(keys, settings => {
      let defaultSettings = {};
      for (let val of Object.values(Setting)) defaultSettings[val] = true;
      resolve(Object.assign(defaultSettings, settings));
    });
  });
}

export default fetchSettings;
