# Oedit

### UP891153 - Application Engineering Coursework Submission

Oedit is an outline editor, that tries to be keyboard-friendly.



### Technical Explantions

#### So how does it work?

OEdit primarily runs on a static express server, saving all of its associated files and content to the local storage of the device it's being used on. _This is defintely not a perfect solution, but it works for now, and it can be improved in the future._ OEdit does however, have a backend server that can be used to share notes with other people; this works by sending a POST to the API with all of the note content which is then stored into the database. The Server then generates a random string to host the note on and then binds it to that URL, so that anyone with that URL can access it and view the contents.

#### So what's in LocalStorage?

notes:
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