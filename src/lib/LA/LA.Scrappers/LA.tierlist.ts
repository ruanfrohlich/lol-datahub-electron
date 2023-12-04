import puppeteer from 'puppeteer';
import { RequestData } from '../LA.DataTypes/LA.Types';

function buildURL(query: RequestData) {
  return `https://app.mobalytics.gg/lol/tier-list/${query.elo}-elo?igRole=${query.lane.toUpperCase}`;
}

export default async function run(query: RequestData) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1024 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto(buildURL(query));

  const champions = await page.evaluate(() => {
    const items = document.querySelectorAll('.m-5kov97');

    const elements = {
      top: {
        tierS: Array.from(items[0].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierA: Array.from(items[1].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierB: Array.from(items[2].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];})
      }, 
      jungle: {
        tierS: Array.from(items[3].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierA: Array.from(items[4].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierB: Array.from(items[5].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];})
      }, 
      mid: {
        tierS: Array.from(items[6].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierA: Array.from(items[7].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierB: Array.from(items[8].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];})
      }, 
      bot: {
        tierS: Array.from(items[9].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierA: Array.from(items[10].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierB: Array.from(items[11].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];})
      }, 
      support: {
        tierS: Array.from(items[12].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierA: Array.from(items[13].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];}),
        tierB: Array.from(items[14].childNodes).map((item) => {return item.attributes.getNamedItem('href').value.split('/')[3];})
      }
    };

    return elements;
  });

  await browser.close();

  return champions;
}
