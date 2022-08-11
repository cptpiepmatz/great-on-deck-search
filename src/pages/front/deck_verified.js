import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import Badge from "../common/deck_verified/badge.js";
import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";

/**
 * Creates an HTML element containing the steam deck verification icon.
 * @param {0 | 1 | 2 | 3} status verification status
 * @return {Element}
 */
function createElement(status) {
  const html = trimHtml(`
    <span class="sgodos front-page deck-verified badge platform_img">
      <img src="${Badge[status].iconUrl}">
    </span>
  `);
  return parser.parseFromString(html, "text/html").querySelector("span");
}

/**
 * Request deck verification data for the app of the hero and render the badge.
 * @param {number | string} appId id of the app
 * @param {Element} hero hero element to render the rating onto
 * @return {Promise<void>}
 */
async function deckVerifiedFrontPage(appId, hero) {
  const {data} = await requestBackground(RequestType.DECK_VERIFIED, appId);
  if (!data.deck_verified) return;
  hero
    .querySelector(".platforms")
    .prepend(createElement(data.deck_verified.results.resolved_category));
}

export default deckVerifiedFrontPage;
