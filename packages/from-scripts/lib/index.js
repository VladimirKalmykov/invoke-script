const findLocalScript = require("@invoke-script/core/find-local-script");
const resolveScriptBinary = require("@invoke-script/core/resolve-script-binary");
const runScript = require("@invoke-script/core/run-script");
const Bailout = require("@invoke-script/core/bailout");

module.exports = async function invokeScript(query, options, args) {
  const scriptPath = await findLocalScript(query, {
    cwd: process.cwd()
  });

  if (!scriptPath) {
    throw new Bailout(`Script ${query} not found`, 1, `List all scripts:
  invoke ls
`);
  }

  const scriptBinaryPath = await resolveScriptBinary(scriptPath);

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
