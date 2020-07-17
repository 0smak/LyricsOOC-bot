const puppeteer = require('puppeteer');
import { template } from "../templates/imageTemplate";
import { GeniusService } from '../services/genius.service';

export class LyricsUtil {
  constructor(private geniusService: GeniusService) { }

  async getValidLyric(id: number): Promise<string> {
    let lyrics = '';
    let lyric = '';
    let attempts = 0;
    while (lyrics.length === 0 && attempts < 10) {
      lyrics = await this.geniusService.getLyrics(id);
      lyric = this.getLine(lyrics);
      attempts++;
    }
    console.log(lyric);
    if (attempts >= 10 && lyrics.length === 0) {
      console.log('Error on getting lyrics attempts are more than 10');
    }
    return lyric;
  }

  getLine(lyrics: string): string {
    const lyricsArray: Array<string> = lyrics.split(/\r\n|\r|\n/);
    const validLyrics = [];
    for (const lyric of lyricsArray) {
      if (this.isValidLine(lyric.trim())) validLyrics.push(lyric);
    }
    const r: number = Math.floor(Math.random() * validLyrics.length);
    return validLyrics[r];
  }

  isValidLine(lyric: string): boolean {
    lyric = lyric.trim();
    return !(
      (lyric.charAt(0) === '[' && lyric.charAt(lyric.length - 1) === ']') ||
      lyric === ''
    );
  }

  async generateImage(img: string, name: string, artists: string, lyric: string): Promise<string> {
    const filename = `./img/${name.replace(' ', '-')}-${(new Date()).toISOString()}.png`;
    await (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const html = template.html(img, name, artists, lyric);
      const css = template.css(img);
      await page.setContent(html);
      await page.addStyleTag(css);
      await page.screenshot({ path: filename, fullPage: true });
      await browser.close();

    })();
    return filename;
  }

  async getSongData(q: string): Promise<any> {
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
    }
    const id = hit.result.id;
    const name = hit.result.title;
    const artists = hit.result.primary_artist.name;
    const img = hit.result.header_image_url;
    return { id, name, artists, img };
  }

  async getSongFromArtist(idArtist: number) {
    const { data } = await this.geniusService.getArtistSongs(idArtist);
    const songs = data.response.songs;
    const song = songs[Math.floor(Math.random() * songs.length)];
    return { id: song.id, name: song.title, artists: song.primary_artist.name, img: song.header_image_url};
  }

  async createImage(q?: string, idArtist: number = -1) {
    if(q || idArtist){
      const { id, name, artists, img } = q ? 
      await this.getSongData(q).then(obj => obj)
      : await this.getSongFromArtist(idArtist);
      ;
      const lyric = await (this.getValidLyric(id))
      let filename = await this.generateImage(img, name, artists, lyric)
      .then(f => f);
      console.log(filename)
    }
  }
}
