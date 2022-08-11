/** Function to handle the contents of the front page. */
import sdhqFrontPage from "./sdhq.js";
import fetchSettings, {Setting} from "../common/fetch_settings.js";
import deckVerifiedFrontPage from "./deck_verified.js";
import protonDBFrontPage from "./proton_db.js";

function handleFrontPage() {
  if (!testFrontPage()) return;

  let carousel = document.querySelector(".carousel_items");
  let observer = new MutationObserver(() => tagHeroes().catch(console.error));
  observer.observe(carousel, {childList: true, subtree: true});
  if (carousel.children.length) tagHeroes().catch(console.error);

  async function tagHeroes() {
    observer.disconnect();
    let settings = await fetchSettings(Setting.SDHQ, Setting.DECK_VERIFIED, Setting.PROTON_DB);
    if (settings[Setting.SDHQ]) for (let item of carousel.children) {
      sdhqFrontPage(item.dataset.dsAppid, item).catch(console.error);
    }
    if (settings[Setting.DECK_VERIFIED]) for (let item of carousel.children) {
      deckVerifiedFrontPage(item.dataset.dsAppid, item).catch(console.error);
    }
    if (settings[Setting.PROTON_DB]) for (let item of carousel.children) {
      protonDBFrontPage(item.dataset.dsAppid, item).catch(console.error);
    }
  }
}

/**
 * Test if the current page is the front page.
 * @return {boolean}
 */
function testFrontPage() {
  return !!document.querySelector(".carousel_items");
}

export default handleFrontPage;
