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
const bcrypt = require("bcrypt-nodejs");
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
app.post('/register', function (req, res, next) {
    // Create a hash for the submitted password
    console.log("Register request received");
    //TODO fill this in
    bcrypt.hash(req.body.password, null, null, function (err, hash) {
        // Prepare a new user
        console.log("Password successfully hashed");
        
    });
});
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
app.listen(expressPort);