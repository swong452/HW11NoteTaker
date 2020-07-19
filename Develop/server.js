// Create express framework
var express = require('express');
var path = require("path");
var fs = require('fs');

var app = express();
var PORT = 3002;

// setup express to handle JSON data parsing and obj/string
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

// Need to enter this before *, else * will match first.
app.get('/api/notes', function (req, res) {
    fs.readFile('./db/db.json', "utf8", function(err, data) {
        if (err) throw err;
        console.log ("so far data is:", data, typeof(data));
        let noteObj = JSON.parse(data);
        console.log ("After json parse , noteObj is:", noteObj, typeof(noteObj));
        return res.json(noteObj);
    })
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})



app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

