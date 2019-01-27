const {
  spawn
} = require("child_process");

module.exports = function asyncSpawn(cmd, args, options) {
  const cwd = process.cwd();


  return new Promise((resolve, reject) => {
    const childProcess = spawn(cmd, args, {
      cwd,
      stdio: [
        "inherit",
        "inherit",
        "inherit"
      ],
      ...options
    });

    childProcess.on("close", resolve);
    childProcess.on("error", reject);
  });
};
