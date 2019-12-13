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

module.exports.displayNote = function (title, content) {
    let query = "INSERT INTO displaynotes VALUES ($1, $2, $3);";
    sql.query(query, [generateId(8), title, content]);
}

module.exports.getNote = async function (id) {
    console.log(`Request for ${id}`);
    let query = "SELECT * FROM displaynotes WHERE note_id = $1";
    let results = await sql.query(query, [id]);
    return {
        id : results.rows[0].note_id,
        title : results.rows[1].note_title,
        content : results.rows[2].note_content
    };
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