function start () {
    for (let i = 0; i < 5; i++) {
        let item = document.querySelector (".note-template");
        let clonedItem = document.importNode(item.content, true);
        clonedItem.querySelector(".noteTitle").textContent = "Hello World";
        document.querySelector(".noteContainer").appendChild(clonedItem);
    }
}