let championJson = {};

async function getLatestDDragon() {
   if(Object.keys(championJson).length > 0) {return champinoJson;}
   const versions = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
   const latest = await versions.json()[0];

   const ddragon = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`);

   const champions = await ddragon.json()["data"];
   championJson = champions;
   return champions;
}

async function getChampionByKey(key) {

   const champions = await getLatestDDragon();

   for (var championName in champions) {
      if (!champions.hasOwnProperty(championName)) {continue;}

      if(champions[championName]["key"] === key) {
         return champions[championName]
      }
   }

   return false;

}

console.log(await getChampionByKey(45)); // outputs Array<Veigar>