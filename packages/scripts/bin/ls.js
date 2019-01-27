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
const firstParam = (process.argv[2] || "").replace(/[./]/g, "");

if (firstParam === "--help") {
  echo(`List all aviable scripts

${echo.strong("invoke ls")} <pattern> [...options]
`);
  process.exit(0);
}

const findLocalScripts = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "find-local-scripts"
));

findLocalScripts({
  cwd: process.cwd(),
  summary: true,
  group: true,
  match: firstParam
})
  .then(groups => {
    let output = [];

    Object.values(groups).forEach(group => {
      if (group.scripts.length) {
        output.push(`${echo.strong(group.description || group.path)}`);
        output = output.concat(group.scripts.map(({
          name, description
        }) => `${name} \t${echo.soft(description)}`));
        output.push("");
      }
    });

    echo(output.join("\n"));
  })
  .catch(e => {
    throw e;
  });
