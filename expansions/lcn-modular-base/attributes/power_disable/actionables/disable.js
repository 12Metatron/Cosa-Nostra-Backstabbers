var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.to);
  var disabler = game.getPlayerByIdentifier(actionable.from);

  // Considered as visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  game.addAction("a/power_disable/further_disable_message", ["cycle"], {
    name: "Modular-disable",
    expiry: 2,
    execution: 2,
    from: actionable.from,
    to: actionable.to,
    priority: 2
  });

  game.addAction("a/power_disable/further_disable", ["cycle"], {
    name: "Modular-disable",
    expiry: 3,
    execution: 3,
    from: actionable.from,
    to: actionable.to,
    priority: 0.000001
  });

  game.addMessage(target, ":exclamation: You were disabled last night! You may not use any action the next night.");

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
