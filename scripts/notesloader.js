
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

function showOldNotes() {
  const oldNotes = JSON.parse(localStorage.getItem('notes'));

  document.querySelector('.oldNoteContainer').innerHTML = '';

  if (oldNotes === undefined || oldNotes.length === 0) { return; }

  for (const note of oldNotes) {
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

    document.querySelector('.oldNoteContainer').appendChild(clonedItem);
  }
}

window.addEventListener('load', showOldNotes);
