const axios = require('axios').default;
const Lyricist = require('lyricist');
const config = require('../config');

const API_URL = 'https://api.genius.com/';
const routes = {
  search: 'search?',
  artists: 'artists/',
  artistsRoutes: {
    songs: 'songs',
  },
  songs: 'songs',
};

const search = q => {
  const headers = {
    headers: { Authorization: `Bearer ${config.genius_API.token}` },
  };
  return axios.get(`${API_URL}${routes.search}q=${q}`, headers);
}

const getArtistSongs = (id, par_page) => {
  const headers = {
    headers: { Authorization: `Bearer ${config.genius_API.token}` },
  };
  return axios.get(`${API_URL}${routes.artists}${id}/${routes.artistsRoutes.songs}?par_page=${par_page}`, headers);
}

const getLyrics = async (id) => {
  const lyricist = new Lyricist(config.genius_API.token);
  const song = await lyricist.song(id, { fetchLyrics: true });
  return song.lyrics;
};

module.exports = {
  getLyrics,
  getArtistSongs,
  search,
}