import trimHtml from "../common/trim_html.js";
import dbEntry from "../common/proton_db/db_entry.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import parser from "../common/parser.js";

/**
 * Creates an element for the wishlist row displaying the ProtonDB medal.
 * @param {string} tier rated tier
 * @param {number | string} appId id of the app
 * @return {HTMLAnchorElement}
 */
function createElement(tier, appId) {
  const html = trimHtml(`
    <a 
      class="sgodos wishlist-page proton-db medal" 
      href="${dbEntry(appId)}"
      target="_blank"
    >
      <span class="sgodos wishlist-page proton-db proton-db-rating-${tier}">
        ${tier.toUpperCase()}
      </span>
    </a>
  `);
  return parser.parseFromString(html, "text/html").querySelector("a");
}

/**
 * Places the ProtonDb medal on a row in the wishlist.
 * @param {number | string} appId id of the app
 * @param {Element} row row to inject the medal into
 * @return {Promise<void>}
 */
async function protonDBWishlistPage(appId, row) {
  let {data} = await requestBackground(RequestType.PROTON_DB, appId);
  if (!data.proton_db || !data.proton_db.tier) return;
  if (data.proton_db.tier === "pending") return;
  row
    .querySelector(".platform_icons")
    .append(createElement(data.proton_db.tier, appId));
}

export default protonDBWishlistPage;
