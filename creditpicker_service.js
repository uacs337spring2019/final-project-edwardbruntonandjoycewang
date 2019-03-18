/*
Edward Brunton
CSC 337 001
*/
"use strict";
const express = require("express");
const app = express();
const expressPort = 3000;
let fs = require('fs');
let mysql = require('mysql');
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

app.get('/', function (req, res) {

});
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
    if(users.hasOwnProperty(email)){
        console.log("user already exists");
        return returnError(res, 409, "User already exists");
    }
    if(name === undefined || password === undefined || email === undefined){
        console.log("missing part of body");
        return returnError(res, 406, "Missing required field");
    }
    //TODO fill this in
   // bcrypt.hash(password, "someSalt?", null, function (err, hash) {
        // Prepare a new user
    console.log("beginning bcrypt");
    try{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            console.log("Password successfully hashed");
            try{
                fs.appendFileSync("users.txt",  "\n" + name + ":::" + hash + ":::" + email);
                console.log("created successfully");
                res.sendStatus(201);
                return;
            }catch{
               return returnError(res, 500, "Could not write file");
            }
        });
    });   
}catch(e){
    return returnError(res, 500, "Could not encrypt password");
} 
        
  //  });
});
function getUsers(){
    let lines = readFile("users.txt");
    console.log(lines);
    if(lines === 0){
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
//TODO gut and rewrite
app.post('/', jsonParser, function (req, res) {
    console.log("posting");
  //  console.log(req);
    const name = req.body.name;
    const comment = req.body.comment;
    console.log(name);
    console.log(comment);
    if(name.indexOf(":::") != -1 || comment.indexOf(":::") != -1
    ||name.indexOf("\n") != -1 || comment.indexOf("\n") != -1){
        console.log("invalid name or comment");
        res.sendStatus(400);
        return;
    }
    try{
        fs.appendFileSync("messages.txt",  "\n" + name + ":::" + comment);
    }catch{
        console.log("could not write file");
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
console.log("Service running");
app.listen(expressPort);