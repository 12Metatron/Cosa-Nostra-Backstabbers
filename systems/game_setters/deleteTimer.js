var deleteCaches = require("./deleteCaches.js");

module.exports = function (client, config) {
  if (process.timer) {
    process.timer.destroy();

    delete process.timer;

    console.log("Destroyed previous Timer instance.");
  };

  deleteCaches(client, config);

};
