/** IDs of the toggles, will also be used as keys for the settings. */
const toggleIds = [
  "toggleProtonDB",
  "toggleDeckVerified",
  "toggleSteamDeckHQ",
  "toggleSteamDeckHQFirstLook"
];

/**
 * Fetches the settings from the browser.
 * @param keys Keys to fetch settings
 * @return {Promise<object>}
 */
function fetchSettings(...keys) {
  return new Promise(resolve => {
    chrome.storage.sync.get(keys, resolve);
  });
}

let settings = fetchSettings(...toggleIds);
document.addEventListener("DOMContentLoaded", async () => {
  // fetches all the settings and defaults to true for every key
  settings = Object.assign(
    Object.fromEntries(toggleIds.map(id => [id, true])),
    await settings
  );

  // get every toggle and update it value to the settings
  let toggles = new Map(toggleIds.map(id => [id, document.getElementById(id)]));
  for (let [id, toggle] of toggles) {
    toggle.checked = settings[id];
    toggle.addEventListener("click", e => {
      // upon clicking on a toggle it should update the setting
      e.preventDefault();
      let key = {};
      key[id] = toggle.checked;
      chrome.storage.sync.set(key, res => {
        toggle.checked = !toggle.checked;
      });
    });
  }
});
