var Discord = require("discord.js");
var client = new Discord.Client();
var fs = require("fs");

var lcn = require("./source/lcn.js");

var auxils = lcn.auxils;
var commands = lcn.commands;
var game = lcn.game;

var config = lcn.config;

client.options.disableEveryone = true;

var load_time = process.uptime() * 1000;

client.on("ready", function () {
  console.log("Foxgloves Discord Mafia ready.");

  var login_time = process.uptime() * 1000;

  auxils.readline(client, config, commands);
  auxils.eventhandler(client, config);

  client.user.setPresence({
    status: "online",
    game: {name: "Foxgloves Discord Mafia", type: "PLAYING"}
  });

  var save_status = "NONE ATTEMPTED";

  var total_load_time = process.uptime() * 1000;
  var stats = [lcn.expansions.length, lcn.expansions.map(x => x.expansion.name).join(", "), Object.keys(lcn.roles).length, Object.keys(lcn.attributes).length, Object.keys(lcn.flavours).length, Object.keys(lcn.win_conditions).length, Object.keys(lcn.commands.role).length, load_time, login_time - load_time, total_load_time - login_time, save_status, total_load_time];
  console.log("\n--- Statistics ---\n[Modules]\nLoaded %s expansion(s) [%s];\nLoaded %s role(s);\nLoaded %s attribute(s);\nLoaded %s flavour(s);\nLoaded %s unique win condition(s);\nLoaded %s command handle(s)\n\n[Startup]\nLoad: %sms;\nLogin: %sms;\nSave: %sms [%s];\nTotal: %sms\n-------------------\nEnter \"autosetup\" for auto-setup.\nEnter \"help\" for help.\n", ...stats);

});

client.on("message", async function (message) {

  var content = message.content;

  if (content.startsWith(config["command-prefix"])) {

    var edited = content.substring(config["command-prefix"].length, content.length).split(/[ ]/g);

    var command = edited[0].toLowerCase();
    edited.splice(0, 1);

    if (message.channel.type === "text") {

      if (config["disabled-commands"].includes(command)) {
        message.channel.send(":x: That command has been disabled in the configuration!");
        return null;
      };

      for (var key in commands) {

        if (["admin", "game", "role"].includes(key)) {
          continue;
        };

        if (commands[key][command] !== undefined) {
          //logger.log(0, "User %s [%s#%s] executed %s-type command \"%s\".", member.id, member.user.username, member.user.discriminator, key, raw_command);
          await commands[key][command](message, edited, config);
          return null;
        };

      };

      if (commands.unaffiliated[command] !== undefined) {
        // Run command
        commands.unaffiliated[command](message, edited, config);
        return null;
      };

      if (commands.admin[command] !== undefined) {
        // Check permissions
        var member = message.member;

        if (member.roles.some(x => x.name === config["permissions"]["admin"])) {
          commands.admin[command](message, edited, config);
        } else {
          message.channel.send(":x: You do not have sufficient permissions to use this command!");
        };

        return null;
      };

      if (commands.lobby[command] !== undefined) {
        // Run command
        commands.lobby[command](message, edited, config);
        return null;
      };

    };

    if (process.game && message.channel.type === "dm") {

      // Log the command
      var log_channel = process.game.getNewLogChannel();
      log_channel.send(":exclamation: **" + message.author.username + "#" + message.author.discriminator + "**: " + message.content);

    };

    if (commands.game[command] !== undefined) {
      // Check if game is in progress
      if (process.game !== undefined) {

        var cond1 = process.game.state === "pre-game" && commands.game[command].ALLOW_PREGAME === false;
        var cond2 = process.game.state === "playing" && commands.game[command].ALLOW_GAME === false;
        var cond3 = process. game.state === "ended" && commands.game[command].ALLOW_POSTGAME === false;

        if (!cond1 && !cond2 && !cond3) {
          commands.game[command](process.game, message, edited);
        } else {

          if (cond1) {
            message.channel.send(":x: That command cannot be used in the pre-game!");
          } else if (cond2) {
            message.channel.send(":x: That command cannot be used when the game is running!");
          } else if (cond3) {
            message.channel.send(":x: That command cannot be used in the post-game!");
          };

        };

      } else {
        message.channel.send(":x: There is no game in progress!");
      };

    };

    // Run framework function
    if (commands.role[command] !== undefined) {
      // Check if game is in progress

      if (process.game !== undefined && process.game.state === "playing") {

        commands.role[command](process.game, message, edited);

      } else {
        //message.channel.send(":x: There is no game in progress!");
      };

      return null;

    };

  };

});

client.login(config["bot-token"]);
