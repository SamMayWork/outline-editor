"use strict";

// A collection of markdown characters and their HTML equivalent
const specChars = {
    "chars" : [
        { "md" : "\t", "html" : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', "ehtml" : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" },
        { "md" : "\n", "html" : '<br>'},
        { "md" : "*", "html" : "<strong>", "ehtml" : "</strong>" },
        { "md" : "_", "html" : "<em>", "ehtml" : "</em>" }
    ],

    "optionalChars" : {
        "bullet" : "-"
    }
}

/**
 * Takes the content of a text area and (assuming its markup is valid) converts
 * it into a HTML document and add the result to the provided element
 * @param {string} str Markdown content to represent
 * @param {*} element Element to insert the marked down document into
 */
function interpretContent (str, element) {
    element.innerHTML = "";
    const lines = str.split("\n");    
    for (let i of lines) {
        element.innerHTML += convertMdToHTML(i) + "<br>";
    }
}

/**
 * Takes a line of input and converts the entire line fromn markdown into HTML
 * @param {String} str String to convert into HTML
 */
function convertMdToHTML(str) {
    
    str = processBulletPoints (str);
    str = escapeStrings(str);
    str = processHeadings(str);
    
    const strA = str.split("");
    const tokens = [];

    // Go through each character
    for (let i = 0; i < strA.length; i++) {

        // Does the character match any of the special markdown chars we're looking for?
        for (let charI = 0; charI < specChars.chars.length; charI++) {

            // Sweet, push the index of the character and the chars we're replacing
            // it with into the list
            if (strA[i] == specChars.chars[charI].md) {

                // Count how many of that kind of token already exist on the line
                let count = 0;
                for (let token of tokens) {
                    if (token[1] == charI) {
                        count += 1;
                    }
                }

                // If the amount is even or 0, then push a start tag, otherwise push an end tag
                if (count == 0 || count % 2 == 0) { tokens.push([i, charI, specChars.chars[charI].html]); continue; }
                if (count % 2 == 1) { tokens.push([i, charI, specChars.chars[charI].ehtml]); }
            }
        }
    }    

    for (let token of tokens) {
        // Overwrite the markdown character with the chars we need for the HTML version
        console.log(`${token}`);
        
        strA.splice(token[0], 1, token[2]);
    }

    return strA.join("");
}

/**
 * Escapes a string of all angle brackets by replacing them with nothing
 * @param {String} str The string to remove angle brackets from 
 */
function escapeStrings (str) {
    const strA = str.split("");
    const naughtyObjects = [];
    for (let i = 0; i < strA.length; i++) {
        if (strA[i] == "<" || strA[i] == ">") {
            naughtyObjects.push(i);
        }
    }

    for (let i = naughtyObjects.length - 1; i >= 0; i--) {
        strA.splice(naughtyObjects[i], 1, "");
    }

    return strA.join("");
}

/**
 * Converts all markdown headings into proper HTML headings
 * @param {String} str 
 */
function processHeadings (str) {
    const strA = str.split("");
    let count = 0;

    for (let i = 0; i < strA.length; i++) {
        if (strA[i] != "#") {
            count = i;
            break;
        }
    }

    if (count > 0 && count <= 6) {
        strA.splice(0, count, `<h${count}>`);
        strA.push(`</h${count}>`);
    }

    return strA.join("");
}

/**
 * For a given string, inserts the chosen bullet character after all tabs
 * @param {*} str 
 */
function processBulletPoints (str) {

    // Iterate through, find the index after all of the tabs and insert
    // the chosen tab character
    let bulletIndex = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] != "\t") {
            bulletIndex = i;
            break;
        }
    }

    if (bulletIndex > 0) {
        return splice(str, bulletIndex, specChars.optionalChars.bullet);
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

    if (index > str.length || index < 0) { return undefined; }

    let charsArr1 = str.slice(0, index);
    let charsArr2 = str.slice(index, str.length);

    let newArr1 = charsArr1.concat(value.split(","));
    let newArr2 = newArr1.concat(charsArr2);

    return newArr2;
}