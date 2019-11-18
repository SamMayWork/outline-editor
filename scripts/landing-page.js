const devTools = true;

function start () {

    // If we're lauching with the dev tools enabled clear the
    // local storage so that we've got a fresh slate
    if (devTools) {
        localStorage.clear();        
    }

    if (localStorage.getItem("notes") == undefined) {
        localStorage.setItem("notes", []);
    }

    window.newnote.addEventListener("click", makeTitleInputVisible);

    // When the new note button is clicked, make all of the note in
    // local storage and then open it inside of the editor
    window.go.addEventListener("click", makeNewNote);
}

function makeTitleInputVisible (e) {
    window.notecontainer.style.display = "block";
}

/**
 * Makes a new note object in localstorage
 */
function makeNewNote () {
    localStorage.setItem("editingNote", {
        "title" : window.rootElement.value,
        "content" : "",
        id : generateId(8)
    });

    window.open("editor.html", "_self", false);
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