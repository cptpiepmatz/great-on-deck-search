import requestBackground from "../common/request_background.js";
import RequestType from "../../background/common/request.js";
import dbEntry from "../common/proton_db/db_entry.js";
import logo from "../common/proton_db/logo.js";
import trimHtml from "../common/trim_html.js";
import parser from "../common/parser.js";

/**
 * Creates an element for the sidebar displaying the ProtonDB medal.
 * @param {number | string} appId id of the app
 * @param {string} medal rating medal of the app
 * @return {HTMLDivElement}
 */
function createSidebarElement(appId, medal) {
  const html = trimHtml(`
    <div class="
      block 
      responsive_apppage_details_right 
      sgodos 
      app-page 
      proton-db 
      sidebar-element
    ">
      <a href="${dbEntry(appId)}" target="_blank">
        <div class="sgodos app-page proton-db sidebar-logo">
          <img src="${logo}">
          <span class="sgodos app-page proton-db name-proton">proton</span>
          <span class="sgodos app-page proton-db name-db">db</span>
        </div>
        <span class="
          sgodos 
          app-page 
          proton-db 
          sidebar-medal 
          proton-db-rating-${medal}"
        >
          ${medal.toUpperCase()}
        </span>
      </a>
    </div>
  `);
  return parser.parseFromString(html, "text/html").querySelector("div");
}

/**
 * Creates the button element for the navbar at the top.
 * @param {number | string} appId id of the app
 * @return {HTMLAnchorElement}
 */
function createNavButton(appId) {
  const html = trimHtml(`
    <a
      rel="noopener"
      class="btnv6_blue_hoverfade btn_medium sgodos app-page proton-db nav-button"
      href="https://protondb.com/app/${appId}"
      target="_blank"
    >
      <span data-tooltip-text="View on ProtonDB">
        <img class="ico16" src="${logo}">
      </span>
    </a>
  `);
  return parser.parseFromString(html, "text/html").querySelector("a");
}

/**
 * Places the nav button on top and the ProtonDB medal on the sidebar.
 * @param {number | string} appId id of the app
 * @param {Element} sidebar sidebar element of the app page
 * @param {Element} navbar navbar element of the app page
 * @return {Promise<void>}
 */
async function protonDBAppPage(appId, sidebar, navbar) {
  const {data} = await requestBackground(RequestType.PROTON_DB, appId);
  if (!data.proton_db) return;
  sidebar.prepend(createSidebarElement(appId, data.proton_db.tier));
  navbar.prepend(createNavButton(appId));
}

export default protonDBAppPage;
