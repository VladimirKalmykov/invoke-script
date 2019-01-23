/**
 * Stringify args
 */
module.exports = function stringifyArguments(args) {
  return args.map(arg => ((/[\s\t]+/).test(arg)
    ? `'${arg.replace(/[']+/g, "\\'")}'`
    : arg)).join(" ");
};
