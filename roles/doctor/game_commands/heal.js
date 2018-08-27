// Register heal

var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (game, message, params) {

  var actions = game.actions;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "heal <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);

  if (to.score > 3 || params[0].toLowerCase() === "nobody") {
    actions.delete(x => x.from === message.author.id && (x.identifier === "doctor/doc_protect" || x.identifier === "doctor/doc_protect_self"));
    message.channel.send(":syringe: You have decided to protect nobody tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot heal a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  actions.delete(x => x.from === message.author.id && (x.identifier === "doctor/doc_protect" || x.identifier === "doctor/doc_protect_self"));

  if (to.id === message.author.id) {
    // Do stuff

    if (to.misc.doc_self_heals < 1) {
      message.channel.send(":x: You have used up all your self-heals! Try healing someone else!");
      return null;
    };

    var mention = "yourself";

    game.addAction("doctor/doc_protect_self", ["cycle"], {
      name: "Doc-protect",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

  } else {

    game.addAction("doctor/doc_protect", ["cycle"], {
      name: "Doc-protect",
      expiry: 1,
      from: message.author.id,
      to: to.id
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
