const express = require("express");
const model = require("./db-model");
const url = require("url");
const bodyParser = require("body-parser");
const app = express();

const Postgres = require("pg").Client;

const sql = new Postgres({
    database: 'oeditbackend',
    statement_timeout: 5000,
    host: '/var/run/postgresql'
});

sql.connect();

sql.on("error", (err) => {
    console.log(err);
    sql.end();
});


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static("."));

app.get("/api", async (req, res) => {
    console.log("request");
    const content = await getNote(req.query.id);
    res.json(content);
    res.end();
});

app.post("/api/savenote", (req, res) => {
    displayNote(req.body.title, req.body.content);
    res.end();
});

app.get("*", function (req, res) {
    res.end("file not found");
});

app.listen(8080);


async function getNote (id) {
    console.log(`Request for ${id}`);
    let query = "SELECT * FROM displaynotes WHERE note_id = $1";
    let results = await sql.query(query, [id]);
    return {
        id : results.rows[0].note_id,
        title : results.rows[0].note_title,
        content : results.rows[0].note_content
    };
}

async function displayNote (title, content) {
    let query = "INSERT INTO displaynotes VALUES ($1, $2, $3);";
    sql.query(query, [generateId(8), title, content]);
}

/**
 * Generates a psuedo-random ID of a given length
 * @param {number} length The length of the ID to return
 */
function generateId (length) {
    const values = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let generatedId = [];

    for (let i = 0; i < length; i++) {
        generatedId.unshift(values[Math.floor(Math.random() * values.length)]);
    }

    return generatedId.join("");
}