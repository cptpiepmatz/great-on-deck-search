// in memory cache for the api responses
let cache = new Map();

// make request to proton db and bounce the result back to the content script
chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(({name, appId}) => {
    if (!appId || appId.includes(",")) return;

    if (cache.has(appId)) {
      port.postMessage(cache.get(appId));
      return;
    }

    Promise
      .all([
        fetch(`https://www.protondb.com/api/v1/reports/summaries/${appId}.json`),
        fetch(`https://www.protondb.com/proxy/steam/deck-verified?nAppID=${appId}`)
      ])
      .then(([dbRes, verifiedRes]) => {
        if (dbRes.ok && verifiedRes.ok) {
          Promise
            .all([dbRes.json(), verifiedRes.json()])
            .then(data => {
              let msg = [name, appId, ...data];
              port.postMessage(msg);
              cache.set(appId, msg);
            });
        }
      });
  });
});
