var auxils = require("./auxils.js");
var config = auxils.config_handler();

var fs = require("fs");

var expansions_dir = __dirname + "/../expansions/";
var expansions = getExpansions(config.playing.expansions);

module.exports = expansions;

function getExpansions (identifiers, scanned=new Array()) {

  var ret = new Array();

  for (var i = 0; i < identifiers.length; i++) {

    var identifier = identifiers[i].toLowerCase();

    if (identifier === "lcn") {
      throw new Error("Cannot have an expansion named \"lcn\"!");
    };

    if (scanned.some(x => x.identifier === identifier)) {
      // To prevent scanning twice
      return new Array();
    };

    var directory = expansions_dir + identifier;

    var is_directory = fs.lstatSync(directory).isDirectory();

    if (!is_directory) {
      throw new Error("Expansion directory " + directory + " does not exist.");
    };

    // Read information JSON
    var setup = JSON.parse(fs.readFileSync(directory + "/setup.json"));

    ret = ret.concat(getExpansions(setup.dependencies, ret));

    // Add information
    ret.push({identifier: identifier,
              setup: setup,
              additions: {
                roles: attemptReaddir(directory + "/roles"),
                flavours: attemptReaddir(directory + "/flavours"),
                role_win_conditions: attemptReaddir(directory + "/role_win_conditions"),
                attributes: attemptReaddir(directory + "/attributes")
              }});

  };

  return ret;

};

function attemptReaddir (directory) {

  if (!fs.existsSync(directory)) {
    return new Array();
  };

  return fs.readdirSync(directory);

};
