/**
 * Enum of different requests between content and background script.
 * @type {{PROTON_DB: number, DECK_VERIFIED: number, SDHQ: number}}
 */
const RequestType = {
  DECK_VERIFIED: "deck_verified",
  PROTON_DB: "proton_db",
  SDHQ: "sdhq"
}

export default RequestType;
