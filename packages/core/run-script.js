const {
  spawn
} = require("child_process");

module.exports = function runScript(scriptPath, args, options = {}) {
  /*
   * Add path to here package to
   * provide possibility to use
   * this API from executed script
   */
  const env = options.env || {};

  env.INVOKE_SCRIPT_CORE = __dirname;

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
