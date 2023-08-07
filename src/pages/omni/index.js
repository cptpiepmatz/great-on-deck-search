import fetchSettings, {Setting} from "../common/fetch_settings.js";
import deckVerifiedHoverBox from "./deck_verified.js"
import protonDBHoverBox from "./proton_db.js";
import app from "../app/index.js";

/** Function to handle the contents of every page of the store. */
function handleOmni() {
  fetchSettings(
    Setting.SDHQ,
    Setting.DECK_VERIFIED,
    Setting.PROTON_DB,
    Setting.SDHQ_FIRST_LOOK
  ).then(async settings => {
    if (
      !settings[Setting.SDHQ] &&
      !settings[Setting.DECK_VERIFIED] &&
      !settings[Setting.PROTON_DB] &&
      !settings[Setting.SDHQ_FIRST_LOOK]
    ) return;

    function handleGameHoverContainer(container) {
      new MutationObserver(async mutations => {
        for (let mutation of mutations) for (let node of mutation.addedNodes) {
          let appId = +node.id?.split("_")?.[2];
          if (!appId) continue;

          let element = document.createElement("div");
          element.classList.add("hover_body", "sgodos", "omni");
          element.textContent = " Steam Deck Compatibility: ";

          let row = document.createElement("div");
          row.classList.add("hover_tag_row");
          element.appendChild(row);

          if (settings[Setting.DECK_VERIFIED]) {
            await deckVerifiedHoverBox(appId, row);
          }

          if (settings[Setting.PROTON_DB]) {
            await protonDBHoverBox(appId, row);
          }

          node.appendChild(element);

        }
      }).observe(container, {childList: true});
    }

    // observe every page and check if the game hover box appears
    new MutationObserver((mutations, observer) => {
      for (let mutation of mutations) for (let node of mutation.addedNodes) {
        let gameHoverContainer = document.querySelector(
          ".game_hover_box.hover_box #global_hover_content.content"
        );
        if (!gameHoverContainer) continue;
        observer.disconnect();
        handleGameHoverContainer(gameHoverContainer);
      }
    }).observe(document.body, {childList: true});
  });
}

export default handleOmni;
