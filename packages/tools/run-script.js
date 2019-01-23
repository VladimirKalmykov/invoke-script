const {
  spawn
} = require("child_process");

module.exports = function runScript(scriptPath, args, env) {
  return new Promise(resolve => {
    const child = spawn(scriptPath, args, {
      stdio: [
        "inherit",
        "inherit",
        "inherit"
      ],
      cwd: process.cwd(),
      env
    });

    child.on("exit", code => {
      process.exit(code);
      resolve();
    });
  });
};
