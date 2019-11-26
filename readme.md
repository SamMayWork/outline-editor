# Oedit

### UP891153 - Application Engineering Coursework Submission

Oedit is an outline editor, that focuses on being keyboard friendly.

SASS (Syntactically Awesome Style Sheets)
    - A way of organising style sheets in a similar way to HTML, which cuts down on the amount of time spent making CSS Selectors


### Technical Explantions

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