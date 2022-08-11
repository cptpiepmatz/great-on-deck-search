import fetchSettings, {Setting} from "../common/fetch_settings.js";
import protonDBGamesPage from "./proton_db.js";
import deckVerifiedGamesPage from "./deck_verified.js";
import sdhqGamesPage from "./sdhq.js";

function handleGamesPage() {
  if (!testGamesPage()) return;

  applyBadges().catch(console.error);
  async function applyBadges() {
    let rows = document.querySelectorAll(
      "#games_list_row_container .gameListRow"
    );
    let settings = await fetchSettings(
      Setting.SDHQ, Setting.DECK_VERIFIED, Setting.PROTON_DB
    );

    for (let row of rows) {
      let sgodosDiv = document.createElement("div");
      sgodosDiv.classList.add("sgodos", "games-page", "extra");
      row.querySelector(".gameListRowItemTopPrimary").append(sgodosDiv);
    }

    if (settings[Setting.PROTON_DB]) for (let row of rows) {
      let appId = row.id.split("game_")[1];
      if (appId) protonDBGamesPage(appId, row).catch(console.error);
    }

    if (settings[Setting.DECK_VERIFIED]) for (let row of rows) {
      let appId = row.id.split("game_")[1];
      if (appId) deckVerifiedGamesPage(appId, row).catch(console.error);
    }

    if (settings[Setting.SDHQ]) for (let row of rows) {
      let appId = row.id.split("game_")[1];
      if (appId) sdhqGamesPage(appId, row).catch(console.error);
    }
  }
}

function testGamesPage() {
  return document.location.pathname.includes("/games")
    && document.querySelector("#games_list_row_container");
}

export default handleGamesPage;
