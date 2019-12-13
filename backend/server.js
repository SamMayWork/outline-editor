const express = require("express");
const model = require("./db-model");
const url = require("url");
const app = express();

//app.use(express.static("."));

app.get("/api", async (req, res) => {
    console.log("request");
    //const parsedURL = url.parse(req, true);
    //const content = await getNote(parsedURL.query.id);
    //res.json(content);
    res.end();
});

app.post("/api/savenote", (req, res) => {
    res.end();
});

app.get("*", function (req, res) {
    res.end("file not found");
});

app.listen(8080, (err) => {console.log("err ", err);});