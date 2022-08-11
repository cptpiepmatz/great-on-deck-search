import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import dbEntry from "../common/proton_db/db_entry.js";
import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";


/**
 * Creates an element for the search results row displaying the ProtonDB medal.
 * @param {number | string} appId id of the app
 * @param {string} tier rated tier
 * @return {HTMLSpanElement}
 */
function createElement(appId, tier) {
  const html = trimHtml(`
    <span class="sgodos search-page proton-db medal">
      <a 
        href="${dbEntry(appId)}" 
        target="_blank"
        class="sgodos search-page proton-db proton-db-rating-${tier}"
      >${tier.toUpperCase()}</a>
    </span>
  `);
  return parser.parseFromString(html, "text/html").querySelector("span");
}

/**
 * Places the ProtonDB medal on a row in the search results.
 * @param {number | string} appId id of the app
 * @param {Element} row row to inject medal into
 * @return {Promise<void>}
 */
async function protonDBSearchPage(appId, row) {
  let {data} = await requestBackground(RequestType.PROTON_DB, appId);
  if (!data.proton_db || !data.proton_db.tier) return;

  let platforms = row.querySelector("div.col.search_name div");
  if (data.proton_db.tier === "pending") return;
  platforms.append(createElement(appId, data.proton_db.tier));
}

export default protonDBSearchPage;
