const Bailout = require("./bailout");
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
    let child;
    switch(process.platform) {
      case 'win32':
        child = spawn('node', [scriptPath, ...args], {
          stdio: [
            "inherit",
            "inherit",
            "inherit"
          ],
          cwd: process.cwd(),
          env
        });
      break;
      case 'darwin':
        child = spawn(scriptPath, args, {
          stdio: [
            "inherit",
            "inherit",
            "inherit"
          ],
          cwd: process.cwd(),
          env
        });
      break;
      default:
        throw new Bailout("Your platform is not supported");
      break;
    }

    child.on("exit", code => {
      process.exit(code);
      resolve();
    });
  });
};
