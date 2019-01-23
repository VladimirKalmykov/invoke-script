function removeScript() {
  console.log("Remove script");
}

module.exports = {
  match: argv => argv[0] === "--remove-script",
  description: "Remove script",
  handler: removeScript
};
