module.exports = function wait(sec = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, sec * 1000);
  });
};
