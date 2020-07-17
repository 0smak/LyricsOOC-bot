import { LyricsUtil } from './utils/lyrics.util';
import { GeniusService } from './services/genius.service';
import { artists } from './artists';
class Server {
  lyricsUtil = new LyricsUtil(new GeniusService());
  constructor() {
  }

  start(q?: string) {
    if(q)
      this.lyricsUtil.createImage(q);
    else {
      const id = artists.getRandomArtist();
      this.lyricsUtil.createImage(undefined, 1034789);
    }
  
    
  }
}
const server = new Server();
server.start();

