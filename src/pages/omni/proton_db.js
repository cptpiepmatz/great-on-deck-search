import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";

/**
 * Creates an element for the hover box displaying the ProtonDB medal.
 * @param {string} tier
 * @return {HTMLDivElement}
 */
function createElement(tier) {
  const html = trimHtml(`
    <div class="app_tag sgodos proton-db proton-db-rating-${tier}">${tier}</div>
  `);
  return parser.parseFromString(html, "text/html").querySelector("div");
}

/**
 * Places the ProtonDB medal in a container in hover boxes.
 * @param {number | string} appId
 * @param {Element} container
 * @return {Promise<void>}
 */
async function protonDBHoverBox(appId, container) {
  let {data} = await requestBackground(RequestType.PROTON_DB, appId);
  if (!data.proton_db || !data.proton_db.tier) return;
  if (data.proton_db.tier === "pending") return;
  container.appendChild(createElement(data.proton_db.tier));
}

export default protonDBHoverBox;
