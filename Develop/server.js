// Create express framework
var express = require('express');
var path = require("path");
var fs = require('fs');

var app = express();
// Static Port if run on my PC
//var PORT = 3002;

// Dynamic Port on Heroku
var PORT = process.env.PORT || 3000;

// Array that store all notes. Later convert this array to JSON text and store in db.json.
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

// This Route will Read notes content from db.json, & convert into a noteObj
app.get('/api/notes', function (req, res) {

    //let data = fs.readFileSync('./db/db.json', "utf8")
    //console.log("Data is: ", data, data.length);
    console.log("API GETS Function");
    fs.readFile('./db/db.json', "utf8", function (err, data) {
        if (err) throw err;

        if (data.length > 0) {
            let noteObj = JSON.parse(data);

            // Every time we get notes; we set the notesArray conent = one from db.json parsed list of notes
            notesArray = noteObj;

            return res.json(noteObj);
        } else {
            noteObj = [];
            return res.json(noteObj);
        }
    });
})

app.post('/api/notes', function (req, res) {
    var newNote = req.body;
    notesArray.push(newNote);

    // before write to a file, convert object into JSON Text 
    let notesArrayText = JSON.stringify(notesArray);

    fs.writeFile('./db/db.json', notesArrayText, function (err, data) {
        if (err) throw err;
        console.log("file saved");

        // Question: it needs to return sth for the code to work
        // but the subsequent .then does not really need any return of this call back
        // what is the best practice to handle this ?
        return res.json(notesArray);


    });
}) // end app.post


app.delete('/api/notes/:id', function (req, res) {
    // read the db.json into the object array

    fs.readFile('./db/db.json', "utf8", function (err, data) {
        if (err) throw err;

        // convert the string into Object
        let noteObj = JSON.parse(data)

        // use filter, to remove the object with id = req.params.id, create a new array
        let noteObjRemain = noteObj.filter(obj => (obj.id !== req.params.id));

        // Copy the content of this reduced array, to the current array 
        notesArray = noteObjRemain;

        // save it back to db.json

        // before write to a file, convert object into JSON Text 
        let notesArrayText = JSON.stringify(noteObjRemain);

        fs.writeFile('./db/db.json', notesArrayText, function (err, data) {
            if (err) throw err;
            return res.json(true);
        })
    })
})

// Keep the wildcard * route to be last, else will match this first and redirect everything to index.html.
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

