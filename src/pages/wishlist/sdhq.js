import trimHtml from "../common/trim_html.js";
import ratingImg from "../common/sdhq/rating_img.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import parser from "../common/parser.js";
import {Setting} from "../common/fetch_settings.js";

/**
 * Creates an element for the search wishlist row displaying the SDHQ game
 * review rating.
 * @param {string} link link to the game review
 * @param {SDHQRating} stars the rating of the review
 * @param {object} cats the breakdown of the review rating
 * @return {[HTMLDivElement, HTMLDivElement]}
 */
function createElement(link, stars, cats) {
  const labelHtml = trimHtml(`
    <div class="sgodos wishlist-page sdhq label">
      SDHQ BUILD SCORE:
    </div>
  `);
  const valueHtml = trimHtml(`
    <div class="sgodos wishlist-page sdhq value">
      <a href="${link}" target="_blank">
        <img 
          src="${ratingImg(stars)}" 
          data-tooltip-text="
            Performance: ${cats.performance};
            Visuals: ${cats.visuals};
            Stability: ${cats.stability};
            Controls: ${cats.controls};
            Battery: ${cats.battery};
          "
        >
      </a>
    </div>
  `);
  return [
    parser.parseFromString(labelHtml, "text/html").querySelector("div"),
    parser.parseFromString(valueHtml, "text/html").querySelector("div")
  ];
}

/**
 * Places the SDHQ stars on a row in the wishlist.
 * @param {number | string} appId id of the app
 * @param {Element} row row to inject the medal into
 * @param {Record<Setting, boolean>} settings provided settings
 * @return {Promise<void>}
 */
async function sdhqWishlistPage(appId, row, settings) {
  let {data} = await requestBackground(RequestType.SDHQ, appId);
  if (!data.sdhq || !data.sdhq.rating) return;

  const isFirstLook = data.sdhq.rating.acf.is_first_look;
  if (!(
    (isFirstLook && settings[Setting.SDHQ_FIRST_LOOK]) ||
    (!isFirstLook && settings[Setting.SDHQ])
  )) return;

  let [label, value] = createElement(
    data.sdhq.rating.link,
    data.sdhq.rating.acf.sdhq_rating,
    data.sdhq.rating.acf.sdhq_rating_categories
  );
  row.querySelector(".stats").append(label, value);
}

export default sdhqWishlistPage;
