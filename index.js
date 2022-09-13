const dscytdl = require("discord-ytdl-core");
const Track = require("./src/Track");
const Queue = require("./src/Queue");
const ytdl = require("ytdl-core");
const fetch = require("isomorphic-unfetch");
const spotify = require("spotify-url-info")(fetch);
const searcher = require("youtube-sr").default;
const Discord = require("discord.js");
const SC = require("soundcloud-scraper");
const soundcloud = new SC.Client();
const { EventEmitter } = require("events");
const emitter = new EventEmitter();
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
  AudioPlayerStatus,
} = require("@discordjs/voice");
const queues = new Discord.Collection();
/* START MUSIC FUNCTIONS */

module.exports = {
  /**
   *
   * @param {Discord.Message} message
   * @param {string} query
   */
  events: emitter,
  play: async function (message, query) {
    let trackToPlay;
    if (query.match(spotifySongRegex)) {
      const track = await this._searchTrack(query);
      const songInfo = await ytdl.getBasicInfo(track.url);
      if (!songInfo) throw new Error("No data found of the video");
      trackToPlay = new Track(songInfo, message);
    }
    if (query.match(spotifyPlaylistRegex)) {
      return this._spotifyPlaylist(query);
    }
    if (searcher.validate(query, "VIDEO")) {
      const songInfo = await ytdl.getBasicInfo(query);
      if (!songInfo) throw new Error("No data found of the video");
      trackToPlay = new Track(songInfo, message);
    }
    if (trackToPlay) {
      const queue = queues.get(message.guild.id);
      if (!queue) {
        return this._createQueue(message, trackToPlay);
      } else {
        const queue = await this._addTrackToQueue(message, trackToPlay);
        emitter.emit(
          "trackAdded",
          message,
          queue.songs[0],
          queue.songs[queue.songs.length - 1]
        );
      }
    }
    {
      const result = await this._searchTrack(query);
    }
  },
  /**
   *
   * @param {Discord.Message} message
   * @param {Track} track
   */
  _createQueue: async function (message, track) {
    const channel = message.member.voice.channel;
    if (!channel) throw new Error("Not connected to voice channel!");
    const queue = new Queue(message, channel);
    queues.set(message.guild.id, queue);
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    queue.connection = connection;
    queue.songs.push(track);
    this._playTrack(queue);
  },
  _searchTrack: async function (query) {
    let result;
    if (query.match(spotifySongRegex)) {
      const data = await spotify.getPreview(query);
      let r = await searcher.search(`${data.title} ${data.artist}`, {
        type: "video",
        limit: 1,
      });
      if (result.length < 1 || !result)
        throw new Error("I have not found any video!");
      result = r[0];
    } else {
      let r = await searcher.search(query, {
        type: "video",
        limit: 1,
      });
      if (result.length < 1 || !result)
        throw new Error("I have not found any video!");
      result = r[0];
    }
    return result;
  },
  /**
   *
   * @param {Discord.Message} message
   * @param {Track} track
   * @returns {Queue}
   */
  _addTrackToQueue: async function (message, track) {
    const queue = await this.getQueue(message);
    if (!queue) throw new Error("Not playing anything!");
    if (!track) throw new Error("No track to add to queue!");
    queue.songs.push(track);
    return queue;
  },
  /**
   *
   * @param {Discord.Message} message
   * @returns
   */
  skip: async function (message) {
    const queue = await this.getQueue(message);
    if (!queue) throw new Error("No queue!");
    emitter.emit("skipTrack", message);
    queue.player.stop();
    return queue;
  },
  /**
   *
   * @param {Discord.Message} message
   * @returns
   */
  getQueue: async function (message) {
    const queue = queues.get(message.guild.id);
    return queue;
  },
  _spotifyPlaylist: async function (query) {},
  /**
   *
   * @param {Queue} queue
   */
  _playTrack: async function (queue) {
    if (queue.stopped) {
      return;
    }
    this._playYTDLStream(queue);
  },
  /**
   *
   * @param {Queue} queue
   * @param {null} filter
   * @param {null} seek
   */
  _playYTDLStream: async function (queue, filter, seek) {
    let newStream;
    newStream = dscytdl(queue.songs[0].url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
      opusEncoded: true,
    });
    let resource = createAudioResource(newStream, { inlineVolume: true });
    let player = createAudioPlayer();
    player.play(resource);
    queue.connection.subscribe(player);
    resource.volume.setVolumeLogarithmic(queue.volume / 100);
    queue.resource = resource;
    queue.player = player;
    player.on(AudioPlayerStatus.Idle, () => {
      queue.addTime = 0;
      const oldTrack = queue.songs.shift();
      this._playTrack(queue);
    });
    emitter.emit("trackStart", queue.songs[0], queue.message);
  },
};

/* END MUSIC FUNCTIONS */
