import fetchSettings, {Setting} from "../common/fetch_settings.js";
import deckVerifiedWishlistPage from "./deck_verified.js";
import protonDBWishlistPage from "./proton_db.js";
import sdhqWishlistPage from "./sdhq.js";

/** Function to handle the contents of the wishlist  page. */
function handleWishlistPage() {
  if (!testWishlistPage()) return;

  let observer = new MutationObserver(() => applyBadges().catch(console.error));

  let pSettings = fetchSettings(Setting.SDHQ, Setting.PROTON_DB, Setting.DECK_VERIFIED);

  let wishlistContainer = document.querySelector("#wishlist_ctn");
  observer.observe(wishlistContainer, {childList: true, subtree: true});
  applyBadges().catch(console.error);

  async function applyBadges() {
    let wishlistRows = document.querySelectorAll(
      ".wishlist_row[data-app-id]:not(.sgodos.tagged)"
    );

    // tag rows to not recalculate them
    for (let row of wishlistRows) row.classList.add("sgodos", "tagged");

    // to display elements spaced evenly this separator is needed
    let separator = document.createElement("div");
    separator.classList.add("sgodos", "wishlist-page", "separator");
    for (let row of wishlistRows) {
      row
        .querySelector(".content")
        .children[1]
        .after(separator.cloneNode(true));
    }

    let settings = await pSettings;
    if (settings[Setting.DECK_VERIFIED]) for (let row of wishlistRows) {
      deckVerifiedWishlistPage(row.dataset.appId, row).catch(console.error);
    }
    if (settings[Setting.PROTON_DB]) for (let row of wishlistRows) {
      protonDBWishlistPage(row.dataset.appId, row).catch(console.error);
    }
    if (settings[Setting.SDHQ]) for (let row of wishlistRows) {
      sdhqWishlistPage(row.dataset.appId, row).catch(console.error);
    }
  }
}

/**
 * Test if the current page is the wishlist page.
 * @return {boolean}
 */
function testWishlistPage() {
  return document.location.pathname.includes("/wishlist/");
}

export default handleWishlistPage;
