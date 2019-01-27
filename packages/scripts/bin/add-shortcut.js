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

if (process.argv[2] === "--help") {
  echo(`Add shortcut

${echo.strong("invoke add-shortcut")} <name> <query>
`);
}
