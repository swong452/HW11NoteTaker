// Create express framework
var express = require('express');
var path = require("path");
var fs = require('fs');

var app = express();
var PORT = 3002;

var notesArray = [];

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

// This Route will Read notes content from db.json, into a noteObj
// Need to enter this before *, else * will match first.
app.get('/api/notes', function (req, res) {

    //let data = fs.readFileSync('./db/db.json', "utf8")
    //console.log("Data is: ", data, data.length);
    console.log("API GETS Function");
    fs.readFile('./db/db.json', "utf8", function (err, data) {
        if (err) throw err;
        console.log("Read db.json file: current data is ", data, data.length);
        console.log("During Read db.json file: current notesArray is ", notesArray);
        if (data.length > 0) {
            let noteObj = JSON.parse(data);
            console.log("After json parse , noteObj is:", noteObj, typeof (noteObj));
            return res.json(noteObj);
        }
    });
})

app.post('/api/notes', function (req, res) {
    var newNote = req.body;
    console.log("POST Function");
    console.log("note array Before:", notesArray);
    console.log("Posted new note Object:", newNote, typeof (newNote));
    notesArray.push(newNote);
    console.log("New note array list After Push is:", notesArray);
    // before write to a file, convert object into JSON Text 
    let notesArrayText = JSON.stringify(notesArray);


    fs.writeFile('./db/db.json', notesArrayText, function (err, data) {
        if (err) throw err;
        console.log("file saved");
    });



})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})



app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

