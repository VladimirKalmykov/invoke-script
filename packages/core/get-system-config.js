const fs = require("fs");
const ini = require("ini");
const resolveSystemPath = require("./resolve-system-path");

module.exports = async function getSystemConfig() {
  const configPath = await resolveSystemPath("config");

  if (!fs.existsSync(configPath)) {
    return {};
  }

  return ini.parse(fs.readFileSync(configPath, "utf-8"));
};
