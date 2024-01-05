export interface ChampionRequestData{ 
  skills: Skills;
  build: Blocks;
  spells: string[]; 
}

export interface Champion {
  rank: string;
  name: string;
  winrate: string;
  games: string;
}

export interface Skills {
  q: number[];
  w: number[];
  e: number[];
  r: number[];
}

export interface Blocks {
  starter: Item[],
  early: Item[],
  core: Item[],
  full: Item[], 
  situational: Item[]
}

export interface Item {
  id: string;
  name: string;
}