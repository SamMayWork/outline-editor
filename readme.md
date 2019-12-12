# OEdit

### UP891153 - Application Engineering Coursework Submission

OEdit is an outline editor, that tries to be keyboard-friendly.

### Key Features

- Entering text into an input field and being able to set a hierarchy by being able to indent and outdent lines
    - The input field is provided by a text-area which is editable on the left side of the screen and lines can in/outdented by using TAB and SHIFT + TAB or by using the provided button inside of the editor
- Support for basic markdown features, including *bold*, _italics_, and headings
    - Markdown characters inside of the provided inpiut field will be converted and displayed on the right hand side of the screen
- The ability to make new notes, and view and edit old notes
    - New notes can be created on the home page of the application, with old notes visible on the right hand side of the display
    - A full list of notes can also be viewed on the old notes page of the application1
- Moving lines up and down inside of the input field
    - This is achieved by either using the buttons inside of the editor or by using the keyboard commands CTRL + UP/DOWN

### Implementation

OEdit is implemented using a static webserver, and localstorage.

The core of the application is the editor and home page which is written using HTML, (SASS) CSS, and JavaScript. On startup the application checks localstorage to see if there are any old notes to load, and if found provides a thumbnail for the user to click on so they can edit that old note. The note is then loaded into the editor where changes can be made and then saved into localstorage.

The editor itself is comprised of 2 parts, the interface and the interpreter. The editor handles all user input and saving and allows the interpreter to work properly, the interpeter takes the content of the input field at regular intervals and interprets the markdown into HTML which is then inserted into the div on the right hand side of the page.

#### So how does it work?

OEdit primarily runs on a static express server, saving all of its associated files and content to the local storage of the device it's being used on. _This is defintely not a perfect solution, but it works for now, and it can be improved in the future._ OEdit does however, have a backend server that can be used to share notes with other people; this works by sending a POST to the API with all of the note content which is then stored into the database. The Server then generates a random string to host the note on and then binds it to that URL, so that anyone with that URL can access it and view the contents.

#### How are the notes displayed in localstorage?

- Contains an array of note objects that store each of the individual notes
- Each note object represents one of the notes that has been created using the outline-editor
  
```javascript
{
    "title" : window.rootElement.value,
    "content" : "",
    "id" : generateId(8), 
    "dateCreated" : new Date().toDateString()
}
```