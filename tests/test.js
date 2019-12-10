QUnit.module("text-parser");

QUnit.test("bullet test", function (assert) {
    assert.equal(processBulletPoints("\t\tThis is a string"), "\t\t-This is a string");
    assert.equal(processBulletPoints("\tThis is a string"), "\t-This is a string");
    assert.equal(processBulletPoints("This is a string"), "This is a string");
});

QUnit.test("heading test", function (assert) {
    assert.equal(processHeadings("#Hello, World!"), "<h1>Hello, World!</h1>");
    assert.equal(processHeadings("##Hello, World!"), "<h2>Hello, World!</h2>");
    assert.equal(processHeadings("###Hello, World!"), "<h3>Hello, World!</h3>");
    assert.equal(processHeadings("####Hello, World!"), "<h4>Hello, World!</h4>");
    assert.equal(processHeadings("#####Hello, World!"), "<h5>Hello, World!</h5>");
    assert.equal(processHeadings("######Hello, World!"), "<h6>Hello, World!</h6>");
    assert.equal(processHeadings("#######Hello, World!"), "#######Hello, World!");
});

QUnit.test("escape test", function (assert) {
    assert.equal(escapeStrings("<><>"), "");
    assert.equal(escapeStrings("<script>alert('Hello, world')</script>"), "scriptalert('Hello, world')/script");
});

QUnit.test ("conversion test", function (assert) {
    assert.equal(convertMdToHTML("*This is a test*"), "<strong>This is a test</strong>");
    assert.equal(convertMdToHTML("_This is a test_"), "<em>This is a test</em>");
    assert.equal(convertMdToHTML("\tThis is a test"), "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-This is a test");
    assert.equal(convertMdToHTML("#*_This is a test_*"), "<h1><strong><em>This is a test</em></strong></h1>");
    assert.equal(convertMdToHTML("1\n2"), "1<br>2");
});

QUnit.test ("overall conversion test", function (assert) {
    let newTextArea = document.createElement("textarea");
    interpretContent("#This is a title\n\t\tThis is also a test", newTextArea);
    assert.equal(newTextArea.value, "<h1>This is a title</h1><br>            -This is also a test");
});

QUnit.module("common");

QUnit.test("splice test", function (assert) {
    assert.equal(splice("Hello, world!", 0, "Hi"), "HiHello, world!");
    assert.equal(splice("Hello, world!", 1, "Hi"), "HHiello, world!");
    assert.equal(splice("Hello, world!", 8, "Hi"), "Hello, wHiorld!");
    assert.equal(splice("Hello, world!", -1, "Hi"), undefined);
    assert.equal(splice("Hello, world!", 14, "Hi"), undefined);
});

QUnit.module("editor");

QUnit.test("outdent string", function (assert) {
    assert.equal(outdentString("\tThis is some content"), "This is some content");
    assert.equal(outdentString("This is some content"), "This is some content");
    assert.equal(outdentString("\t\t\tThis is some content"), "\t\tThis is some content");
});

QUnit.test("indent string", function (assert) {
    assert.equal(indentString("This is a string"), "\tThis is a string");
    assert.equal(indentString("\t\t\tThis is a string"), "\t\t\t\tThis is a string");
});

QUnit.test("Switching line positions", function (assert) {
    let x = document.createElement("textarea");
    x.value = "1\n2\n3";

    changeLinePosition(1, true, x);
    assert.equal(x.value, "2\n1\n3");

    changeLinePosition(0, true, x);
    assert.equal(x.value, "2\n1\n3");

    changeLinePosition(0, false, x);
    assert.equal(x.value, "1\n2\n3");
});