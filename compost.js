/*
Edward Brunton
Joyce Wang
CSC 337 001
*/
"use strict";
(function () {
    /**
     * Enables the click buttons after the html loads
     */
    window.onload = function (){
        document.getElementById("addW").onclick = submitWindrow;
        console.log("loaded next page");
    }
    function submitWindrow(){
        clearError();
        console.log(document.getElementById("date").value);
        let windrowNumber = document.getElementById("nameW").value;
        let startedToday = document.getElementById("startW").checked;
        let finishedToday = document.getElementById("finishW").checked;
        let turnW = document.getElementById("turnW").checked;
        let waterW = document.getElementById("waterW").checked;
        let decontaminateW = document.getElementById("decontaminateW").checked;
        let manure = document.getElementById("manure").value;
        let food = document.getElementById("food").value;
        let overs = document.getElementById("overs").value;
        let chipped = document.getElementById("chipped").value;
        let tempM = document.getElementById("tempM").value;
        let tempS = document.getElementById("tempS").value;
        if(!windrowNumber.match(/\d/)){
            addError("Windows Number must be a valid number");
        }
        if(!manure.match(/\d/)){
            addError("Manure added must be a valid number");
        }
        if(!food.match(/\d/)){
            addError("Food Waste Added must be a valid number");
        }
        if(!overs.match(/\d/)){
            addError("Overs Added must be a valid number");
        }
        if(!chipped.match(/\d/)){
            addError("Chipped Material Added must be a valid number");
        }
        if(!tempM.match(/\d/)){
            addError("Temperature Middle must be a valid number");
        }
        if(!tempS.match(/\d/)){
            addError("Temperature South must be a valid number");
        }
        if(document.getElementById("error").innerHTML == ""){
            let url =  "http://localhost:3000/windrow"; 
            //"http://localhost:3000/windrow";// need to change 3000 to process.env.PORT
            const message = {
                "windrowNumber": windrowNumber,
                "startW": startedToday,
                "finishW": finishedToday,
                "turnW": turnW,
                "waterW":waterW,
                "decontaminateW":decontaminateW,
                "manure":manure,
                "food": food,
                "overs":overs,
                "chipped":chipped,
                "tempM":tempM,
                "tempS":tempS
            };
            const fetchOptions = {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            };
            fetch(url, fetchOptions)
                .then(checkStatus)
                .then(function (responseText) {
                    if (emptyError()) {
                        console.log("successful post");
                        document.getElementById("nameW").value = "";
                        document.getElementById("startW").checked = false;
                        document.getElementById("finishW").checked = false;
                        document.getElementById("turnW").checked = false;
                        document.getElementById("waterW").checked = false;
                        document.getElementById("decontaminateW").checked = false;
                        document.getElementById("manure").value = "";
                        document.getElementById("food").value = "";
                        document.getElementById("overs").value = "";
                        document.getElementById("chipped").value = "";
                        document.getElementById("tempM").value = "";
                        document.getElementById("tempS").value = "";
                        addError("Successful submission!");
                    } else {
                        console.log("existing errors");
                    }
                })
                .catch(function (response) {
                    addError("Detailed trace error:");
                    addError(response);
                });
        }
    }
    function emptyError() {
        console.log(document.getElementById("error").innerHTML);
        if (document.getElementById("error").innerHTML === "") {
            return true;
        }
        return false;
    }
    function addError(error) {
        console.log("creating error");
        let errorDiv = document.createElement("div");
        errorDiv.innerHTML = error;
        console.log("error:");
        console.log(error);
        document.getElementById("error").appendChild(errorDiv);
        console.log("error div created");
    }
    function clearError() {
        console.log("clearing error");
        document.getElementById("error").innerHTML = "";
    }
        /**
     *Checks the status of a response and returns the text or the error code
     *Parameters:
        *Response: server response that contains status and text
     */
    function checkStatus(response) {
        const lowEndValid = 200;
        const highEndValid = 300;
        console.log(response.status);
        console.log(response);
        if (response.status >= lowEndValid && response.status < highEndValid) {
            return response.text();
        }
        else {
            console.log("unacceptable return");
            clearError();
            console.log(response);
            console.log("error cleared");
            addError(response.statusText);
            console.log("error added to gui");
        }
    }
})();