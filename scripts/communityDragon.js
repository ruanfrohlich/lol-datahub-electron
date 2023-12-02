const fs = require('fs');

async function getItems() {
   const data = await fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/items.json");
   const itemsData = await data.json();
   
   fs.writeFileSync('./data/items.json', JSON.stringify(itemsData, null, 2));
}

async function getRunes() {
   const data = await fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json");
   const runesData = await data.json();
   
   fs.writeFileSync('./data/runes.json', JSON.stringify(runesData, null, 2));
}

async function getRuneStyles() {
   const data = await fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json");
   const runeStylesData = await data.json();
   
   fs.writeFileSync('./data/runeStyles.json', JSON.stringify(runeStylesData.styles, null, 2));
}

async function main() {
   await getItems()
   await getRunes()
   await getRuneStyles()
}

main()