function start () {
    setInterval(newElement);
}

function newElement () {
    const temp = document.querySelector("#keybind");
    const clone = document.importNode(temp.content, true);
    window.container.appendChild(clone);
}

function processHeadings (str) {
    const strA = str.split("");
    let count = 0;

    for (let i = 0; i < strA.length; i++) {
        if (strA[i] != "#") {
            count = i;
            break;
        }
    }

    console.log(count);
    
    if (count > 0) {
        console.log(">0");
        
        strA.splice(0, count, `<h${count}>`);
        strA.push(`</h${count}>`);
    }

    return strA.join("");
}