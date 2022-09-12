class Queue {
  constructor(message, channel) {
    this.guildId = message.guild.id;
    this.message = message;
    this.stopped = false;
    this.vc = channel;
    this.connection = null;
    this.player = null;
    this.resource = null;
    this.volume = 100;
    this.filter = null;
    this.paused = false;
    this.loopone = false;
    this.loopall = false;
    this.songs = [];
    this.stream = null;
    this.addTime = 0;
  }
}

module.exports = Queue;
