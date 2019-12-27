const express = require('express');
const bodyParser = require('body-parser');
const Postgres = require('pg').Client;
const argv = require('yargs');

const configuration = {
  nodb: false,
  port: 8080,
  verbose: false,
  logRequests: false,
};

/**
 * Prints the message to the screen using a red background
 * @param {String} error error to be printed to the screen
 */
function errorText(error) {
  console.log('\x1b[41m%s\x1b[0m', error);
}

/**
 * Generates a psuedo-random ID of a given length
 * @param {number} length The length of the ID to return
 */
function generateId(length) {
  const values = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const generatedId = [];

  for (let i = 0; i < length; i++) {
    generatedId.unshift(values[Math.floor(Math.random() * values.length)]);
  }

  return generatedId.join('');
}

/**
 * Starts the DB for the application
 */
function startDB() {
  try {
    const sql = new Postgres({
      database: 'oeditbackend',
      statement_timeout: 5000,
      host: '/var/run/postgresql',
    });

    console.log('Connecting to the Database');
    sql.connect();

    sql.on('error', (err) => {
      console.log(err);
      sql.end();
    });
  } catch (error) {
    console.log(error);
    errorText('Unable to connect to the Database Resource, continuing starting server without attached DB');
  }
}

/**
 * Attempts to get the title and content of a note using its ID
 * @param {String} id The ID of the note to find in the database
 * @param {*} sql An SQLConnection to pull the information from
 */
async function getNote(id, sql) {
  console.log(`Request for ${id}`);
  const query = 'SELECT * FROM displaynotes WHERE note_id = $1';
  const results = await sql.query(query, [id]);
  return {
    id: results.rows[0].note_id,
    title: results.rows[0].note_title,
    content: results.rows[0].note_content,
  };
}

/**
 * Stores the title and content of a note into the database
 * @param {String} title The title of the note to save
 * @param {String} content The content of the note to save
 * @param {*} sql An SQLConnection to pull the information from
 */
async function displayNote(title, content, sql) {
  const query = 'INSERT INTO displaynotes VALUES ($1, $2, $3);';
  sql.query(query, [generateId(8), title, content]);
}

function start() {
  if (argv.nodb) { configuration.nodb = true; }
  if (argv.port !== undefined) { configuration.port = argv.port; }
  if (argv.verbose) { configuration.verbose = true; }

  if (configuration.verbose) { console.log('Starting the express server...'); }
  const app = express();

  if (configuration.nodb === false) {
    console.log('Starting the Database...');
    startDB();
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Serve the static content
  app.use(express.static('.'));

  // #region HTTP paths

  app.get('/api', async (req, res) => {
    console.log('request');
    const content = await getNote(req.query.id);
    res.json(content);
    res.end();
  });

  app.post('/api/savenote', (req, res) => {
    if (configuration.nodb) {
      res.status('404');
      res.end();
    }

    displayNote(req.body.title, req.body.content);
    res.end();
  });

  app.get('*', (req, res) => {
    res.end('file not found');
  });

  // #endregion

  if (configuration.verbose) { console.log(`Starting listening on the port ${configuration.port}`); }
  app.listen(configuration.port);
}

if (require.name === module) {
  start();
} else {
  errorText('Server not started from module!');
}
