const axios = require('axios').default;
const Lyricist = require('lyricist');
import { config } from '../config';

export class GeniusService {
  private readonly API_URL = 'https://api.genius.com/';
  private readonly routes = {
    search: 'search?',
    artists: 'artists/',
    artistsRoutes: {
      songs: 'songs',
    },
    songs: 'songs',
  };
  constructor() {}

  search(q: String): Promise<any> {
    const headers = {
      headers: { Authorization: `Bearer ${config.genius_API.token}` },
    };
    return axios.get(`${this.API_URL}${this.routes.search}q=${q}`, headers);
  }

  getArtistSongs(id: number, par_page = 50): Promise<any> {
    const headers = {
      headers: { Authorization: `Bearer ${config.genius_API.token}` },
    };
    return axios.get(`${this.API_URL}${this.routes.artists}${id}/${this.routes.artistsRoutes.songs}?par_page=${par_page}`, headers);
  } 

  async getLyrics(id: number): Promise<string> {
    const lyricist = new Lyricist(config.genius_API.token);
    const song = await lyricist.song(id, { fetchLyrics: true });
    return song.lyrics;
  };
}
