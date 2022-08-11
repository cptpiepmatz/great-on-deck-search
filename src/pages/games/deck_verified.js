import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import badges from "../common/deck_verified/badge.js";

/**
 * Creates an element for game list rows displaying the steam deck verification
 * status.
 * @param {0 | 1 | 2 | 3} status verification status of the app
 * @return {HTMLDivElement}
 */
function createElement(status) {
  const html = trimHtml(`
    <div class="sgodos games-page deck-verified badge">
      <img src="${badges[status].iconUrl}">
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
 * Places the steam deck verification icon on a row in the games list.
 * @param {number | string} appId id of the app
 * @param {Element} row row element to inject the badge into
 * @return {Promise<void>}
 */
async function deckVerifiedGamesPage(appId, row) {
  let {data} = await requestBackground(RequestType.DECK_VERIFIED, appId);
  if (!data?.deck_verified?.results?.resolved_category) return;
  row.querySelector(".sgodos.games-page.extra").append(
    badgeElements[data.deck_verified.results.resolved_category].cloneNode(true)
  );
}

export default deckVerifiedGamesPage;
