const clearLs = false;

function start () {
    if (clearLs) {
        localStorage.clear();        
    }

    // if this is a cold start, set up the notes we're going to need
    if (localStorage.getItem("notes") == undefined) {
        localStorage.setItem("notes", JSON.stringify([]));
    }

    // Show all of the old notes we need
    showOldNotes();

    window.go.addEventListener("click", makeNewNote);
    window.rootElement.addEventListener("keydown", makeNewNote);
    window.newnote.addEventListener("click", makeTitleInputVisible);
}

/**
 * When the new note button has been clicked, make the input field visible
 * @param {*} e 
 */
function makeTitleInputVisible (e) {
    window.notecontainer.style.display = "block";
    window.rootElement.focus();
}

/**
 * Makes a new note object in localstorage and then redirects the user to the editor page
 */
function makeNewNote (e) {
    if (e.type != "click" && e.type != "keydown") { return; }
    if (e.type == "keydown" && e.key != "Enter") { return; }

    if(window.rootElement.value.length == 0) { 
        alert("No content in the title field!");
        return; 
    }

    localStorage.setItem("editingnote", JSON.stringify({
        "title" : window.rootElement.value,
        "content" : "",
        "id" : generateId(8), 
        "dateCreated" : new Date().toDateString()
    }));

    localStorage.setItem("oldFlag", JSON.stringify(false));
    window.open("editor.html", "_self", false);
}

/**
 * Generates all of the quicklinks on the side of the page to all of the previous loaded notes
 */
function showOldNotes () {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    
    if (oldNotes == undefined || oldNotes.length == 0) { return; }

    let count = 0;
    for (let note of oldNotes) {
        if (count == 5) { break; }
        count++;

        const template = document.querySelector("#oldNoteContainer");
        const clonedItem = document.importNode(template.content, true);

        clonedItem.id = "";
        clonedItem.querySelector(".noteTitle").textContent = note.title;
        clonedItem.querySelector(".dateCreated").textContent = note.dateCreated;
        clonedItem.querySelector(".contentPreview").textContent = note.content.substring(0, 50) + "...";
        clonedItem.querySelector(".linesCount").textContent = `Lines: ${note.content.split("\n").length}`;

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