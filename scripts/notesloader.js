function start () {
    showOldNotes();
}

function showOldNotes () {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    
    if (oldNotes == undefined || oldNotes.length == 0) { return; }

    for (let note of oldNotes) {
        const template = document.querySelector("#oldNoteContainer");
        const clonedItem = document.importNode(template.content, true);

        clonedItem.id = "";
        clonedItem.querySelector(".noteTitle").textContent = note.title;
        clonedItem.querySelector(".dateCreated").textContent = note.dateCreated;
        clonedItem.querySelector(".contentPreview").textContent = note.content.substring(0, 50) + "...";
        clonedItem.querySelector(".linesCount").textContent = `Lines: ${note.content.split("\n").length}`;

        const but = document.createElement("button");
        but.textContent = "Edit";
        but.addEventListener("click", onButtonClick);
        but.setAttribute("data-noteid", note.id)
        clonedItem.querySelector(".oldNote").appendChild(but);

        document.querySelector(".oldNoteContainer").appendChild(clonedItem);
    }
}

/**
 * Handles the click event for the edit button on each of the old notes
 * @param {ClickEvent} e The click event for the event (this is where we get the info from)
 */
function onButtonClick (e) {
    // Get the ID of the note that has been clicked and then redirect the user to the editor
    const editingNoteId = e.target.dataset.noteid;
    let currentNotes = JSON.parse(localStorage.notes);
    for (note of currentNotes) {
        if (note.id == editingNoteId) {
            localStorage.setItem("editingnote", JSON.stringify(note));
            localStorage.setItem("oldFlag", JSON.stringify(true));
            window.open("editor.html", "_self", false);
            return;
        }
    }
}