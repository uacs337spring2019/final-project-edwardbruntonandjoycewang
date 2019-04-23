/*
Edward Brunton
Joyce Wang
CSC 337 001

Processes GET and POST requests to read and write to windrow.csv.
*/

"use strict";
const express = require("express");
const app = express();
const expressPort = 3000;//to work on horoku, change to: process.env.PORT
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

app.use(express.static('public'));

/* Register a new user */
app.post('/register', jsonParser, function (req, res, next) {
    // Create a hash for the submitted password
    console.log("Register request received");
    console.log(req.body);
    const email = req.body.email;
    let users = getUsers();
    const name = req.body.fullName;
    const password = req.body.password;
    console.log("parsed body");
    if (users.hasOwnProperty(email)) {
        console.log("user already exists");
        return returnError(res, 409, "User already exists");
    }
    if (name === undefined || password === undefined || email === undefined) {
        console.log("missing part of body");
        return returnError(res, 406, "Missing required field");
    }
    //TODO fill this in
    // bcrypt.hash(password, "someSalt?", null, function (err, hash) {
    // Prepare a new user
    console.log("beginning bcrypt");
    try {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                console.log("Password successfully hashed");
                try {
                    fs.appendFileSync("users.txt", "\n" + name + ":::" + hash + ":::" + email);
                    console.log("created successfully");
                    res.sendStatus(201);
                    return;
                } catch{
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
    console.log("parsed body");
    if (!users.hasOwnProperty(email)) {
        console.log("user does not exist");
        return returnError(res, 403, "Bad login credentials");
    }
    if (password === undefined || email === undefined) {
        console.log("missing part of body");
        return returnError(res, 406, "Missing required field");
    }
    console.log("beginning bcrypt");
    try {

        bcrypt.compare(password, users[email].password, function (err, valid) {
            if (err) {
                return returnError(res, 500, "Bcrypt comparison issue");
            } if (valid) {
                console.log("Valid password");
                res.send(200);
            } else {
                console.log("bad password");
                return returnError(res, 403, "Bad login credentials");
            }
        })
    } catch (e) {
        return returnError(res, 500, "Bcrypt comparison issue");
    }
});

function getUsers() {
    let lines = readFile("users.txt");
    console.log(lines);
    if (lines === 0) {
        console.log("bad file");
        return {};
    }
    let linesInList = lines.split(/\r?\n/);
    let users = {};
    for (let i = 0; i < linesInList.length; i++) {
        let parts = linesInList[i].split(":::");
        console.log(parts);
        users[parts[2]] =
            {
                "name": parts[0],
                "email": parts[2],
                "password": parts[1]
            };
        //  console.log(users);
    }
    console.log("finished creating users");
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
This function adds the line to the file windrow.csv
@param line a string to append to the file
*/
function appendLine(line){
  fs.appendFile("windrow.csv", line, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

app.post('/windrow', jsonParser, function (req, res) {
    console.log("posting");
    //  console.log(req);
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
   // const type = req.body.type;// F (food), M (manure), B(brush)"
    console.log(date);
    console.log(windrowNumber);
    console.log(start);
    console.log(end);
    console.log(turnW);
    console.log(waterW);
    console.log(decontaminateW);
    console.log(manure);
    console.log(food);
    console.log(overs);
    console.log(chipped);
    console.log(tempM);
    console.log(tempS);
  //  console.log(type);
    if (date == undefined || start === undefined || end === undefined ||
        turnW === undefined || waterW === undefined ||
        decontaminateW === undefined || manure === undefined ||
        food === undefined || overs === undefined ||
        chipped === undefined || tempM === undefined ||
        tempS === undefined) {
        return returnError(res, 400, "Incomplete windrow post");
    }
    try {
        var foundW = 0;
        var file = readFile("windrow.csv").split('\n');
        //console.log(file);
      /*  for (var i = 1; i<file.length;i++){
          var lineData = file[i].split(',');
          console.log(lineData);
          if (lineData[0]==windrowNumber){
            foundW++;
            var total = parseInt(manure)+parseInt(overs)+parseInt(food)+parseInt(chipped);
            if (start == true){
              file[i] = ",,,,g,,,,g,g";
              //linedata[2] = date;
            }
            else if (end == true){
              linedata[3] = date;
            }
            else if (tempM>=131 && temp2>=131){
              console.log("in");
              linedata[1] = date;
            }
            linedata[4]= linedata[4]+turnW;
            linedata[5] = linedata[5]+waterW;
            linedata[6] = linedata[6]+decontaminateW;
            linedata[7] = linedata[7]+food;
            linedata[8] = linedata[8]+manure;
            linedata[9] = linedata[9]+chipped;
            linedata[10] = linedata[10]+overs;
            linedata[11] = linedata[11]+total;
            linedata[12] = linedata[12]+total;
            break;
          }
        }*/
        if (foundW == 0){
          var total = parseInt(manure)+parseInt(overs)+parseInt(food)+parseInt(chipped);
          if (start == true){
            var line = "\n" + windrowNumber +",," + date+ ",," + turnW+ ","
            +waterW+ "," +decontaminateW+ "," +food+","+manure+ ","+chipped+"," +overs+ "," +total+ "," +total;
          }
          else if (end == true){
            var line = "\n" + windrowNumber +",,," + date+ "," + turnW+ ","
            +waterW+ "," +decontaminateW+ "," +food+","+manure+ ","+chipped+"," +overs+ "," +total+ "," +total;
          }
          else {
            var line = "\n" + windrowNumber +",,,," + turnW+ ","
             +waterW+ "," +decontaminateW+ "," +food+","+manure+ ","+chipped+"," +overs+ "," +total+ "," +total;
          }
          console.log(line);
          appendLine(line);
      }
    } catch {
        console.log("could not write windrow.csv file");
        res.sendStatus(500);
        return;
    }
    console.log("Write success");
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
app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
  try {
      var file = readFile("windrow.csv");
      var json = {};
      var allArr = [];
      var lines = file.split('\n');
      console.log(lines);
      for (var i = 1; i < lines.length; i++) {
        console.log(lines[i]);
        var line = {};
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
  } catch {
    console.log("could not read windrow.csv file");
    res.sendStatus(400);
    return;
  }
});

console.log("Service running");
//app.listen(expressPort);
app.listen(3000);
