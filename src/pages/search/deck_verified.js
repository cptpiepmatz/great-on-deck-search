import badges from "../common/deck_verified/badge.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";

/** HTML parser for the element creation. */
const parser = new DOMParser();

/**
 * Creates an element for the search results row displaying the deck verification status.
 * @param {0 | 1 | 2 | 3} status steam deck verification status
 * @return {HTMLSpanElement}
 */
function createElement(status) {
  const html = `
    <span class="sgodos search-page deck-verified badge">
      <img src="${badges[status].iconUrl}">
    </span>
  `;
  return parser.parseFromString(html, "text/html").querySelector("span");
}

/**
 * Premade badge elements to reduce the parsing effort.
 * @type {HTMLSpanElement[]}
 */
const badgeElements = [0, 1, 2, 3].map(createElement);

/**
 * Places the steam deck verification icons on a row in the search results.
 * @param {number | string} appId id of the app
 * @param {Element} row row element to inject the badge into
 * @return {Promise<void>}
 */
async function deckVerifiedSearchPage(appId, row) {
  let {data} = await requestBackground(RequestType.DECK_VERIFIED, appId);
  if (!data.deck_verified || !data.deck_verified.results) return;

  let platforms = row.querySelector("div.col.search_name div");
  platforms.append(badgeElements[data.deck_verified.results.resolved_category]
      .cloneNode(true)
  );
}

export default deckVerifiedSearchPage;
