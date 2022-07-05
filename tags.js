const deckBadges = [
  "Unknown",
  "Unsupported",
  "Playable",
  "Verified"
];

const deckBadgeIcons = [
  // unknown
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/1a3a76c9e8dacf756b822247a23bef435768a5ff.png",

  // unsupported
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/dd56b9d37f5b5bf4da236b9bd3d62e3d120d7df5.png",

  // playable
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/16e802051c2a3b99c7f1720b7de7fad6e540e02a.png",

  // verified
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/82a3cff3038fbb4c36fabb5dd79540b23fa9a4d4.png"
];

const port = chrome.runtime.connect({name: "protondb_req"});

let observer = new MutationObserver(() => {
  console.log("updated!");
  tagItems();
});
let resultsElement = document.getElementById("search_results");
if (resultsElement) {
  observer.observe(resultsElement, {
    childList: true,
    subtree: true
  });

  tagItems();
}

// tag every entry with the medal and verification status
function tagItems() {
  let rows = document.querySelectorAll("a.search_result_row:not(.tagged-medal-and-verification)");
  for (let row of rows) {
    row.classList.add("tagged-medal-and-verification");
  }
  if (!rows) return;
  let rowMap = new Map();

  port.onMessage.addListener(([name, appId, db, verified]) => {
    let row = rowMap.get(appId);
    if (!row) return;

    let verifiedTag = document.createElement("span");
    let verifiedStatus = deckBadges[verified.results.resolved_category];
    let verifiedImg = document.createElement("img");
    verifiedImg.src = deckBadgeIcons[verified.results.resolved_category];
    verifiedTag.appendChild(verifiedImg);
    verifiedTag.classList.add("deck-" + verifiedStatus.toLowerCase());
    verifiedTag.classList.add("col");
    row.querySelector(".col.search_name.ellipsis").children[1].append(verifiedTag);

    if (db.tier === "pending") return;
    let dbTag = document.createElement("span");
    dbTag.innerText = db.tier.toUpperCase();
    dbTag.classList.add("proton-db-tier-" + db.tier);
    dbTag.classList.add("col");
    row.querySelector(".col.search_name.ellipsis").children[1].append(dbTag);
  });

  for (let row of rows) {
    let appId = row.dataset.dsAppid;
    let name = row.querySelector("span.title").innerHTML;
    console.log(name);
    rowMap.set(appId, row);
    port.postMessage({name, appId});
  }
}
