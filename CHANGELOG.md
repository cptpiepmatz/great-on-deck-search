# v1.2.1 [firefox][firefox-v1.2.1] [chrome][chrome-v1.2.1] (2022-08-13)
[firefox-v1.2.1]: https://github.com/cptpiepmatz/great-on-deck-search/releases/tag/v1.2.1%2Bfirefox
[chrome-v1.2.1]: https://github.com/cptpiepmatz/great-on-deck-search/releases/tag/v1.2.1%2Bchrome

### 🐛 Bug Fixes

- Front page was missing clickable medals and game reviews

# v1.2.0 [firefox][firefox-v1.2.0] [chrome][chrome-v1.2.0] (2022-08-12)
[firefox-v1.2.0]: https://github.com/cptpiepmatz/great-on-deck-search/releases/tag/v1.2.0%2Bfirefox
[chrome-v1.2.0]: https://github.com/cptpiepmatz/great-on-deck-search/releases/tag/v1.2.0%2Bchrome

### ✨ Features

- Added support for [Steam Deck HQ](https://steamdeckhq.com/game-reviews/) game reviews
  ([#10](https://github.com/cptpiepmatz/great-on-deck-search/pull/10))
- Added settings menu, click on extension icon to setting which features you want
  ([#11](https://github.com/cptpiepmatz/great-on-deck-search/pull/11))
- Added support for wishlist and profile games list pages
  ([#12](https://github.com/cptpiepmatz/great-on-deck-search/pull/11))
- Added nav button on app page
  ([#6](https://github.com/cptpiepmatz/great-on-deck-search/pull/6))
- Made ProtonDB medals and SDHQ reviews clickable

### 🛠️ Improvements

- Improved support with [SteamDB extension](https://steamdb.info/extension/)
  ([#6](https://github.com/cptpiepmatz/great-on-deck-search/pull/6))

### ♻️ Refactor

- Refactored entire codebase, included build steps for pages and background, 
  made use of [Sass](https://sass-lang.com) and [Rollup](https://www.rollupjs.org)
  ([#11](https://github.com/cptpiepmatz/great-on-deck-search/pull/11))

### 🏗 Chore

- Added GitHub Actions for automatic release builds

### 📦 Build

- Added [rollup.config.js](https://github.com/cptpiepmatz/great-on-deck-search/blob/main/rollup.config.js)
- Added build script [build.sh](https://github.com/cptpiepmatz/great-on-deck-search/blob/main/build.sh)
