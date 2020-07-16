import { GeniusService } from './services/genius.service';
import { LyricsUtil } from './utils/lyrics.util';
const puppeteer = require('puppeteer-core');

class Server {
  lyricsUtil = new LyricsUtil();
  constructor(private geniusService: GeniusService) {
    this.config('Travis Scott SDP Interlude');
  }

  async config(q: string) {
    const { data } = await this.geniusService.search(q);
    const hits = data.response.hits;
    let hit;
    let found = false;
    for (let i = 0; i < hits.length && !found; i++) {
      found =
        ['favorites', 'favoritos', 'ranking'].find((w) =>
          hits[i].result.full_title.includes(w)
        ) === undefined;

      if (found) hit = hits[i];
      /* (async () => {
        const browser = await puppeteer.launch({
          executablePath: '/usr/bin/chromium-browser',
          headless: false,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        console.log('hey');
        const page = await browser.newPage();
        await page.goto('https://www.google.com');
        await page.screenshot({ path: 'example.png' });

        await browser.close();
      })();*/
    }
    const id = hit.result.id;
    console.log(hit.result.full_title);
    let lyrics = '';
    let lyric = '';
    let attempts = 0;
    while (lyrics.length === 0 && attempts < 10) {
      lyrics = await this.geniusService.getLyrics(id);
      lyric = this.lyricsUtil.getLine(lyrics);
      attempts++;
    }
    console.log(lyric);
    if (attempts >= 10 && lyrics.length === 0) {
      console.log('Error on getting lyrics attempts are more than 10');
    }
  }

  start() {}
}
const server = new Server(new GeniusService());
server.start();
