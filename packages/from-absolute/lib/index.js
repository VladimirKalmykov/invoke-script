const resolveScriptBinary = require("@invoke-script/core/resolve-script-binary");
const runScript = require("@invoke-script/core/run-script");
const Bailout = require("@invoke-script/core/bailout");

module.exports = async function invokeAbsolute(query, options, args) {
  const scriptBinaryPath = await resolveScriptBinary(query);

  if (!scriptBinaryPath) {
    throw new Bailout(`Script ${query} founded, but has no executable file`, 1);
  }

  if (options.resolve) {
    return scriptBinaryPath;
  }

  await runScript(scriptBinaryPath, args, {
    env: Object.create(process.env)
  });
};
