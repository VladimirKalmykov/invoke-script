#!/usr/bin/env node
if (!process.env.INVOKE_SCRIPT_CORE) {
  console.warn("This script should be executed with invoke-script command");
  process.exit(1);
}
const {
  exec
} = require("child_process");
const path = require("path");
const echo = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "echo"
));
const target = process.argv[2] || "";
const args = require("minimist")(process.argv.slice(2));

if (target === "--help") {
  echo(`Edit script with your favour IDE

${echo.strong("invoke edit")} <name> --editor [editor]

Options:
  --editor, -e) Editor shell command

Example:
  # edit with vscode
  invoke edit my-script -e code
`);
  process.exit(0);
} else if (!target) {
  // Exit, if target is not specified
  echo("Name required");
  process.exit(1);
}

const cwd = process.cwd();

const scriptPathResolver = path.isAbsolute(target)
  ? Promise.resolve(target)
  : require(path.join(
    process.env.INVOKE_SCRIPT_CORE,
    "find-local-script"
  ))(target, {
    cwd,
    detailed: true
  });

scriptPathResolver
  .then(scriptInfo => {
    if (scriptInfo) {
      const resource = scriptInfo.directory || scriptInfo.binary;
      const cmd = args.editor || args.e || "open";

      echo(`Starts edit ${resource} with ${echo.strong(cmd)} editor`);

      return exec(`${cmd} ${resource}`);
    }
  })
  .catch(e => {
    throw e;
  });
