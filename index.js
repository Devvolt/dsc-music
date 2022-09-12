const dscytdl = require("discord-ytdl-core");
const ytdl = require("ytdl-core");
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
const discord = require("discord.js");
const SC = require("soundcloud-scraper");
const soundcloud = new SC.Client();
const spotifyPlaylistRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:playlist:)((\w|-){22})/;
const spotifySongRegex =
  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayer,
  AudioResource,
} = require("@discordjs/voice");

/* START MUSIC FUNCTIONS */

module.exports = {
  /**
   *
   * @param {discord.Message} message
   * @param {string} query
   */
  play: async function (message, query) {
    let trackToPlay;
    if (query.match(spotifySongRegex)) {
      trackToPlay = await this._searchTracks(query);
    }
    if (query.match(spotifyPlaylistRegex)) {
      return this._spotifyPlaylist(query);
    }
    if (searcher.validate(query, "VIDEO")) {
      const songInfo = ytdl.getBasicInfo(query);
      if (!songInfo) throw new Error("No data of the video found");
    }
    {
      const result = await this._searchTrack();
    }
  },
  _createQueue: async function (message) {},
  _searchTrack: async function (query) {
    let result;
    if (query.match(spotifySongRegex)) {
      const data = await spotify.getPreview(query);
      result = await searcher.search(`${data.title} ${data.artist}`, {
        type: "video",
        limit: 1,
      });
      if (result.length < 1 || !result)
        throw new Error("I have not found any video!");
    } else {
      result = await searcher.search(query, {
        type: "video",
        limit: 1,
      });
      if (result.length < 1 || !result)
        throw new Error("I have not found any video!");
    }
  },
  _spotifyPlaylist: async function (query) {},
};

/* END MUSIC FUNCTIONS */
