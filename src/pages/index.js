import injectHead from "./inject_head.js";
import handleSearchResultsPage from "./search/index.js";
import handleFrontPage from "./front/index.js";
import handleAppPage from "./app/index.js";
import handleWishlistPage from "./wishlist/index.js";

injectHead();

handleFrontPage();
handleAppPage();
handleSearchResultsPage();
handleWishlistPage();
