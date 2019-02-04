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
const target = (process.argv[2] || "").replace(/[./]/g, "");

if (target === "--help") {
  echo(`List all aviable scripts

${echo.strong("invoke ls")} <pattern> [...options]
`);
  process.exit(0);
} else if (!target) {
  // Exit, if target is not specified
  echo("Name required");
  process.exit(1);
}

const cwd = process.cwd();

const findLocalScript = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "find-local-script"
));

findLocalScript(target, {
  cwd
})
  .then(pathname => {
    if (pathname) {
      echo(pathname);
    } else {
      echo(`Script ${target} is not exists`);
      process.exit(1);
    }
  })
  .catch(e => {
    throw e;
  });
