import RequestType from "./common/request.js";
import fetchDeckVerified from "./deck_verified.js";
import fetchProtonDB from "./proton_db.js";
import fetchSteamDeckHQData from "./sdhq.js";

chrome.runtime.onConnect.addListener(port => {
  const onMessageHandler = async ({type, appId, reqId}) => {
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
    port.postMessage({type, appId, reqId, data});
  }
  port.onMessage.addListener(onMessageHandler);
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(onMessageHandler);
  });
});
