const ytdl = require("discord-ytdl-core");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayer,
  AudioResource,
} = require("@discordjs/voice");
exports.play = async function (message) {
  const stream = ytdl("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
    filter: "audioonly",
    quality: "highestaudio",
    highWaterMark: 1 << 25,
    opusEncoded: true,
  });
  const channel = message.member.voice.channel;
  const connection = await joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  const player = createAudioPlayer();
  const resource = createAudioResource(stream, { inlineVolume: true });
  player.play(resource);
  connection.subscribe(player);
};
