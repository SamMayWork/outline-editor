"use strict";

let cursorPosition = 0;
let rootElement = "";

const settings = {
    "indent" : "Tab",
    "shiftForOutdent" : true,
    "outdent" : "Tab",
    "saveFrequency" : 1000
}

let currentNoteID = "";

function start () {
    let contentFound = false;

    // Try and find a new note to make
    //      Found it? Open the note in the editor and change it from a prelim note
    //      to a proper note by adding it to the notes inside of LocalStorage
    // Try and find an old note to edit
    //      Found it? Set the ID as the current note and then open the note in the editor
    // If you've found nothing, open the most recent note in the editor

    if (localStorage.getItem("editingNote") != undefined) {
    
        let currentNotes = JSON.parse(localStorage.getItem("notes"));
        currentNotes.push(JSON.parse(localStorage.getItem("editingNote")));
        localStorage.setItem("notes", JSON.stringify(currentNotes));
        loadNote(JSON.parse(localStorage.getItem("editingNote")));
        contentFound = true;
    
    } else if (localStorage.getItem("oldNote" != undefined) ) {
    
        notes = JSON.parse(localStorage.getItem("notes"));
        for (let i in notes) {
            if (i.id == JSON.parse(localStorage.getItem("oldNote"))) {
                loadNote(i);
                contentFound = true;
            }
        }
    }

    // Reset the flags
    localStorage.setItem("editingNote", undefined);
    localStorage.setItem("oldNote", undefined);

    if (contentFound == false) {
        // If we haven't found anything to load, just load the most
        // recent note stored in local storage

        let notes = localStorage.getItem("notes");

        if (notes == undefined || notes.length == 0) {
            pageNotAvailable ();
            return;
        }

        loadNote(notes[notes.length-1]);
    }


    window.editorwindow.addEventListener("keydown", preventTab);
    window.editorwindow.addEventListener("keydown", handleNewLine);
    window.editorwindow.addEventListener("keyup", output);
    window.editorwindow.addEventListener("keyup", saveCursorPosition);

    window.indent.addEventListener ("click", indentOnStartOfLine);
    window.outdent.addEventListener ("click", outdentOnStartOfLine);

    window.editorwindow.addEventListener("blur", saveCursorPosition);

    window.logo.addEventListener("click", visitHomePage);

    // Set the auto-saver
    setInterval(saveContent, settings.saveFrequency);
}

/**
 * Highlights the selected line in the text area
 * @param {*} e 
 */
function updateSelectedLineHighlighting (e) {
    // TODO Clear the canvas
}

function visitHomePage (e) {
    // Redirect the user to the home page
    window.open("index.html", "_self", false);
}

/**
 * Loads a note object into both the UI and the editor
 * @param {Note} note The note to be edited
 */
function loadNote (note) {
    currentNoteID = note.id;
    window.editorwindow.value = note.content; 
    window.noteTitle.textContent = note.title;
    output(null);
}

/**
 * For whatever reason this page isn't valid, so show an error
 * and then allow the user to go back to the main page
 */
function pageNotAvailable () {
    alert("This page isn't valid");
    return;
}

/**
 * Handle for a new line being entered
 * @param {*} e 
 */
function handleNewLine (e) {
    if (e.key != "Enter") {
        return;
    }
}

/**
 * Every specified unit of time (in the settings) this functions saves the content
 * of the document to the local storage on the device
 */
function saveContent () {
    let notes = JSON.parse(localStorage.getItem("notes"));
    for (let i of notes) {
        if (i.id == currentNoteID) {
            i.content = window.editorwindow.value;
        }
    }

    localStorage.setItem("notes", JSON.stringify(notes));
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
    const currentRow = outdentString(getSelectedRow());
    window.editorwindow.value = getRowsToSelection().join("\n") + "\n" + currentRow + getPostSelectionRows().join("\n")
    cursorPosition -= 1;
    output(null);
}

/**
 * Event Handler for indent on current line
 * @param {*} e 
 */
function indentOnStartOfLine (e) {
    if(cursorPosition <= rootElement.length) {
        return;
    }

    window.editorwindow.value = getRowsToSelection().join("\n") + indentString(getSelectedRow()) + getPostSelectionRows().join("\n");

    cursorPosition += 1;
    output(null);
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
 
    //window.editorwindow.selectionStart = cursorPosition;
    //window.editorwindow.selectionEnd = cursorPosition;
    window.editorwindow.setSelectionRange(cursorPosition, cursorPosition);
    e.target.focus();
    e.preventDefault();
}

/**
 * Moves a given line in a text area up or down
 * @param {number} lineNumber The number of the line to move
 * @param {boolean} moveUp Indicates if the line should be moved up or down
 * @param {TextArea} textArea The textarea to move the line inside of
 */
function changeLinePosition (lineNumber, moveUp, textArea) {
    if (lineNumber < 0 || lineNumber > textArea.value.split("\n").length) { return; }
    if (lineNumber == 0 && moveUp == true) { return; }
    if (lineNumber == textArea.value.split("\n").length && moveUp == false) { return; }

    // Swap the indexes of the lines and then push back onto the text area

    let allLines = textArea.value.split("\n");
    let tmp = allLines[lineNumber];
    
    if (moveUp) {
        allLines[lineNumber] = allLines[lineNumber-1];
        allLines[lineNumber-1] = tmp;
    } else {
        allLines[lineNumber] = allLines[lineNumber+1];
        allLines[lineNumber+1] = tmp;
    }

    textArea.value = allLines.join("\n");
}

//#region content getters

/**
 * Returns the number index of the selected row
 */
function getSelectedRowNumber () {
    return window.editorwindow.value.substring(0, cursorPosition).split("\n").length;
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
    const rowCountBeforeSelection = getRowsToSelection().length + 1;
    return allRows.slice(rowCountBeforeSelection);
}

/**
 * Gets an array of all the rows of content up to (but not including) the selected line
 */
function getRowsToSelection () {
    const rows = window.editorwindow.value.substring(0, cursorPosition).split("\n");
    return rows.slice(0, rows.length-1);
}

function getAllContent ()  {
    return window.editorwindow.value.split("\n");
}

//#endregion

//#region Indent/Outdent

/**
 * Adds an indent to the start of a line
 * @param {string} str The string to have an indent added to
 */
function indentString (str) {
    return `\t${str}`;
}

/**
 * Removes a tab character from the start of a string
 * @param {string} str String to outdent 
 */
function outdentString (str) {
    const strA = str.split("");
    let revChar = strA.shift();

    if(revChar != '\t') {
        strA.unshift(revChar);
    }

    return strA.join("");
}

//#endregion