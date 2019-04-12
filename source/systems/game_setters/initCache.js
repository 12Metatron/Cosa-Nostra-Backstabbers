var logger = process.logger;

var fs = require("fs");

module.exports = function (client, config) {

  var directories = [__dirname + "/../../../data", __dirname + "/../../../data/game_cache", __dirname + "/../../../data/game_cache/players"];

  for (var i = 0; i < directories.length; i++) {
    if (!fs.existsSync(directories[i])) {
      fs.mkdirSync(directories[i]);
      logger.log(2, "[Routine] created cache directories.");
    };
  };

};
