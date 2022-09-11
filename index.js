const dscytdl = require("discord-ytdl-core");
const ytdl = require("ytdl-core");
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
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
  play: async function (message, query) {
    if (searcher.validate(query, "VIDEO")) {
      const songInfo = ytdl.getBasicInfo(query);
      if (!songInfo) throw new Error("No data of the video found");
    }

    {
      const result = await searcher.search(query, { limit: 1, type: "video" });
      if (!result || result.length < 1) throw new Error("No videos found!");
    }
  },
  search: function (message, query) {},
};

/* END MUSIC FUNCTIONS */
