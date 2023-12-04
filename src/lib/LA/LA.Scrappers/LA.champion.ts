import puppeteer from 'puppeteer';
import { items } from '@/data';
import fs from 'fs/promises';
import path from 'path';
import { ChampionRequest } from 'lib/API/API.Interfaces';

const config = {
  'champion': 'jax',
  'lane': 'top'
};

function buildURL(data) {
  return `https://app.mobalytics.gg/lol/champions/${data.champion}/build/${data.lane ? data.lane : ''}`;
}

function getFilePath(filePath) {
  return path.resolve(path.resolve('.', `src/cache-files/${filePath}`));
}

const logType = {
  info: 0,
  warning: 1,
  error: 2
};

function getKeyByValue(logType, value) {
  const key = Object.keys(logType).find((key) => logType[key] === value);
  return key || null;
}

function getCurrentDateTime() {
  const date = new Date();
  const yyyy = date.getFullYear();

  let hh = date.getHours();
  let nn = date.getMinutes();
  let ss = date.getSeconds();
  let zz = date.getMilliseconds();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  hh = hh < 10 ? hh = '0' + hh : hh;
  nn = nn < 10 ? nn = '0' + nn : nn;
  ss = ss < 10 ? ss = '0' + ss : ss;
  zz = zz < 10 ? zz = '0' + zz : zz;
  dd = dd < 10 ? dd = '0' + dd : dd;
  mm = mm < 10 ? mm = '0' + mm : mm;

  return `${dd}/${mm}/${yyyy} ${hh}:${nn}:${ss}:${zz}`;
}

function serverLogger(type, message) {
  console.log(`${getCurrentDateTime()} (${getKeyByValue(logType, type)}) : ${message}`);
}

