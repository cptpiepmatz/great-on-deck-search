import logo from "../common/sdhq/logo.js";
import ratingImg from "../common/sdhq/rating_img.js";
import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";
import {Setting} from "../common/fetch_settings.js";

/**
 * Creates an element for the sidebar displaying the SDHQ game review stars.
 * @param {string} link link of the game review
 * @param {SDHQRating} rating overall rating of the game
 * @param {{
 *         performance: SDHQRating,
 *         visuals: SDHQRating,
 *         stability: SDHQRating,
 *         controls: SDHQRating,
 *         battery: SDHQRating,
 *         score_breakdown: string
 *       }} cats rating categories
 * @param {string} authorName the author's name
 * @param {string} authorAvatar the url of the author's avatar
 * @param {boolean} isFirstLook whether it's a "first look" review
 * @return {HTMLDivElement}
 */
function createSidebarElement(link, rating, cats, authorName, authorAvatar, isFirstLook) {
  const html = trimHtml(`
    <div class="block responsive_apppage_details_right sgodos app-page sdhq sidebar-element">
      <a href="${link}" target="_blank">
        <div class="sgodos app-page sdhq sidebar-logo">
          <img src="${logo}">
        </div>
        ${isFirstLook ? `
        <div class="sgodos app-page sdhq first-look">
          <span data-tooltip-text="A SDHQ First Impression of the Game">FIRST LOOK</span>
        </div>
        ` : ""}
        <div class="sgodos app-page sdhq sidebar-review-row">
          <img 
            class="sgodos app-page sdhq star-rating"
            src="${ratingImg(rating)}"
            data-tooltip-text="
              Performance: ${cats.performance};
              Visuals: ${cats.visuals};
              Stability: ${cats.stability};
              Controls: ${cats.controls};
              Battery: ${cats.battery};
            "
          >
          <div class="sgodos app-page sdhq separator"></div>
          <picture 
            class="sgodos app-page sdhq avatar"
            data-tooltip-text="Reviewed By: ${authorName}"
          >
            <source srcset="${authorAvatar}">
            <img src="${logo}">
          </picture>
        </div>
      </a>
    </div>
  `);
  return parser.parseFromString(html, "text/html").querySelector("div");
}

/**
 * Creates the button element for the navbar at the top.
 * @param {string} link link to the game review
 * @return {HTMLAnchorElement}
 */
function createNavButton(link) {
  const html = trimHtml(`
    <a
      rel="noopener"
      class="btnv6_blue_hoverfade btn_medium sgodos app-page sdhq nav-button"
      href="${link}"
      target="_blank"
    >
      <span data-tooltip-text="View on Steam Deck HQ">
        <img class="ico16" src="${logo}">
      </span>
    </a>
  `);
  return parser.parseFromString(html, "text/html").querySelector("a");
}

/**
 * Places the nav button on top and the SDHQ game review on the sidebar.
 * @param {number | string} appId id of the app
 * @param {Element} sidebar sidebar element of the app page
 * @param {Element} navbar navbar element of the app page
 * @param {Record<Setting, boolean>} settings provided settings
 * @return {Promise<void>}
 */
async function sdhqAppPage(appId, sidebar, navbar, settings) {
  const {data} = await requestBackground(RequestType.SDHQ, appId);
  if (!data.sdhq || !data.sdhq.rating || !data.sdhq.avatar) return;
  const isFirstLook = data.sdhq.rating.acf.is_first_look;
  if (!(
    (isFirstLook && settings[Setting.SDHQ_FIRST_LOOK]) ||
    (!isFirstLook && settings[Setting.SDHQ])
  )) return;
  sidebar.prepend(createSidebarElement(
    data.sdhq.rating.link,
    data.sdhq.rating.acf.sdhq_rating,
    data.sdhq.rating.acf.sdhq_rating_categories,
    data.sdhq.rating.author_meta.display_name,
    data.sdhq.avatar.mpp_avatar.full,
    data.sdhq.rating.acf.is_first_look
  ));
  navbar.prepend(createNavButton(data.sdhq.rating.link));
}

export default sdhqAppPage;
