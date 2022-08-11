import ratingImg from "../common/sdhq/rating_img.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";

/**
 * Creates an element for the search results row displaying the SDHQ game review rating.
 * @param {string} link link to the game review
 * @param {SDHQRating} stars the rating of the review
 * @return {HTMLAnchorElement}
 */
function createElement(link, stars) {
  const html = trimHtml(`
    <a href="${link}" target="_blank" class="sgodos search-page sdhq stars">
        <img src="${ratingImg(stars)}">
    </a>
  `);
  return parser.parseFromString(html, "text/html").querySelector("a");
}

/**
 * Places the SDHQ stars on a row in the search results.
 * @param {number | string} appId id of the app
 * @param {Element} row row to inject medal into
 * @return {Promise<void>}
 */
async function sdhqSearchPage(appId, row) {
  let {data} = await requestBackground(RequestType.SDHQ, appId);
  if (!data.sdhq || !data.sdhq.rating) return;

  row
    .querySelector(".col.search_released")
    .appendChild(createElement(data.sdhq.rating.link, data.sdhq.rating.acf.sdhq_rating))
}

export default sdhqSearchPage;