export default async function run(query): Promise<ChampionRequest> {
  const filePath = query ? `${query.champion}-${query.lane}.json` : `${config.champion}-${config.lane}.json`;

  let fileData;
  let build;

  try {
    const cacheFilePath = getFilePath(filePath);
    serverLogger(logType.info, `Reading file "${cacheFilePath}"`);
    fileData = await fs.readFile(cacheFilePath, 'UTF-8');
  } catch (error) {
    serverLogger(logType.error, `Error reading file "${error}"`);
  }

  if (fileData) {
    serverLogger(logType.info, `Successfull loaded ${filePath} from cache.`);
    build = fileData;
  } else {
    const URL = buildURL(query ? query : config);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    //await page.exposeFunction("serverLogger", serverLogger);

    serverLogger(logType.info, `Fetching data from  "${URL}"`);
    await page.goto(URL);

    build = await page.evaluate((items) => {
      const data = Object();

      let error = 0;

      const runes = document.querySelectorAll('.m-1jwy3wt');
      const mainRune = document.querySelector('.m-1iebrlh');
      const runesTree = document.querySelectorAll('.m-1nx2cdb');
      const skills = document.querySelectorAll('.m-1p6spxi');
      const spells = document.querySelectorAll('.m-d3vnz1');
      const build = document.querySelectorAll('.m-1q4a7cx');
      const buildSituational = document.querySelectorAll('.m-1al3is7');
      const status = document.querySelectorAll('.m-197vfit');

      if (runes) {
        data.runes = [];
        runes.forEach(runeName => data.runes.push({ category: runeName.innerHTML }));
      } else {
        error = 1;
      }

      if (mainRune && data.runes) {
        const id = mainRune
          .attributes
          .getNamedItem('src')
          .value
          .split('/')
          .reverse()[0]
          .split('.')[0];
                    
        const name = mainRune
          .attributes
          .getNamedItem('alt')
          .value;

        data.runes[0].atributes = [];
        data.runes[0].atributes.push({ id, name });
      } else {
        error = 2;
      }

      if (runesTree && data.runes) {
        data.runes[1].atributes = [];
        let counter = 0;

        runesTree.forEach((runes) => {
          const id = runes
            .attributes
            .getNamedItem('src')
            .value
            .split('/')
            .reverse()[0]
            .split('.')[0];
                        
          const name = runes
            .attributes
            .getNamedItem('alt')
            .value;

          if (counter < 3)
            data.runes[0].atributes.push({ id, name });
          else    
            data.runes[1].atributes.push({ id, name });

          counter++;
        });
      } else {
        error = 3;
      }

      if (skills) {
        data.skills = Object();
        data.skills.q = [];
        data.skills.w = [];
        data.skills.e = [];
        data.skills.r = [];

        skills.forEach((item) => {
          const skill = item.innerHTML;
          const level = parseInt(item.parentElement.parentElement.firstChild.innerHTML);
                    
          switch (skill) {
          case 'Q':
            data.skills.q.push(level);
            data.skills.w.push(0);
            data.skills.e.push(0); 
            data.skills.r.push(0);
            break;
          case 'W':
            data.skills.q.push(0);
            data.skills.w.push(level);
            data.skills.e.push(0); 
            data.skills.r.push(0);
            break;
          case 'E':
            data.skills.q.push(0);
            data.skills.w.push(0);
            data.skills.e.push(level); 
            data.skills.r.push(0);
            break;
          case 'R':
            data.skills.q.push(0);
            data.skills.w.push(0);
            data.skills.e.push(0); 
            data.skills.r.push(level);
            break;
          }
        });
      } else {
        error = 4;
      }

      if (spells) {
        data.spells = [];

        spells.forEach((spell) => {
          data.spells.push(spell
            .attributes
            .getNamedItem('src')
            .value
            .split('/')
            .reverse()[0]
            .split('.')[0]
            .replace('Summoner', ''));
        });
      } else {
        error = 5;
      }

      if (build) {
        data.build = Object();
        data.build.starter = [];
        data.build.early = [];
        data.build.core = [];
        data.build.full = [];

        let currentSection = -1;

        build.forEach((section) => {
          currentSection++;

          section.childNodes.forEach((item) => {
            const id = item.firstChild.firstChild.attributes
              .getNamedItem('src')
              .value
              .split('/')
              .reverse()[0]
              .split('.')[0];
                            
            const name = item.firstChild.firstChild.attributes.getNamedItem('alt').value;

            switch (currentSection) {
            case 0 : 
              data.build.starter.push({ id, name });
              break;
            case 1 : 
              data.build.early.push({ id, name });
              break;
            case 2 : 
              data.build.core.push({ id, name });
              break;
            case 3 : 
              data.build.full.push({ id, name });
              break;
            }
          });
        });
      } else {
        error = 6;
      }

      if (buildSituational && data.build) {
        data.build.situational = [];
            
        buildSituational.forEach((item) => {
          const id = item
            .attributes
            .getNamedItem('src')
            .value
            .split('/')
            .reverse()[0]
            .split('.')[0];
                        
          const name = item
            .attributes
            .getNamedItem('alt')
            .value;

          data.build.situational.push({ id, name });
        });
      } else {
        error = 7;
      }

      if (status) {
        const statusData = [];

        status.forEach((stat) => {
          statusData.push(stat.innerHTML.split('<')[0]);
        });

        data.status = {
          tier: statusData[0],
          winrate: parseFloat(statusData[1].split('%')[0]),
          pickrate: parseFloat(statusData[2].split('%')[0]),
          banrate: parseFloat(statusData[3].split('%')[0]),
          matches: parseInt(statusData[4].replaceAll(' ',''))
        };
      } else {
        error = 8;
      }

      if (error > 0) {
        switch (error) {
        case 0 : 
          data.error = '';
          break;
        case 1 : 
          data.error = 'Error fetching "runes"';
          break;
        case 2 : 
          data.error = 'Error fetching "mainRune"';
          break;
        case 3 : 
          data.error = 'Error fetching "runesTree"';
          break;
        case 4 : 
          data.error = 'Error fetching "skills"';
          break;
        case 5 : 
          data.error = 'Error fetching "spells"';
          break;
        case 6 : 
          data.error = 'Error fetching "build"';
          break;
        case 7 : 
          data.error = 'Error fetching "buildSituational"';
          break;
        case 8 : 
          data.error = 'Error fetching "status"';
          break;
        }
      }

      return data;
    }, items);

    await browser.close();

    const jsonString = JSON.stringify(build);

    const returnData: ChampionRequest = {
      data: {
        build: build.build,
        skills: build.skills,
        spells: build.spells
      },
      error: null      
    };

    fs.writeFile(getFilePath(filePath), jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('JSON file has been saved!');
      }
    });

    return returnData;
  }
}
