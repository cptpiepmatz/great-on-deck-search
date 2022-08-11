import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import dbEntry from "../common/proton_db/db_entry.js";

/**
 * Creates an element for the games page displaying the ProtonDB medal.
 * @param {number | string} appId
 * @param {string} tier
 * @return {HTMLAnchorElement}
 */
function createElement(appId, tier) {
  const html = trimHtml(`
    <a 
      href="${dbEntry(appId)}" 
      target="_blank"
      class="sgodos games-page proton-db medal"
    >
      <span class="sgodos games-page proton-db proton-db-rating-${tier}">
        ${tier.toUpperCase()}
      </span>
    </a>
  `);
  return parser.parseFromString(html, "text/html").querySelector("a");
}

/**
 * Places the ProtonDB medal on a row in a user's games list.
 * @param {number | string} appId
 * @param {Element} row
 * @return {Promise<void>}
 */
async function protonDBGamesPage(appId, row) {
  let {data} = await requestBackground(RequestType.PROTON_DB, appId);
  if (!data.proton_db || !data.proton_db.tier) return;
  if (data.proton_db.tier === "pending") return;
  row
    .querySelector(".sgodos.games-page.extra")
    .append(createElement(appId, data.proton_db.tier));
}

export default protonDBGamesPage;
