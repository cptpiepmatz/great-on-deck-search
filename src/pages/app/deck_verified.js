import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";
import badges from "../common/deck_verified/badge.js";

/**
 * Creates an element for the sidebar displaying the deck verification status.
 * This is only used when the original verification status isn't available.
 * @param {0 | 1 | 2 | 3} status verification status of the app
 * @return {HTMLDivElement}
 */
function createSidebarElement(status) {
  let badge = badges[status];
  const html = trimHtml(`
    <div 
      data-featuretarget="deck-verified-results " 
      class="sgodos app-page deck-verified"
    >
      <div class="deckverified_BannerContainer_2b4eh">
        <div class="deckverified_BannerHeader_1IgJ0">
          Steam Deck Compatibility
        </div>
      <div class="deckverified_BannerContent_1B2KF">
        <div>
          <img class="
              badge
              shared_svg_library_SteamDeckCompatVerified_3mvZq 
              deckverified_CategoryIcon_2yDLe
            " src="${badge.iconUrl}">
          <span class="deckverified_CompatibilityDetailRatingDescription__2HWJ">
            ${badge.name[0].toUpperCase() + badge.name.slice(1)}
          </span>
        </div>
      </div>
    </div>
  </div>
  `);

  return parser.parseFromString(html, "text/html").querySelector("div");
}

/**
 * Assign some classes on the deck verified results in order to lift it to the
 * top.
 * @return {Promise<void>}
 */
async function deckVerifiedAppPage(appId, sidebar) {
  let deckVerifiedResults =
    document.querySelector(`[data-featuretarget="deck-verified-results"]`);

  if (deckVerifiedResults) {
    deckVerifiedResults
      .classList
      .add("sgodos", "app-page", "deck-verified");
  }
  else {
    let {data} = await requestBackground(RequestType.DECK_VERIFIED, appId);
    if (!data?.deck_verified?.results?.resolved_category) return;
    sidebar.prepend(createSidebarElement(data.deck_verified.results.resolved_category));
  }
}

export default deckVerifiedAppPage;
