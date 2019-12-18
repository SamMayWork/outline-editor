/**
 * Splices a string with the provided value
 * @param {string} str String to splice into
 * @param {number} index Index to splice into
 * @param {string} value Value to be spliced into the string
 */
function splice(str, index, value) {
  if (index > str.length || index < 0) { return undefined; }

  const charsArr1 = str.slice(0, index);
  const charsArr2 = str.slice(index, str.length);

  const newArr1 = charsArr1.concat(value.split(','));
  const newArr2 = newArr1.concat(charsArr2);

  return newArr2;
}
