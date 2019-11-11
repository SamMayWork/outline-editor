"use strict";

let cursorPosition = 0;
let rootElement = "";

const settings = {
    "indent" : "Tab",
    "shiftForOutdent" : true,
    "outdent" : "Tab"
}

function start () {

    if (localStorage.getItem("newNote") == "1") {
        rootElement = `#${localStorage.getItem("rootElement")}`;
        window.editorwindow.value = rootElement;
        window.noteTitle.textContent = localStorage.getItem("rootElement");

        // Now convert the document from a temporary file to a permanent one
        // by assigning it an ID and assigning it its starting content
        localStorage.setItem(`${generateId(6)}`, { 
            "title" : localStorage.getItem("rootElement"),
            "id" : generateId(8),
            "content" : ""
        });

        output(null);
    } else {
        oldElementID = `${localStorage.getItem("loadNote")}`;
        loadedElement = localStorage.getItem(oldElementID);
        
        window.editorwindow.value = loadedElement.content;
        window.noteTitle = loadedElement.title;

        output(null);
    }

    localStorage.setItem("newNote", "0");


    window.editorwindow.addEventListener("keydown", preventTab);
    window.editorwindow.addEventListener("keyup", output);
    window.editorwindow.addEventListener("keyup", saveCursorPosition);

    window.indent.addEventListener ("click", indentOnStartOfLine);
    window.outdent.addEventListener ("click", outdentOnStartOfLine);

    window.editorwindow.addEventListener("blur", saveCursorPosition);
}

/**
 * Updates the window content by interpeting the markdowm in the editor
 * @param {*} e 
 */
function output (e) {
    // Prevent updating on arrow keys for optimisation
    if (e !== null && e.key.substring(0, 5) == "Arrow") { return; }
    interpretContent(window.editorwindow.value, window.outputWindow);
}

/**
 * Event handler for focus leaving the textarea
 */
function saveCursorPosition () {
    cursorPosition = window.editorwindow.selectionStart;
}

/**
 * Event Handler for outdent on current line
 * @param {*} e 
 */
function outdentOnStartOfLine (e) {
    const currentRow = outdentLine(getSelectedRow());
    window.editorwindow.value = getRowsToSelection().join("\n") + "\n" + currentRow + getPostSelectionRows().join("\n")
    cursorPosition -= 1;
}

/**
 * Event Handler for indent on current line
 * @param {*} e 
 */
function indentOnStartOfLine (e) {
    if(cursorPosition <= rootElement.length) {
        return;
    }
    window.editorwindow.value = getRowsToSelection().join("\n") + "\n\t" + getSelectedRow() + getPostSelectionRows().join("\n");

    cursorPosition += 1;
}

/**
 * Returns the entire content of the selected row
 */
function getSelectedRow () {
    let content = window.editorwindow.value;
    content = content.replace(getRowsToSelection().join("\n"), "");
    content = content.replace(getPostSelectionRows().join("\n"), "");
    return content.replace("\n", "");
}

/**
 * Gets an array of all the rows after the selected line
 */
function getPostSelectionRows () {
    const allRows = window.editorwindow.value.split("\n");
    const rowCountBeforeSelection = getRowsToSelection().length;
    return allRows.slice(rowCountBeforeSelection).slice(1);
}

/**
 * Gets an array of all the rows of content up to the selected line
 */
function getRowsToSelection () {
    const rows = window.editorwindow.value.substring(0, cursorPosition).split("\n");
    return rows.slice(0, rows.length-1);
}

/**
 * Prevents the user being able to switch focus while editing text
 * @param {*} e 
 */
function preventTab (e) {

    if (e.key != settings.indent && e.key != settings.outdent) {
        return;
    }

    if (e.key === settings.indent) {
        if (e.shiftKey == true && settings.shiftForOutdent== true) {
            outdentOnStartOfLine();
        } else {
            indentOnStartOfLine();
        }
    } else if (e.key === settings.outdent && settings.shiftForOutdent == false) {
        outdentOnStartOfLine();
    }
 
    window.editorwindow.selectionStart = cursorPosition;
    window.editorwindow.selectionEnd = cursorPosition;
    e.target.focus();
    e.preventDefault();
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

/**
 * Generates a psuedo-random ID of a given length
 * @param {number} length The length of the ID to return
 */
function generateId (length) {
    const values = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let generatedId = [];

    for (let i = 0; i < length; i++) {
        generatedId.unshift(values[Math.floor(Math.random() * values.length)]);
    }

    return generatedId.join("");
}