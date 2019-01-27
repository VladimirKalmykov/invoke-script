const chalk = require("chalk");
const sll = require("single-line-log").stdout;

module.exports = function pressAnyKey(message = "Press any key to continue...", options = {}) {
  const ctrlC = options.ctrlC || "exit";
  const clear = options.clear || true;

  if (message) {
    sll(chalk.gray(`${message}`));
  }

  return new Promise((resolve, reject) => {
    const handler = buffer => {
      process.stdin.removeListener("data", handler);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      // Erase previous line
      if (message && clear) {
        sll("");
      }

      const bytes = Array.from(buffer);

      if (bytes.length && bytes[0] === 3) {
        if (ctrlC === "reject") {
          reject(new Error("User press CTRL+C"));
        } else if (ctrlC === "exit") {
          process.exit(0);
        }
      }
      process.nextTick(resolve);
    };

    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.once("data", handler);
  });
};
