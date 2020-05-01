#!/usr/bin/env node --inspect --inspect-brk
const chalk = require("chalk");
const router = require("@invoke-script/cli-router");

// Check for built-in commands mode
router(process.argv.slice(2))
  .then(result => {
    if (result) {
      console.log(result);
    }
    process.exit(0);
  })
  .catch(e => {
    if (e.bailout) {
      console.log(chalk.red(e.message));
      if (e.hint) {
        console.log(chalk.gray(e.hint));
      }
    } else {
      console.log(e);
    }
    process.exit(e.code || 1);
  });
