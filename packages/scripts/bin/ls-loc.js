#!/usr/bin/env node
if (!process.env.INVOKE_SCRIPT_CORE) {
  console.warn("This script should be executed with invoke-script command");
  process.exit(1);
}
const path = require("path");
const echo = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "echo"
));
const parseArgv = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "parse-argv"
));
const getScriptPaths = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "get-script-paths"
));

const firstArg = (process.argv[2] || "").replace(/[./]/g, "");

/* Help */
if (firstArg === "--help") {
  echo(`List all aviable script locations

${echo.strong("invoke ls-loc")}

Options:
  --cwd) Current working directory
  --json, -j) Display report in json format
`);
  process.exit(0);
}

const args = parseArgv(process.argv.slice(2));

getScriptPaths({
  cwd: process.cwd() || args.cwd
})
  .then(locations => {
    if (args.json || args.j) {
      console.log(JSON.stringify(locations, null, 1));
    } else {
      console.log(locations.join("\n"));
    }
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
