const path = require("path");

/* Determine is script used in this request */
function runEntryScreen(argv) {
  const {
    query,
    options,
    args
  } = require("@invoke-script/core/extract-argv")(argv);

  return require("@invoke-script/from-scripts")(
    "menu",
    {},
    []
  );
}

module.exports = {
  match: argv => argv.length === 0,
  description: "Run entry screen",
  handler: runEntryScreen
};
