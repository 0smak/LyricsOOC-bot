export class LyricsUtil {
  constructor() {}

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
}
