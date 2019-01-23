
const {
  spawn
} = require("child_process");
const parseScriptName = require("@invoke-script/tools/parse-script-name");
const resolveScriptBinaryPath = require("@invoke-script/tools/resolve-script-binary-path");
const runScript = require("@invoke-script/tools/run-script");
const Bailout = require("@invoke-script/tools/bailout");

module.exports = async function invokeScript(query, options, args) {
  let scriptName;

  try {
    scriptName = parseScriptName(query);
  } catch (e) {
    throw new Bailout(e.message);
  }

  const [
    section,
    name
  ] = scriptName;

  const scriptPath = await resolveScriptBinaryPath(section, name);

  if (!scriptPath) {
    throw new Bailout(`Script ${query} not found`, 1, `List all scripts:
  invoke --scripts
`);
  }

  if (options.resolve) {
    return scriptPath;
  }

  await runScript(scriptPath, args, Object.create(process.env));
};
