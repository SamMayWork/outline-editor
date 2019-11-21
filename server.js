const express = require("express");
const app = express();

app.use(express.static("."));

app.get("*", function (req, res) {
    res.end("file not found");
});

app.listen(8080);