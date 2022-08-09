/**
 * Assign some classes on the deck verified results in order to lift it to the top.
 * @return {Promise<void>}
 */
async function deckVerifiedAppPage() {
  document
    .querySelector(`[data-featuretarget="deck-verified-results"]`)
    ?.classList
    .add("sgodos", "app-page", "deck-verified");
}

export default deckVerifiedAppPage;
