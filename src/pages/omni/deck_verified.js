import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import badges from "../common/deck_verified/badge.js";

/**
 * Creates an element for the hover box displaying the steam deck verification
 * status.
 * @param {0 | 1 | 2 | 3} status verification status of the app
 * @return {HTMLDivElement}
 */
function createElement(status) {
  const imgClass = status == 0 || status == 1 ? "invert" : "";
  const html = trimHtml(`
    <div class="app_tag sgodos omni deck-verified badge">
      <img src="${badges[status].iconUrl}" class="${imgClass}">
      <span>${badges[status].name}</span>
    </div>
  `);
  return parser.parseFromString(html, "text/html").querySelector("div");
}

/**
 * Premade badge elements to reduce the parsing effort.
 * @type {HTMLDivElement[]}
 */
const badgeElements = [0, 1, 2, 3].map(createElement);

/**
 * Places the steam deck verification icon in the container.
 * @param {number | string} appId id of the app
 * @param {Element} container container element to inject the badge into
 * @return {Promise<void>}
 */
async function deckVerifiedHoverBox(appId, container) {
  let {data} = await requestBackground(RequestType.DECK_VERIFIED, appId);
  let status = data?.deck_verified?.results?.resolved_category ?? 0;
  container.appendChild(badgeElements[status].cloneNode(true));
}

export default deckVerifiedHoverBox;
