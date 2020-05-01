const findLocalScript = require("@invoke-script/core/find-local-script");
const runScript = require("@invoke-script/core/run-script");
const Bailout = require("@invoke-script/core/bailout");

module.exports = async function invokeScript(query, options, args) {
  const scriptBinaryPath = await findLocalScript(query, {
    cwd: process.cwd()
  });

  if (!scriptBinaryPath) {
    throw new Bailout(`Script ${query} not found`, 1, `List all scripts:
  invoke ls
`);
  }

  if (options.resolve) {
    return scriptBinaryPath;
  }


  await runScript(scriptBinaryPath, args, {
    env: Object.create(process.env)
  });
};
