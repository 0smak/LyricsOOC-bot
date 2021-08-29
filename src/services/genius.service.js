const axios = require("axios").default;
const config = require("../config");
const genius = require("genius-lyrics");
const geniusClient = new genius.Client(config.genius_API.token);

const API_URL = "https://api.genius.com/";
const routes = {
  search: "search?",
  artists: "artists/",
  artistsRoutes: {
    songs: "songs",
  },
  songs: "songs",
};

const search = (q) => {
  const headers = {
    headers: { Authorization: `Bearer ${config.genius_API.token}` },
  };
  return axios.get(`${API_URL}${routes.search}q=${q}`, headers);
};

const getArtistSongs = (id, par_page) => {
  const headers = {
    headers: { Authorization: `Bearer ${config.genius_API.token}` },
  };
  return axios.get(
    `${API_URL}${routes.artists}${id}/${routes.artistsRoutes.songs}?par_page=${par_page}`,
    headers
  );
};

const getLyrics = async (query) => {
  const searches = await geniusClient.songs.search(`${query}`);
  console.log({ searches });
  const firstSong = searches[0];
  const lyrics = await firstSong.lyrics();
  return lyrics ?? "";
};

module.exports = {
  getLyrics,
  getArtistSongs,
  search,
};
