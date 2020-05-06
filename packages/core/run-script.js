
const Bailout = require("./bailout");
const resolveWin32Interpreter = require("./win/resolveInterpreter");
const {
  spawn,
  execSync
} = require("child_process");

module.exports = async function runScript(scriptPath, args, options = {}) {
  /*
   * Add path to here package to
   * provide possibility to use
   * this API from executed script
   */
  const env = options.env || {};

  env.INVOKE_SCRIPT_CORE = __dirname;

  let child;

  switch (process.platform) {
  case "win32": {
    const [
      interpeter,
      bangArgs
    ] = await resolveWin32Interpreter(scriptPath);

    if (interpeter === "bash") {
      /* Bash (providede by Ubuntu command line utilities) requires path formatted to /mnt/[drive] */
      scriptPath = execSync(`bash -c "wslpath -a '${scriptPath}'"`).toString()
        .trim();
    }

    return new Promise(resolve => {
      child = spawn(interpeter, [
        ...bangArgs,
        `${scriptPath}`,
        ...args
      ], {
        stdio: [
          "inherit",
          "inherit",
          "inherit"
        ],
        cwd: process.cwd(),
        env
      });

      child.on("exit", code => {
        resolve();
        process.exit(code);
      });
    });
  }
  case "darwin": {
    return new Promise(resolve => {
      child = spawn(scriptPath, args, {
        stdio: [
          "inherit",
          "inherit",
          "inherit"
        ],
        cwd: process.cwd(),
        env
      });

      child.on("exit", code => {
        resolve();
        process.exit(code);
      });
    });
  }
  default:
    throw new Bailout("Your platform is not supported");
  }
};
