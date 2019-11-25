const devTools = true;

function start () {

    // If we're lauching with the dev tools enabled clear the
    // local storage so that we've got a fresh slate
    if (devTools) {
        localStorage.clear();        
    }

    if (localStorage.getItem("notes") == undefined) {
        localStorage.setItem("notes", JSON.stringify([]));
    }

    window.newnote.addEventListener("click", makeTitleInputVisible);

    // When the new note button is clicked, make all of the note in
    // local storage and then open it inside of the editor
    window.go.addEventListener("click", makeNewNote);
    window.rootElement.addEventListener("keydown", makeNewNote);
}

function makeTitleInputVisible (e) {
    window.notecontainer.style.display = "block";
    window.rootElement.focus();
}

/**
 * Makes a new note object in localstorage
 */
function makeNewNote (e) {
    if (e.key != "Enter") return;

    localStorage.setItem("editingNote", JSON.stringify({
        "title" : window.rootElement.value,
        "content" : "",
        id : generateId(8)
    }));

    window.open("editor.html", "_self", false);
}

/**
 * Checks the local storage to see if there's any load old notes to display
 * on the right hand side of the interface
 */
function loadOldNotes () {
    if (localStorage.getItem("notes") == undefined) {
        return;
    }

    let notes = JSON.parse(localStorage.getItem("notes"));

    for (let i of notes) {
        
    }
}

/**
 * Generates all of the quicklinks on the side of the page to all of the previous loaded notes
 */
function showOldNotes () {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    for (let note in oldNotes) {
        const template = document.querySelector("#oldNoteContainer");
        const clonedItem = template.importNode(template.content, true);
        window.prevControls.appendChild(clonedItem);
    }
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