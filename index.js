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
   * @param {String[]} query
   */
  play: async function (message, query) {
    let trackToPlay;
    if (query.match(spotifySongRegex)) {
    }
    if (query.match(spotifyPlaylistRegex)) {
      return this._spotifyPlaylist(query);
    }
    if (searcher.validate(query, "VIDEO")) {
      const songInfo = ytdl.getBasicInfo(query);
      if (!songInfo) throw new Error("No data of the video found");
    }
    {
      const result = await searcher.search(query, { limit: 1, type: "video" });
      if (!result || result.length < 1) throw new Error("No videos found!");
    }
  },
  _searchTracks: function (query) {},
  _spotifyPlaylist: function (query) {},
};

/* END MUSIC FUNCTIONS */
