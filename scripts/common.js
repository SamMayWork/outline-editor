/**
 * Splices a string with the provided value
 * @param {string} str String to splice into
 * @param {number} index Index to splice into
 * @param {string} value Value to be spliced into the string
 */
function splice (str, index, value) {

    if (index > str.length || index < 0) { return undefined; }

    let charsArr1 = str.slice(0, index);
    let charsArr2 = str.slice(index, str.length);

    let newArr1 = charsArr1.concat(value.split(","));
    let newArr2 = newArr1.concat(charsArr2);

    return newArr2;
}