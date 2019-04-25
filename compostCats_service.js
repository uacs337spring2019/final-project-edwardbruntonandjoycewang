/*
Edward Brunton
Joyce Wang
CSC 337 001

Processes GET and POST requests to read and write to windrow.csv.
*/

"use strict";
const express = require("express");
const app = express();
const expressPort = process.env.PORT;
let fs = require('fs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
/**
 * Allows cross origin calls
 */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//allows access to public folder
app.use(express.static('public'));

/* Register a new user */
app.post('/register', jsonParser, function (req, res, next) {
    // Create a hash for the submitted password
    const email = req.body.email;
    let users = getUsers();
    const name = req.body.fullName;
    const password = req.body.password;
    if (users.hasOwnProperty(email)) {
        return returnError(res, 409, "User already exists");
    }
    if (name === undefined || password === undefined || email === undefined) {
        return returnError(res, 406, "Missing required field");
    }
    try {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                try {
                    fs.appendFileSync("users.txt", "\n" + name + ":::" + hash + ":::" + email);
                    res.sendStatus(201);
                    return;
                } catch(e){
                    return returnError(res, 500, "Could not write file");
                }
            });
        });
    } catch (e) {
        return returnError(res, 500, "Could not encrypt password");
    }
});
/* Register a new user */
app.post('/login', jsonParser, function (req, res, next) {
    // Create a hash for the submitted password
    console.log("Register request received");
    console.log(req.body);
    const email = req.body.email;
    let users = getUsers();
    const password = req.body.password;
    if (!users.hasOwnProperty(email)) {
        return returnError(res, 403, "Bad login credentials");
    }
    if (password === undefined || email === undefined) {
        return returnError(res, 406, "Missing required field");
    }
    try {
        bcrypt.compare(password, users[email].password, function (err, valid) {
            if (err) {
                return returnError(res, 500, "Bcrypt comparison issue");
            } if (valid) {
                res.send(200);
            } else {
                return returnError(res, 403, "Bad login credentials");
            }
        });
    } catch (e) {
        return returnError(res, 500, "Bcrypt comparison issue");
    }
});
/**
 * Returns a list of users
 * @returns {a list of users} users
 */
function getUsers() {
    let lines = readFile("users.txt");
    if (lines === 0) {
        return {};
    }
    let linesInList = lines.split(/\r?\n/);
    let users = {};
    for (let i = 0; i < linesInList.length; i++) {
        let parts = linesInList[i].split(":::");
        users[parts[2]] =
            {
                "name": parts[0],
                "email": parts[2],
                "password": parts[1]
            };
    }
    return users;
}
/**
 * reads data from the passed in file name
 * returns the contents of the file as a string
 * @param {the relative path name of the file} fileName
 */
function readFile(fileName) {
    let fileLines = 0;
    try {
        fileLines = fs.readFileSync(fileName, 'utf8');
    } catch (e) {
        //console.log('Error:', e.stack);
    }
    return fileLines;
}


/**
* This function adds the line to the file windrow.csv
* @param {a string to append to the file} line
*/
function appendLine(line) {
    fs.appendFile("windrow.csv", line, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

/**
 * Endpoint for posting a window detail
 */
app.post('/windrow', jsonParser, function (req, res) {
    const windrowNumber = req.body.windrowNumber;
    const start = req.body.startW;
    const end = req.body.finishW;
    const turnW = req.body.turnW;
    const waterW = req.body.waterW;
    const decontaminateW = req.body.decontaminateW;
    const manure = req.body.manure;
    const food = req.body.food;
    const overs = req.body.overs;
    const chipped = req.body.chipped;
    const tempM = req.body.tempM;
    const tempS = req.body.tempS;
    const date = req.body.date;
    if (date == undefined || start === undefined || end === undefined ||
        turnW === undefined || waterW === undefined ||
        decontaminateW === undefined || manure === undefined ||
        food === undefined || overs === undefined ||
        chipped === undefined || tempM === undefined ||
        tempS === undefined) {
        return returnError(res, 400, "Incomplete windrow post");
    }
    try {
        let foundW = 0;
        if (foundW == 0) {
            let line = "";
            let total = parseInt(manure) + parseInt(overs) + parseInt(food) + parseInt(chipped);
            if (start === true) {
                line = "\n" + windrowNumber + ",," + date + ",," + turnW + ","
                    + waterW + "," + decontaminateW + "," + food + "," + manure +
                    "," + chipped + "," + overs + "," + total + "," + total;
            }
            else if (end === true) {
                line = "\n" + windrowNumber + ",,," + date + "," + turnW + ","
                    + waterW + "," + decontaminateW + "," + food + "," + manure + "," +
                     chipped + "," + overs + "," + total + "," + total;
            }
            else {
                line = "\n" + windrowNumber + ",,,," + turnW + ","
                    + waterW + "," + decontaminateW + "," + food + "," + manure + "," + chipped +
                    "," + overs + "," + total + "," + total;
            }
            console.log(line);
            appendLine(line);
        }
    } catch (err) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

/**
 * Creates the standardized error return
 * @param {res object for sending message to client} res
 * @param {the error code, e.g. 404} code
 * @param {error message to give to user} message
 */
function returnError(res, code, message) {
    res.statusMessage = message;
    res.status(code).end();
    return;
}

//processes a request for windrow info
console.log('web service started');
app.get('/windrowGet', function (req, res) {
    try {
        let file = readFile("windrow.csv");
        let json = {};
        let allArr = [];
        let lines = file.split('\n');
        for (let i = 1; i < lines.length; i++) {
            let line = {};
            line["name"] = lines[i].split(',')[0];
            line["activeD"] = lines[i].split(',')[1];
            line["startD"] = lines[i].split(',')[2];
            line["endD"] = lines[i].split(',')[3];
            line["turn"] = lines[i].split(',')[4];
            line["water"] = lines[i].split(',')[5];
            line["decon"] = lines[i].split(',')[6];
            line["food"] = lines[i].split(',')[7];
            line["manure"] = lines[i].split(',')[8];
            line["chipped"] = lines[i].split(',')[9];
            line["overs"] = lines[i].split(',')[10];
            line["totalS"] = lines[i].split(',')[11];
            line["totalF"] = lines[i].split(',')[12];
            allArr.push(line);
        }
        json["windrows"] = allArr;
        res.json(json);
    } catch (e){
        res.sendStatus(400);
        return;
    }
});

console.log("Service running");
app.listen(expressPort);
