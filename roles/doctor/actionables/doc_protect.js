var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {
  rs.prototypes.increaseImmunity(...arguments);
  var poisoned = rs.prototypes.removePoison(...arguments);

  var from = game.getPlayerByIdentifier(actionable.from);
  var to = game.getPlayerByIdentifier(actionable.to);

  if (poisoned) {
    var from = game.getPlayerByIdentifier(actionable.from);
    game.addMessage(from, ":exclamation: You cured your target of poison!");
  };

  if (from.status.roleblocked) {
    return null;
  };

  // Add message
  game.addAction("doctor/prot_message", ["attacked"], {
    name: "Doc-prot-success-message",
    from: actionable.from,
    to: actionable.to,
    expiry: 1
  });

};
