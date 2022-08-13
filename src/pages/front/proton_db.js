import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import parser from "../common/parser.js";
import trimHtml from "../common/trim_html.js";
import dbEntry from "../common/proton_db/db_entry.js";

/**
 * Creates an HTML element containing the proton db medal icon.
 * @param {number | string} appId id of the app
 * @param {string} rating proton db rating
 * @return {Element}
 */
function createElement(appId, rating) {
  const html = trimHtml(`
    <a href="${dbEntry(appId)}" class="sgodos front-page proton-db medal">
      <span 
        class="sgodos proton-db proton-db-rating-${rating}"
      >
        ${rating.toUpperCase()}
      </span>
    </a>
  `);
  return parser.parseFromString(html, "text/html").querySelector("a");
}

/**
 * Request proton db data for the app of the hero and render the medal.
 * @param {number | string} appId id of the app
 * @param {Element} hero hero element to render the medal onto
 * @return {Promise<void>}
 */
async function protonDBFrontPage(appId, hero) {
  const {data} = await requestBackground(RequestType.PROTON_DB, appId);
  if (!data.proton_db || data.proton_db.tier === "pending") return;
  hero
    .querySelector(".platforms")
    .prepend(createElement(appId, data.proton_db.tier));
}

export default protonDBFrontPage;
