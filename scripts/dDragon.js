const fs = require('fs');

async function getLatestDDragonData() {
   const versions = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
   const version = await versions.json();
   const latest = version[0];

   console.log(`Fetching https://ddragon.leagueoflegends.com/cdn/${latest}/data/pt_BR/champion.json`)
   const ddragon = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/pt_BR/champion.json`);
   const champions = await ddragon.json()
   const championJson = champions.data;
   
   let championsData = []

   for (const [_, value] of Object.entries(championJson)) {
      championsData.push(value)
   }
   
   fs.writeFileSync('./data/champions.json', JSON.stringify(championsData, null, 2));
}

getLatestDDragonData()