"use strict";

const specChars = {
    "chars" : [
        { "md" : "\t", "html" : '&nbsp;&nbsp;&nbsp;&nbsp;- ' },
        { "md" : "\n", "html" : '<br>' },
        { "md" : "*", "html" : "<strong>" },
        { "md" : "_", "html" : "<em>" }
    ]
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
        element.innerHTML += convertToHTML(i) + "<br>";
    }
}

/**
 * Takes a line of input and converts the entire line fromn markdown into HTML
 * @param {*} str String to convert into HTML
 */
function convertToHTML(str) {
    
    str = escapeStrings(str);
    str = processHeadings(str);
    
    const strA = str.split("");
    const tokens = [];

    for (let i = 0; i < strA.length; i++) {
        for (let charI = 0; charI < specChars.chars.length; charI++) {
            if (strA[i] == specChars.chars[charI].md) {
                tokens.push([i, charI]);
            }
        }
    }
    
    for (let i of tokens) {
        strA.splice(i[0], 1, specChars.chars[i[1]].html);
    }

    return strA.join("");
}

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

function processHeadings (str) {
    const strA = str.split("");
    let count = 0;

    for (let i = 0; i < strA.length; i++) {
        if (strA[i] != "#") {
            count = i;
            break;
        }
    }

    if (count > 0) {
        strA.splice(0, count, `<h${count}>`);
        strA.push(`</h${count}>`);
    }

    return strA.join("");
}