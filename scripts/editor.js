"use strict";

function start () {
    window.indent.addEventListener ("click", indentOnStartOfLine);
    window.outdent.addEventListener ("click", outdentOnStartOfLine);
}

/**
 * Event Handler for outdent on current line
 * @param {*} e 
 */
function outdentOnStartOfLine (e) {
    const rowsToSelection = getRowsToSelection();
    const restOfRows = getPostSelectionRows();

    let currentRow = rowsToSelection[rowsToSelection.length-1];
    let outdentedLine = outdentLine(currentRow);

    rowsToSelection.pop();
    restOfRows.shift();
    rowsToSelection.push(outdentedLine);

    window.editorwindow.value = rowsToSelection.concat(restOfRows).join('\n');
}

/**
 * Event Handler for indent on current line
 * @param {*} e 
 */
function indentOnStartOfLine (e) {
    const indentedEditor = splice(window.editorwindow.value,
        getCharacterPosOfSelectedLine(),
        "\t");
    window.editorwindow.value = indentedEditor;
}

/**
 * Gets an array of all the rows after and including the selected line
 */
function getPostSelectionRows () {
    return window.editorwindow.value.substring(window.editorwindow.selectionStart).split("\n");
}

/**
 * Gets an array of all the rows of content up to, and including the selected line 
 */
function getRowsToSelection () {
    return window.editorwindow.value.substring(0, window.editorwindow.selectionStart).split("\n");
}

/**
 * Gets the character position for the start of the selected line
 */
function getCharacterPosOfSelectedLine () {
    let content = getRowsToSelection();
    let curRowLength = content[content.length-1].split("").length;
    return window.editorwindow.selectionStart - curRowLength;
}

/**
 * Removes a tab character from the start of a string
 * @param {string} str String to outdent 
 */
function outdentLine (str) {
    const strA = str.split("");
    let revChar = strA.shift();

    if(revChar != '\t') {
        strA.unshift(revChar);
    }

    return strA.join("");
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