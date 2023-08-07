import injectHead from "./inject_head.js";
import handleOmni from "./omni/index.js";
import handleSearchResultsPage from "./search/index.js";
import handleFrontPage from "./front/index.js";
import handleAppPage from "./app/index.js";
import handleWishlistPage from "./wishlist/index.js";
import handleGamesPage from "./games/index.js";

injectHead();

handleOmni();
handleFrontPage();
handleAppPage();
handleSearchResultsPage();
handleWishlistPage();
handleGamesPage();
