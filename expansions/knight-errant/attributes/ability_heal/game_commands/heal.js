var lcn = require("../../../../../source/lcn.js");

// Register protect

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "heal <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  rs.modular.clearModuleActions(game, from.identifier, "ability");

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
    message.channel.send(":syringe: You have decided to heal nobody tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot heal a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {
    // Do stuff
    message.channel.send(":x: You cannot heal yourself!");
    return null;

  } else {

    game.addAction("a/ability_heal/heal", ["cycle"], {
      name: "Modular-heal",
      expiry: 1,
      from: message.author.id,
      meta: {type: "ability"},
      to: to.id,
      priority: 3
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":syringe: You have decided to heal **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
