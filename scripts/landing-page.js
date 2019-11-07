function start () {
    window.newnote.addEventListener("click", getTitle);
    window.go.addEventListener("click", makeNewNote);
}

function getTitle () {
    window.notecontainer.style.display = "block";
}

function makeNewNote () {
    localStorage.setItem("rootElement", window.rootElement.value);
    localStorage.setItem("newNote", "1");
    window.open ("editor.html", "_self", false);
}