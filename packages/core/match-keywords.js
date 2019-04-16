module.exports = function matchKeywords(requiredKeywords, targetKeywords) {
  return Boolean(targetKeywords.find(keyword => requiredKeywords.includes(keyword)));
};
