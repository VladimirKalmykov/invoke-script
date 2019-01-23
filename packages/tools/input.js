const readline = require("readline");

module.exports = function input(message, options = {}) {
  if (!message) {
    throw new Error("Input message required");
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(`${message}:${options.newLine ? "\n" : " "}`, value => {
      rl.close();
      resolve(value);
    });
  });
};
