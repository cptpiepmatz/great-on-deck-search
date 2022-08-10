import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";

/**
 * Creates an HTML element containing the proton db medal icon.
 * @param {string} rating proton db rating
 * @return {Element}
 */
function createElement(rating) {
  const html = `
    <span class="sgodos front-page proton-db medal">
      <span 
        class="sgodos proton-db proton-db-rating-${rating}"
      >${rating.toUpperCase()}</span>
    </span>
  `;
  let parser = new DOMParser();
  return parser.parseFromString(html, "text/html").querySelector("span");
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
    .prepend(createElement(data.proton_db.tier));
}

export default protonDBFrontPage;
