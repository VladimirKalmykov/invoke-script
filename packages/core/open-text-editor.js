const fs = require("fs");
const tmp = require("tmp");
const asyncSpawn = require("./async-spawn");
const chokidar = require("chokidar");
const getSystemConfig = require("./get-system-config");
const Bailout = require("./bailout");

module.exports = async function openTextEditor(filepath, defaultContent) {
  const config = await getSystemConfig();
  const editor = config.settings.code_editor || "vi";
  let onComplete;

  if (!filepath) {
    const tmpFile = await new Promise((resolve, reject) => {
      tmp.file((err, path, fd, cleanupCallback) => {
        if (err) {
          throw reject(err);
        }

        resolve({
          path,
          fd,
          onComplete: cleanupCallback
        });
      });
    });

    filepath = tmpFile.path;
    onComplete = tmpFile.onComplete;
  }

  if (typeof defaultContent === "string") {
    fs.writeFileSync(filepath, defaultContent);
  }
  const startEdititonTime = new Date().getTime();

  await asyncSpawn(editor, [ filepath ]);
  let content = fs.readFileSync(filepath, "utf-8");

  if (
    editor !== "vi" &&
    new Date().getTime() - startEdititonTime < 2000 &&
    !content.trim()
  ) {
    /*
     * Looks like user editor works in forked process
     * Wait for file changes
     */
    await new Promise((resolve, reject) => {
      const watcher = chokidar.watch(filepath, {
        persistent: true,
        ignoreInitial: true
      });

      watcher.on("change", () => {
        resolve();
        watcher.close();
      });
      watcher.on("unlink", () => {
        reject(new Bailout("Tempoarary file was deleted", 1));
      });
    });
    content = fs.readFileSync(filepath, "utf-8");
  }

  // Remove temporary file
  if (onComplete) {
    onComplete();
  }

  return content;
};
