import fetchSettings, {Setting} from "../common/fetch_settings.js";
import deckVerifiedSearchPage from "./deck_verified.js";
import protonDBSearchPage from "./proton_db.js";
import sdhqSearchPage from "./sdhq.js";

/** Function to handle the contents of the search results page. */
function handleSearchResultsPage() {
  if (!testSearchResultsPage()) return;

  let observer = new MutationObserver(() => applyBadges().catch(console.error));

  let pSettings = fetchSettings(
    Setting.SDHQ,
    Setting.PROTON_DB,
    Setting.DECK_VERIFIED,
    Setting.SDHQ_FIRST_LOOK
  );

  let searchResultContainer = document.querySelector("#search_result_container");
  observer.observe(searchResultContainer, {childList: true, subtree: true});
  applyBadges().catch(console.error);

  async function applyBadges() {
    let itemList = document.querySelectorAll("a[data-ds-appid]:not(.sgodos.tagged)");
    for (let item of itemList) item.classList.add("sgodos", "tagged");
    for (let item of itemList) {
      let releaseCol = item.querySelector(".col.search_released.responsive_secondrow");
      if (releaseCol.innerText === "") continue;
      let releaseText = releaseCol.innerText;
      releaseCol.innerText = "";
      let releaseSpan = document.createElement("span");
      releaseSpan.innerText = releaseText;
      releaseCol.appendChild(releaseSpan);
    }

    let settings = await pSettings;
    if (settings[Setting.DECK_VERIFIED]) for (let item of itemList) {
      deckVerifiedSearchPage(item.dataset.dsAppid, item).catch(console.error);
    }
    if (settings[Setting.PROTON_DB]) for (let item of itemList) {
      protonDBSearchPage(item.dataset.dsAppid, item).catch(console.error);
    }
    if (settings[Setting.SDHQ] || settings[Setting.SDHQ_FIRST_LOOK]) {
      for (let item of itemList) {
        sdhqSearchPage(item.dataset.dsAppid, item, settings).catch(console.error);
      }
    }
  }
}

/**
 * Test if the current page is the search results page.
 * @return {boolean}
 */
function testSearchResultsPage() {
  return !!document.getElementById("search_results");
}

export default handleSearchResultsPage;
