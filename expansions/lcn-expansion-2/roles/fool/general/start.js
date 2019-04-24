// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.jester_lynched = false;

  player.game.addAction("fool/lynched", ["lynch"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
