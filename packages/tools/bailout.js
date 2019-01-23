module.exports = class Bailout extends Error {
  constructor(message, code, hint) {
    super(message);
    this.code = code;
    this.bailout = true;
    this.hint = hint;
  }
};
