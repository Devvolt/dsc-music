const { Message } = require("discord.js");
const forHumans = require("./forhumans");

class Track {
  /**
   *
   * @param {null} data
   * @param {Message} message
   */
  constructor(ytdata, message) {
    const n = ytdata.videoDetails.thumbnails.length;
    this.title = ytdata.videoDetails.title;
    this.name = ytdata.videoDetails.title;
    this.thumbnail = ytdata.videoDetails.thumbnails[n - 1].url;
    this.requested = message.author;
    this.id = ytdata.videoDetails.videoId;
    this.duration = forHumans(ytdata.videoDetails.lengthSeconds);
    this.durationMS = ytdata.videoDetails.lengthSeconds * 1000;
    this.url = ytdata.videoDetails.video_url;
    this.views = ytdata.videoDetails.viewCount;
    this.author = ytdata.videoDetails.author.name;
  }
}

module.exports = Track;
