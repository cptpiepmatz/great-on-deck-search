import RequestType from "./common/request";
import fetchDeckVerified from "./deck_verified";
import fetchProtonDB from "./proton_db";
import fetchSteamDeckHQData from "./sdhq";

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(async ({type, appId}) => {
    let reqTypes = [type].flat();
    let req = [];
    for (let reqType of reqTypes) {
      switch (reqType) {
        case RequestType.DECK_VERIFIED:
          req.push(fetchDeckVerified(appId));
          break;
        case RequestType.PROTON_DB:
          req.push(fetchProtonDB(appId));
          break;
        case RequestType.SDHQ:
          req.push(fetchSteamDeckHQData(appId));
          break;
      }
    }
    let res = await Promise.all(req);
    let data = {};
    for (let [i, reqType] of reqTypes.entries()) data[reqType] = res[i];
    port.postMessage({type, appId, data});
  });
});
