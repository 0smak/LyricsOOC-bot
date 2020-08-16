const puppeteer = require('puppeteer');
const template = require("../templates/imageTemplate");
const geniusService = require('../services/genius.service');

const getValidLyric = async id => {
  let lyrics = '';
  let lyric = '';
  let attempts = 0;
  while (lyrics.length === 0 && attempts < 10) {
    lyrics = await geniusService.getLyrics(id);
    

    lyric = getLine(lyrics);
    attempts++;
  }
  console.log(lyric);
  if (attempts >= 10 && lyrics.length === 0) {
    console.log('Error on getting lyrics attempts are more than 10');
  }
  return lyric;
}

const getLine = lyrics => {
  const lyricsArray = lyrics.split(/\r\n|\r|\n/);
  const validLyrics = [];
  for (const lyric of lyricsArray) {
    if (isValidLine(lyric.trim())) validLyrics.push(lyric);
  }
  const r = Math.floor(Math.random() * validLyrics.length);
  return validLyrics[r];
}

const isValidLine = lyric => {
  lyric = lyric.trim();
  return !(
    (lyric.charAt(0) === '[' && lyric.charAt(lyric.length - 1) === ']') ||
    lyric === ''
  );
}

const generateImage = async(img, name, artists, lyric) => {
  const filename = `./img/${name} ${artists} ${new Date().getTime()}.png`.replace(/\s+/g, '-');
  let buffer = await(async () => {
    const browser = await puppeteer.launch({
      'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
    const page = await browser.newPage();
    const html = template.html(img, name, artists, lyric);
    const css = template.css(img);
    await page.setContent(html);
    await page.addStyleTag(css);
    const image = await page.screenshot({ path: filename, fullPage: true });
    await browser.close();
    return image;
  })();
  return filename;
}

const getSongData = async (q) => {
  const { data } = await geniusService.search(q);
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
  if(found) {
    const id = hit.result.id;
    const name = hit.result.title;
    let artists = hit.result.primary_artist.name;
    const feat = hit.result.full_title.match(/\(\bFt\b\..*?\)/gi);
    artists = feat ? artists + ' ' + feat[0] : artists;
    const img = hit.result.header_image_url;
    return { id, name, artists, img };
  } else return {id: 'null',name: 'null',artists: 'null',img: 'null'}
}

const getSongFromArtist = async (idArtist) => {
  const { data } = await geniusService.getArtistSongs(idArtist);
  const songs = data.response.songs;
  const song = songs[Math.floor(Math.random() * songs.length)];
  return { id: song.id, name: song.title, artists: song.primary_artist.name, img: song.header_image_url };
}

const createImage = async (q = undefined, idArtist = -1) => {
  if (q || idArtist > -1) {
    const { id, name, artists, img } = q ?
      await getSongData(q).then(obj => obj)
      : await getSongFromArtist(idArtist);
    if(id == "null") return null;
    const lyric = await(getValidLyric(id))
    if(idArtist != -1 && lyrics.includes('Lyrics for this song have yet')) {
      return createImage(q, idArtist);
    }  else if (idArtist==-1) return null;
    let filename = await generateImage(img, name, artists, lyric)
      .then(f => f);
    return { filename, name, artists };
  }
  return null;
}

module.exports = {
  createImage,
}