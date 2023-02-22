#!/usr/bin/env node
const path = require("path");

if (!process.env.INVOKE_SCRIPT_CORE) {
  console.warn("This script should be executed with invoke-script command");
  process.exit(1);
}

const echo = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "echo"
));

if (process.argv[2] === "--help") {
  echo(`Install autocompletion

${echo.strong("invoke install-autocompletion")}

Options:
  No options
`);
  process.exit(0);
}

const asyncSpawn = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "async-spawn"
));

switch (process.platform) {
case "linux":
case "darwin":
  asyncSpawn("source", [ path.join(process.env.INVOKE_SCRIPT_CORE, "bin", "completion.bash") ]).catch(e => {
    echo(e.message);
    process.exit(1);
  });
  break;
default:
  echo("Sorry. Your operating system does not support autocompletion");
  process.exit(1);
  break;
}


