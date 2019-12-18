const clearLs = false;

window.addEventListener('load', start);

function start() {
  if (clearLs) {
    localStorage.clear();
  }

  // if this is a cold start, set up the notes we're going to need
  if (localStorage.getItem('notes') === undefined) {
    localStorage.setItem('notes', JSON.stringify([]));
  }

  // Show all of the old notes we need
  showOldNotes();

  window.go.addEventListener('click', makeNewNote);
  window.rootElement.addEventListener('keydown', makeNewNote);
  window.newnote.addEventListener('click', makeTitleInputVisible);
}

/**
 * When the new note button has been clicked, make the input field visible
 * @param {*} e
 */
function makeTitleInputVisible() {
  window.notecontainer.style.display = 'block';
  window.rootElement.focus();
}

/**
 * Makes a new note object in localstorage and then redirects the user to the editor page
 */
function makeNewNote(e) {
  if (e.type !== 'click' && e.type !== 'keydown') { return; }
  if (e.type === 'keydown' && e.key !== 'Enter') { return; }

  if (window.rootElement.value.length === 0) {
    alert('No content in the title field!');
    return;
  }

  localStorage.setItem('editingnote', JSON.stringify({
    title: window.rootElement.value,
    content: '',
    id: generateId(8),
    dateCreated: new Date().toDateString(),
  }));

  localStorage.setItem('oldFlag', JSON.stringify(false));
  window.open('editor.html', '_self', false);
}

/**
 * Generates all of the quicklinks on the side of the page to all of the previous loaded notes
 */
function showOldNotes() {
  const oldNotes = JSON.parse(localStorage.getItem('notes'));

  document.querySelector('.prevControls').innerHTML = '';

  if (oldNotes === undefined || oldNotes.length === 0) { return; }

  let count = 0;
  for (const note of oldNotes) {
    if (count === 5) { break; }
    count += 1;

    const template = document.querySelector('#oldNoteContainer');
    const clonedItem = document.importNode(template.content, true);

    clonedItem.id = '';
    clonedItem.querySelector('.noteTitle').textContent = note.title;
    clonedItem.querySelector('.dateCreated').textContent = note.dateCreated;
    clonedItem.querySelector('.contentPreview').textContent = `${note.content.substring(0, 50)}...`;
    clonedItem.querySelector('.linesCount').textContent = `Lines: ${note.content.split('\n').length}`;

    const editbut = document.createElement('button');
    editbut.textContent = 'Edit';
    editbut.addEventListener('click', onButtonClick);
    editbut.setAttribute('data-noteid', note.id);
    clonedItem.querySelector('.oldNote').appendChild(editbut);

    const delbut = document.createElement('button');
    delbut.textContent = 'Delete';
    delbut.addEventListener('click', onDeleteClick);
    delbut.setAttribute('data-noteid', note.id);
    clonedItem.querySelector('.oldNote').appendChild(delbut);

    document.querySelector('.prevControls').appendChild(clonedItem);
  }
}

/**
 * Handles the click event for deleting a note
 * @param {*} e The click event for the event
 */
function onDeleteClick(e) {
  const notes = JSON.parse(localStorage.getItem('notes'));
  let index = -1;
  for (let i = 0; i < notes.length; i += 1) {
    if (notes[i].id === e.target.dataset.noteid) {
      index = i;
    }
  }

  if (index !== -1) {
    notes.splice(index, 1);
  }

  localStorage.setItem('notes', JSON.stringify(notes));

  showOldNotes();
}

/**
 * Handles the click event for the edit button on each of the old notes
 * @param {ClickEvent} e The click event for the event (this is where we get the info from)
 */
function onButtonClick(e) {
  // Get the ID of the note that has been clicked and then redirect the user to the editor
  const editingNoteId = e.target.dataset.noteid;
  const currentNotes = JSON.parse(localStorage.notes);
  for (const note of currentNotes) {
    if (note.id === editingNoteId) {
      localStorage.setItem('editingnote', JSON.stringify(note));
      localStorage.setItem('oldFlag', JSON.stringify(true));
      window.open('editor.html', '_self', false);
      return;
    }
  }
}

/**
 * Generates a psuedo-random ID of a given length
 * @param {number} length The length of the ID to return
 */
function generateId(length) {
  const values = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const generatedId = [];

  for (let i = 0; i < length; i += 1) {
    generatedId.unshift(values[Math.floor(Math.random() * values.length)]);
  }

  return generatedId.join('');
}
