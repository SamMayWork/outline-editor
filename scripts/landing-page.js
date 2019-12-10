const devTools = false;

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

    showOldNotes();

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

    if (e.type != "click" && e.type != "keydown") { return; }
    if (e.type == "keydown" && e.key != "Enter") { return; }

    localStorage.setItem("editingNote", JSON.stringify({
        "title" : window.rootElement.value,
        "content" : "",
        "id" : generateId(8), 
        "dateCreated" : new Date().toDateString()
    }));

    window.open("editor.html", "_self", false);
}

/**
 * Generates all of the quicklinks on the side of the page to all of the previous loaded notes
 */
function showOldNotes () {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    
    if (oldNotes == undefined || oldNotes.length == 0) { return; }

    for (let note of oldNotes) {
        const template = document.querySelector("#oldNoteContainer");
        const clonedItem = document.importNode(template.content, true);

        clonedItem.querySelector(".noteTitle").textContent = note.title;
        clonedItem.querySelector(".dateCreated").textContent = note.dateCreated;
        clonedItem.querySelector(".linesCount").textContent = note.content.split("\n").length;

        document.querySelector(".prevControls").appendChild(clonedItem);
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