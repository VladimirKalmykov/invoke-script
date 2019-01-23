const openTextEditor = require("@invoke-script/tools/open-text-editor");
const Bailout = require("@invoke-script/tools/bailout");
const parseScriptName = require("@invoke-script/tools/parse-script-name");
const resolveScriptBinaryPath = require("@invoke-script/tools/resolve-script-binary-path");
const input = require("@invoke-script/tools/input");
const message = require("@invoke-script/tools/message");
const pressAnyKey = require("@invoke-script/tools/press-any-key");
const writeScript = require("@invoke-script/tools/write-script");
const chalk = require("@invoke-script/tools/chalk");
const minimist = require("minimist");

module.exports = async function(argv) {
  const args = minimist(argv);

  /* Normalize required properties */
  const properties = {
    code: args.c || args.code,
    name: args["create-script"],
    shell: args.shell || "bash",
    description: args.d || args.description
  };

  /* Validate script name existing */
  if (!properties.name) {
    throw new Bailout("Script name required");
  }

  /* Validate script name format */
  let nameParts;

  try {
    nameParts = parseScriptName(properties.name);
  } catch (e) {
    throw new Bailout(e.message);
  }

  /* Check script existing */
  const binaryPath = await resolveScriptBinaryPath(...nameParts);

  if (binaryPath) {
    throw new Bailout(`Script ${properties.name} already exists`);
  }

  /* Check code existing */
  if (!properties.code) {
    if (!args["non-interactive"]) {
      /*
       * If code doesn't passed, it will be requested
       * via default code editor
       */
      console.clear();
      message("The script requires source code.");
      await pressAnyKey("Press any key\nto open\ncode editor...");
      properties.code = await openTextEditor();
    } else {
      throw new Bailout("You should specify script code");
    }
  }

  if (!properties.code) {
    throw new Bailout("Script code can not be empty. Creation abort.");
  }

  /* Check script description */
  if (!properties.description) {
    if (!args["non-interactive"]) {
      throw new Bailout("Script description is required");
    }
    /*
     * If code doesn't passed, it will be requested
     * via internal editor
     */
    console.clear();
    message("The description is missed.");
    while (!properties.description) {
      properties.description = await input("Enter script description");
    }
  }

  await writeScript(nameParts[0], nameParts[1], properties);
  message(`Script ${properties.name} successful created.
Usage:

  ${chalk.bold(`invoke ${properties.name} [...args]`)}

Guidance:
  invoke --edit-script
  invoke --remove-script
`);
};
