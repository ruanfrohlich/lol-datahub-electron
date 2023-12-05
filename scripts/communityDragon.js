const fs = require('fs');
const champions = require('../data/champions.json');

async function getItems() {
  const data = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/items.json'
  );
  const itemsData = await data.json();

  fs.writeFileSync('./data/items.json', JSON.stringify(itemsData, null, 2));
}

async function getRunes() {
  const data = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/perks.json'
  );
  const runesData = await data.json();

  fs.writeFileSync('./data/runes.json', JSON.stringify(runesData, null, 2));
}

async function getRuneStyles() {
  const data = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/perkstyles.json'
  );
  const runeStylesData = await data.json();

  fs.writeFileSync(
    './data/runeStyles.json',
    JSON.stringify(runeStylesData.styles, null, 2)
  );
}

async function getSkillsImages() {
  const championFilter = champions.filter((object) => object.key != 910);

  const skillsImgs = await Promise.all(
    championFilter.map(async (champ, index) => {
      const data = await fetch(
        `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${champ.key}.json`
      );

      const skillsData = await data.json();

      return {
        championId: skillsData.id,
        spells: skillsData.spells,
      };
    })
  );

  fs.writeFileSync(
    './data/skillsImages.json',
    JSON.stringify(skillsImgs, null, 2)
  );
}

async function main() {
  await getItems();
  await getRunes();
  await getRuneStyles();
  await getSkillsImages();
}

main();
