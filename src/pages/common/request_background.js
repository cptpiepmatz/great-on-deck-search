/** Port used to connect with background service. */
const port = chrome.runtime.connect();

/** Array to hold promises until they are resolved. */
const requests = [];

/** Index for the requests array. */
let reqIndex = 0;


/** Event listener for the messages from the background. */
port.onMessage.addListener(res => {
  requests[res.reqId](res);
});

/**
 * The data for the deck verification.
 * @typedef {{results: {resolved_category: 0 | 1 | 2 | 3}}} DeckVerifiedData
 */

/**
 * The data for the ProtonDB medal.
 * @typedef {{tier: string}} ProtonDBData
 */

/**
 * A SDHQ rating.
 * @typedef {0 | 1 | 2 | 3 | 4 | 5} SDHQRating
 */

/**
 * The data for the SDHQ game ratings.
 * @typedef {{
 *   rating: null | {
 *     acf: {
 *       sdhq_rating: SDHQRating,
 *       sdhq_rating_categories: {
 *         performance: SDHQRating,
 *         visuals: SDHQRating,
 *         stability: SDHQRating,
 *         controls: SDHQRating,
 *         battery: SDHQRating,
 *         score_breakdown: string
 *       },
 *       is_first_look: boolean,
 *       best_on_deck: boolean
 *     },
 *     link: string,
 *     author: number,
 *     author_meta: {
 *       author_link: string,
 *       display_name: string
 *     }
 *   },
 *   avatar: null | {
 *     mpp_avatar: {[key: 24 | 48 | 96 | 150 | 300 | "full"]: string}
 *   }
 * }} SDHQData
 */

/**
 * Requests data from the background script and coordinates message matching.
 * @param {RequestType} type The type of data to request
 * @param {number | string} appId The id of the app to request data for
 * @return {Promise<{
 *   type: RequestType,
 *   appId: number | string,
 *   reqId: number,
 *   data: {
 *     sdhq?: SDHQData | null,
 *     proton_db?: ProtonDBData | null,
 *     deck_verified?: DeckVerifiedData | null
 *   }
 * }>}
 */
function requestBackground(type, appId) {
  let req = new Promise(resolve => requests.push(resolve));
  port.postMessage({type, appId, reqId: reqIndex++});
  return req;
}

export default requestBackground;
