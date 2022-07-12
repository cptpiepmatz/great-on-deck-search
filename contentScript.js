/** Types of messages for content-background communication. */
const MessageType = {
  PROTON_DB: "protonDb",
  DECK_VERIFIED: "deckVerified",
  PROTON_DB_AND_DECK_VERIFIED: "protonDb_and_deckVerified"
}

/** Names of the Deck Verification. */
const deckBadges = [
  "unknown",
  "unsupported",
  "playable",
  "verified"
];

/** Icon URLs for the Deck Verified Icons. */
const deckBadgeIcons = [
  // unknown
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/1a3a76c9e8dacf756b822247a23bef435768a5ff.png",

  // unsupported
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/dd56b9d37f5b5bf4da236b9bd3d62e3d120d7df5.png",

  // playable
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/16e802051c2a3b99c7f1720b7de7fad6e540e02a.png",

  // verified
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/82a3cff3038fbb4c36fabb5dd79540b23fa9a4d4.png"
];

/** Port used to connect with background service. */
const port = chrome.runtime.connect();

/** DOM parser for creating elements. */
const parser = new DOMParser();

// inject ProtonDB font into the store page
let font = document.createElement("style");
font.innerText = "@import url('https://fonts.googleapis.com/css2?family=Rationale&display=swap');";
document.head.appendChild(font);

/**
 * Create the HTML element to display the ProtonDB medal.
 * @param {string} tier Tier of the medal
 * @return {HTMLAnchorElement|null}
 */
function createProtonDbMedal(appId, tier) {
  if (!appId || !tier || tier === "pending") return null;
  let medalHTML = `
      <a 
        class="search-row-protondb" 
        href="https://protondb.com/app/${appId}" 
        target="_blank"
      >
        <span class="protondb-search-medal protondb-tier-${tier} col">
          ${tier.toUpperCase()}
        </span>
      </a>
    `;
  return parser
    .parseFromString(medalHTML, "text/html")
    .querySelector(".search-row-protondb");
}

/**
 * Create the HTML element to display the Deck Verification.
 * @param {0 | 1 | 2 | 3} cat
 * @return {HTMLSpanElement}
 */
function createDeckVerifiedIcon(cat) {
  let verifiedHtml = `
      <span class="search-row-deck deck-${deckBadges[cat]} col">
        <img src="${deckBadgeIcons[cat]}" alt="${deckBadges[cat]}">
      </span>
    `;
  return parser
    .parseFromString(verifiedHtml, "text/html")
    .querySelector(".search-row-deck");
}

/** Handle pages that show search results. */
function handleSearchResults() {
  // check if search results do exist and observe them
  let searchResultsElement = document.getElementById("search_results");
  if (!searchResultsElement) return;
  const observer = new MutationObserver(tagSearchResults);
  observer.observe(searchResultsElement, {childList: true, subtree: true});
  tagSearchResults();

  /**
   * Tag all search result rows with their icons and medals.
   * This also makes sure that only rows get marked, that aren't already.
   */
  function tagSearchResults() {
    // select all untagged rows
    let rows = document.querySelectorAll(
      "a.search_result_row:not(.tagged-medal-and-verification)"
    );
    rows.forEach(row => row.classList.add("tagged-medal-and-verification"));
    if (!rows) return;

    // extract app ID per row
    let appRows = new Map();
    for (let row of rows) {
      let appId = row.dataset.dsAppid;
      appRows.set(appId, row);
    }

    // when background service responds with data, display it
    port.onMessage.addListener(({type, appId, data}) => {
      if (type !== MessageType.PROTON_DB_AND_DECK_VERIFIED) return;
      let {protonDb, deckVerified} = data;
      let row = appRows.get(appId);
      if (!row) return;
      let iconRow = row.querySelector(".col.search_name.ellipsis").children[1];
      let deckVerifiedIcon = createDeckVerifiedIcon(deckVerified?.resolved_category);
      if (deckVerified) iconRow.append(deckVerifiedIcon);
      let protonDbMedal = createProtonDbMedal(appId, protonDb?.tier);
      if (protonDbMedal) iconRow.append(protonDbMedal);
    });

    // request data from background service
    for (let [appId, row] of appRows) {
      port.postMessage({
        type: MessageType.PROTON_DB_AND_DECK_VERIFIED,
        appId
      })
    }
  }
}
handleSearchResults();

