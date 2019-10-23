"use strict";

function start () {
    window.indent.addEventListener("click", indentOnStartOfLine);
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
 * Gets an array of all the rows of content up to, and including the selected line 
 */
function getRowsToSelection () {
    return window.editorwindow.value.substr(0, window.editorwindow.selectionStart).split("\n");
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
 * Splices a string with the provided value
 * @param {*} str String to splice into
 * @param {*} index Index to splice into
 * @param {*} value Value to be spliced into the string
 */
function splice (str, index, value) {
    let charsArr1 = str.slice(0, index);
    let charsArr2 = str.slice(index, str.length);

    let newArr1 = charsArr1.concat(value.split(","));
    let newArr2 = newArr1.concat(charsArr2);

    return newArr2;
}