"use strict";

let cursorPosition = 0;
let rootElement = "";

const settings = {
    "indent" : "Tab",
    "shiftForOutdent" : true,
    "outdent" : "Tab"
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
    
        notes = localStorage.getItem("notes");
        for (let i in notes) {
            if (i.id == localStorage.getItem("oldNote")) {
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
    window.editorwindow.addEventListener("keydown", saveContent);
    window.editorwindow.addEventListener("keyup", output);
    window.editorwindow.addEventListener("keyup", saveCursorPosition);

    window.indent.addEventListener ("click", indentOnStartOfLine);
    window.outdent.addEventListener ("click", outdentOnStartOfLine);

    window.editorwindow.addEventListener("blur", saveCursorPosition);
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
 * Everytime a key is pressed, make a copy of the document and save it to local storage
 * @param {*} e 
 */
function saveContent (e) {
    let notes = localStorage.getItem("notes");
    for (let i in notes) {
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
    const currentRow = outdentLine(getSelectedRow());
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
    window.editorwindow.value = getRowsToSelection().join("\n") + "\n\t" + getSelectedRow() + getPostSelectionRows().join("\n");

    cursorPosition += 1;
    output(null);
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
 
    //window.editorwindow.selectionStart = cursorPosition;
    //window.editorwindow.selectionEnd = cursorPosition;
    window.editorwindow.setSelectionRange(cursorPosition, cursorPosition);
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