/** Handle app store pages. */
function handleAppPage() {
  if (!document.location.pathname.includes("/app/")) return;

  // pull the App ID from the URL
  let {appId} = document.location.pathname.match(/\/(?<appId>\d+)\/[^/]+\//).groups;

  /**
   * Update the meta data sidebar on the right side of the page.
   *
   * Include a ProtonDB medal and move the Deck Verification up.
   */
  function updateGameMetaSidebar() {
    // make sure the game metadata is available,
    // all operations will take place in it
    let gameMetaData = document.querySelector(".game_meta_data");
    if (!gameMetaData) return;
    let verifiedResults = document.querySelector("[data-featuretarget='deck-verified-results']")
    if (verifiedResults) {
      // when the page has steam deck verification details, put them at the top
      verifiedResults.remove();
      gameMetaData.children[0].prepend(verifiedResults);
    }

    // upon receiving the ProtonDB data from the background service, place a block
    // with the medal
    port.onMessage.addListener(({type, appId, data}) => {
      if (type !== MessageType.PROTON_DB) return;
      let {tier} = data;
      let protonHtml = `
      <div class=block responsive_apppage_details_right">
        <a 
          id="protondb-results" 
          href="https://protondb.com/app/${appId}" 
          target="_blank"
        >
          <div class="protondb-results title">
            <img src="https://www.protondb.com/sites/protondb/images/site-logo.svg"></img>
            <span class="protondb-logo protondb-logo-proton">proton</span>
            <span class="protondb-logo protondb-logo-db">db</span>
          </div>
          <span class="protondb-results medal protondb-tier-${tier}">
            ${tier.toUpperCase()}
          </span>
        </a> 
      </div>
    `;
      let protonElement = parser
        .parseFromString(protonHtml, "text/html")
        .querySelector("div");
      gameMetaData.prepend(protonElement);
    });
  }
  updateGameMetaSidebar();

  /**
   * Update the navigation buttons on top of the page with a button for ProtonDB.
   *
   * This should make sure that the SteamDB extension does not find conflicts.
   */
  function prependNavigationButton() {
    let navbar = document.querySelector(".apphub_OtherSiteInfo");
    if (!navbar) return;
    let buttonHtml = `
      <a 
        rel="noopener" 
        class="btnv6_blue_hoverfade btn_medium protondb-nav-button" 
        href="https://protondb.com/app/${appId}"
        target="_blank"
      >
        <span data-tooltip-text="View on ProtonDB">
          <img 
            class="ico16" 
            src="https://www.protondb.com/sites/protondb/images/site-logo.svg"
          >
        </span>
      </a>
    `;
    let button = parser
      .parseFromString(buttonHtml, "text/html")
      .querySelector("a");
    navbar.prepend(button);
  }
  prependNavigationButton();

  // request ProtonDB data
  port.postMessage({type: MessageType.PROTON_DB, appId});
}
handleAppPage();

/** Handle store front page. */
function handleFrontPage() {
  // get the carousel items
  // if they are initially empty, observer until they are filled
  let carousel = document.querySelector(".carousel_items");
  if (!carousel) return;
  let observer = new MutationObserver(tagHeroes);
  observer.observe(carousel, {childList: true, subtree: true});
  if (carousel.children.length) tagHeroes();

  function tagHeroes() {
    observer.disconnect();

    let appHeroes = new Map();

    for (let item of carousel.children) {
      let appId = item.dataset.dsAppid;
      appHeroes.set(appId, item);
    }

    port.onMessage.addListener(({type, appId, data}) => {
      if (type !== MessageType.PROTON_DB_AND_DECK_VERIFIED) return;
      let hero = appHeroes.get(appId);
      if (!hero) return;
      let platforms = hero.querySelector(".platforms");
      let verifiedIcon = createDeckVerifiedIcon(data.deckVerified.resolved_category);
      if (verifiedIcon) platforms.prepend(verifiedIcon);
      let protonMedal = createProtonDbMedal(appId, data.protonDb.tier);
      if (protonMedal) platforms.prepend(protonMedal);
    });

    for (let [appId, hero] of appHeroes) {
      port.postMessage({type: MessageType.PROTON_DB_AND_DECK_VERIFIED, appId});
    }
  }
}
handleFrontPage();
