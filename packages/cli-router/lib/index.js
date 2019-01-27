const Bailout = require("@invoke-script/core/bailout");
const routes = [
  require("./routes/run-script"),
  require("./routes/run-remote-script")
];

module.exports = function(argv) {
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].match(argv)) {
      return routes[i].handler(argv);
    }
  }

  throw new Bailout("Unknown command", 127);
};
