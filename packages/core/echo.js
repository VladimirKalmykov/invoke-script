const cliui = require("cliui");
const chalk = require("chalk");

function echo(message) {
  const ui = cliui();

  ui.div(message);
  console.log(ui.toString());
}

echo.strong = chalk.cyan.bold;
echo.soft = chalk.gray;

Object.assign(echo, chalk);

module.exports = echo;
