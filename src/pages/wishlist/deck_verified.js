import badges from "../common/deck_verified/badge.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";

/**
 * Crates an element for wishlist rows displaying the deck verification status.
 * @param {0 | 1 | 2 | 3} status
 * @return {HTMLSpanElement}
 */
function createElement(status) {
  const html = trimHtml(`
    <span class="sgodos wishlist-page deck-verified badge">
      <img src="${badges[status].iconUrl}">
    </span>
  `);
  return parser.parseFromString(html, "text/html").querySelector("span");
}

/**
 * Premade badge elements to reduce the parsing effort.
 * @type {HTMLSpanElement[]}
 */
const badgeElement = [0, 1, 2, 3].map(createElement);

/**
 * Places the steam deck verification icons on a row in wishlist.
 * @param {number | string} appId id of the app
 * @param {Element} row row element to inject the badge into
 * @return {Promise<void>}
 */
async function deckVerifiedWishlistPage(appId, row) {
  let {data} = await requestBackground(RequestType.DECK_VERIFIED, appId);
  if (!data.deck_verified || !data.deck_verified.results) return;
  row
    .querySelector(".platform_icons")
    .append(badgeElement[data.deck_verified.results.resolved_category]
      .cloneNode(true)
    );
}

export default deckVerifiedWishlistPage;
