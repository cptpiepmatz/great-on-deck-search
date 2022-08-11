import fetchSettings, {Setting} from "../common/fetch_settings.js";
import deckVerifiedAppPage from "./deck_verified.js";
import protonDBAppPage from "./proton_db.js";
import sdhqAppPage from "./sdhq.js";

/** Function to handle the contents of the app page. */
function handleAppPage() {
  if (!testAppPage()) return;

  // pull the App ID from the URL
  let {appId} = document.location.pathname
    .match(/\/(?<appId>\d+)\/[^/]+\//).groups;
  let gameMetaData = document.querySelector(".game_meta_data");
  let navbar = document.querySelector(".apphub_OtherSiteInfo");

  fetchSettings(Setting.SDHQ, Setting.DECK_VERIFIED, Setting.PROTON_DB).then(async settings => {
    if (settings[Setting.DECK_VERIFIED]) await deckVerifiedAppPage();
    if (settings[Setting.PROTON_DB]) await protonDBAppPage(appId, gameMetaData, navbar);
    if (settings[Setting.SDHQ]) await sdhqAppPage(appId, gameMetaData, navbar);
  });
}

/**
 * Test if the current page is the app page.
 * @return {boolean}
 */
function testAppPage() {
  return document.location.pathname.includes("/app/");
}

export default handleAppPage;
