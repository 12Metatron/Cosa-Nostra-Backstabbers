var setups = require("../setups.js");
var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  var member = message.member;

  if (params.length < 1) {

    var identifiers = Object.keys(setups);

    var names = new Array();

    for (var i = 0; i < identifiers.length; i++) {

      var setup = setups[identifiers[i]];

      names.push("`" + setup.NAME + "`");

    };

    await message.channel.send(":video_game: **Available gamemodes**:\n\n" + names.join(", ") + "");

    return null;
  };

  if (process.game) {
    await message.channel.send(":x: Cannot set the gamemode while a game is still going on!");
    return null;
  };

  if (!process.lobby) {
    await message.channel.send(":x: No lobby to set the gamemode!");
    return null;
  };

  // Vote for gamemode
  var lobby = process.lobby;

  if (!lobby.isInGame(member)) {
    await message.channel.send(":x: You cannot vote for the gamemode if you are not in the game!");
    return null;
  };

  var best_hit = lobby.setup.getSetupMatch(params[0]);

  if (best_hit.score < 0.7) {
    await message.channel.send(":x: Cannot find that gamemode! Use `" + config["command-prefix"] + "gamemodes` to list all available gamemodes.");
    return null;
  };

  var gamemode = best_hit.identifier;

  var [vote_amount, game_hit, best_votes] = lobby.voteSetup(gamemode, member);

  await message.channel.send(":exclamation: **" + member.displayName + "** has voted on the **" + lobby.setup.getSetup(gamemode).NAME + "** gamemode [" + vote_amount + "]. Loaded game: **" + lobby.setup.getSetup(game_hit).NAME + "** [" + best_votes + "].");

};
