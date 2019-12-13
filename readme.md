# OEdit

### UP891153 - Application Engineering Coursework Submission
### This application requires npm run setup before it can be used

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

OEdit primarily runs on a static express server, saving all of its associated files and content to the local storage of the device it's being used on. _This is defintely not a perfect solution, but it works for now, and it can be improved in the future._ 

OEdit does have a server and associated database for the application, which allows users to share their notes publicly. The user can click the "display" button inside of their editor to send the version of the note they're currently working on to the server using a HTTP POST. The server recieves the request and saves the contents of the note to the database. If the server recieves a GET on the /api/ path with the ID of a note that in the database, it will serve the note and the content to the user. Unfortunately, due to time constraints I have not yet fully implemented viewing other peoples notes, however the server does send the information in raw JSON format. This is will be future work.

#### What's inside the npm run setup?

Inside of the NPM run setup command is actually 2 commands; firstly, the setup installs all of the dependencies needed to make the application run, then it opens PostgreSQL on the server and creates the database for all of the displayed notes to be held in. Then it loads the commands.sql file and executes it on the database - in this case it just creates an empty table.

#### How are the notes displayed in localstorage?

Inside of local storage there is an array of notes that have been previously created, inside each of the notes is the following JSON object:
  
```javascript
{
    "title" : window.rootElement.value,
    "content" : "",
    "id" : generateId(8), 
    "dateCreated" : new Date().toDateString()
}
```

### Why have I used QUnit?

I have used QUnit in this application to test a large portion of the editor.js file and the text-parser.js file. Unit testing allows me to see if my code works in the way I expect with a variety of test data - inside of the test.js files are all of the unit tests I have produced for this application. Using the results of these tests I was able to correct bugs inside of my files and make sure my application behaves as I expect. 

### Why have I used SASS?

I have used SASS (Syntactically awesome style sheets) extensively in this project to streamline the process of creaing CSS for my elements. SASS allows me to write CSS that mirrors the structure of the HTML which cuts down on the amount of time I need to spend writing and debugging CSS selectors. I have included an example of how I have used SASS to mirror the strcuture of my HTML below to show its power:

The HTML structure of the sidebar for the editor
```html
<div id="sidebar">
    <button id=indent>Indent</button>
    <button id=outdent>Outdent</button>
    <button id=lineUp>Move Up</button>
    <button id=lineDown>Move Down</button>
    <button id=display>Display</button>
    <button id=settings>Settings</button>
</div>
```

The SASS code behind the styling for this element
```css
#sidebar {
    grid-area : "sidebar";
    background-color : $dark-alt;
    color : $white;

    button {
        width : 100%;

        border-bottom : 1px solid gray;
        background-color : $light;
        font-size : 0.8em;
    }
}
```

What the CSS behind it would need to look like
```css
#sidebar {
    grid-area : "sidebar";
    background-color : $dark-alt;
    color : $white;
}

#sidebar button {
    width : 100%;

    border-bottom : 1px solid gray;
    background-color : $light;
    font-size : 0.8em;
}
```

*While there is little difference in the overall size of the written CSS, having the CSS styled in a logically similar way to the HTML cuts down on the time spent making selectors that target specific elements*.

## Future and Unfinished work
- The display notes section of the program exists and has the functionality on the server-side but not on the client side
- I have made all of the markup characters editable so it is possible to define your own markup language which is something I would like to implement in a settings file if possible
- I have made most of the keybindings rebindable, however I have not allowed the user to actually make changes to the bindings on the interface yet