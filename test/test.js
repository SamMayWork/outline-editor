function start () {
    for (let i = 0; i < 5; i++) {
        let item = document.querySelector (".note");
        let clonedItem = document.importNode(item.content, true);
        document.querySelector(".templateContainer").appendChild(clonedItem);
    }
}