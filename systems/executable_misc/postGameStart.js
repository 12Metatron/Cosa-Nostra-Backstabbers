// I know I probably should have these
// stored as methods to the class;
// but I want to keep them separate
// because partial classes in JS suck

var auxils = require("../auxils.js");
var format = require("./__formatter.js");
var texts = require("./text/texts.js");

var pinMessage = require("./pinMessage.js");

var Discord = require("discord.js");

module.exports = async function (game) {

  var config = game.config;

  var guild = game.client.guilds.get(config["server-id"]);

  var log = guild.channels.find(x => x.name === config["channels"]["log"]);
  var main = guild.channels.find(x => x.name === config["channels"]["main"]);
  var post = guild.channels.find(x => x.name === config["channels"]["whisper-log"]);

  // Send the start message
  var attachment = auxils.getAssetAttachment(config["assets"]["game-start"]);

  var intro = await main.send(format(game, config["messages"]["game-start"]));
  await main.send(undefined, attachment);

  var whisper_intro = await post.send(format(game, config["messages"]["whisper-log"]));

  await log.send(format(game, texts.opening));

  if (game.period % 2 === 0) {
    var pinnable = await main.send(format(game, config["messages"]["daytime-quote"]));
  } else {
    var pinnable = await main.send(format(game, config["messages"]["nighttime-quote"]));
  };

  await pinMessage(intro);
  await pinMessage(whisper_intro);
  game.createPeriodPin(pinnable);

  if (game.channels.mafia !== undefined) {

    var mafia_channel = game.getChannel("mafia");

    var mafia = game.exists(x => x.role["see-mafia-chat"] === true && x.isAlive());

    if (mafia) {
      await mafia_channel.send(config["messages"]["mafia"]);
    };

  };

};
