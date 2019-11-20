/**
 * Processes bullet points for a given line
 * @param {*} str 
 */
function processBulletPoints (str) {
    let bulletIndex = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] != "\t") {
            bulletIndex = i;
            break;
        }
    }

    if (bulletIndex > 0) {
        return splice(str, bulletIndex, "-");
    } else {
        return str;
    }
}

/**
 * Splices a string with the provided value
 * @param {string} str String to splice into
 * @param {number} index Index to splice into
 * @param {string} value Value to be spliced into the string
 */
function splice (str, index, value) {
    let charsArr1 = str.slice(0, index);
    let charsArr2 = str.slice(index, str.length);

    let newArr1 = charsArr1.concat(value.split(","));
    let newArr2 = newArr1.concat(charsArr2);

    return newArr2;
}

let x = "\t\t\t hello, world!";
console.log(processBulletPoints(x));