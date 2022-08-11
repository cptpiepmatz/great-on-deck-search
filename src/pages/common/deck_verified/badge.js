/**
 * Constant of all steam deck verification statuses.
 * @type {[
 *   {name: string, iconUrl: string},
 *   {name: string, iconUrl: string},
 *   {name: string, iconUrl: string},
 *   {name: string, iconUrl: string}
 * ]}
 */
const badges = [
  {
    name: "unknown",
    iconUrl: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/1a3a76c9e8dacf756b822247a23bef435768a5ff.png"
  },
  {
    name: "unsupported",
    iconUrl: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/dd56b9d37f5b5bf4da236b9bd3d62e3d120d7df5.png"
  },
  {
    name: "playable",
    iconUrl: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/16e802051c2a3b99c7f1720b7de7fad6e540e02a.png"
  },
  {
    name: "verified",
    iconUrl: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans//39049601/82a3cff3038fbb4c36fabb5dd79540b23fa9a4d4.png"
  }
];

export default badges;
