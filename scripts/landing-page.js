function start () {
    window.newnote.addEventListener("click", makeTitleInputVisible);

    // When the new note button is clicked, make all of the note in
    // local storage and then open it inside of the editor
    window.go.addEventListener("click", makeNewNote);
}

function makeTitleInputVisible (e) {
    window.rootElement.style.display = "block";
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