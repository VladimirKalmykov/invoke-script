const Confirm = require("prompt-confirm");

module.exports = function confirm(question) {
  const dialog = new Confirm(question);

  return dialog.run();
};
