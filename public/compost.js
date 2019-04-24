/*
Edward Brunton
Joyce Wang
CSC 337 001

Processes the buttons for the web form, ccwebform.html. Submits windrow information
and a POST request to windrow.csv. Processes click to display compostSummary.html
*/
"use strict";
(function () {
    /**
     * Enables the click buttons after the html loads
     */
    window.onload = function () {
        document.getElementById("addW").onclick = submitWindrow;
        document.getElementById("viewAll").onclick = displayInfo;
        console.log("loaded next page");
    }

    /**
    * Displays the summary page on click.
    */
    function displayInfo() {
        window.location.href = "compostSummary.html";
    }

    /**
    * Takes the data in the form fields and submits post request, after checking
    for valid data types. Logs errors on the page if necessary.
    */
    function submitWindrow() {
        clearError();
        let date = document.getElementById("date").value;
        let windrowNumber = document.getElementById("nameW").value;
        let startedToday = document.getElementById("startW").checked;
        let finishedToday = document.getElementById("finishW").checked;
        let turnW = 0;
        let waterW = 0;
        let decontaminateW = 0;
        if (document.getElementById("turnW").checked == "TRUE") {
            console.log("out");
            turnW = 1;
        }
        else {
            turnW = 0;
        }
        if (document.getElementById("waterW").checked) {
            waterW = 1;
        }
        else {
            waterW = 0;
        }
        if (document.getElementById("decontaminateW").checked) {
            decontaminateW = 1;
        }
        else {
            decontaminateW = 0;
        }
        let manure = document.getElementById("manure").value;
        let food = document.getElementById("food").value;
        let overs = document.getElementById("overs").value;
        let chipped = document.getElementById("chipped").value;
        let tempM = document.getElementById("tempM").value;
        let tempS = document.getElementById("tempS").value;
        if (!manure.match(/\d/)) {
            addError("Manure added must be a valid number");
        }
        if (!food.match(/\d/)) {
            addError("Food Waste Added must be a valid number");
        }
        if (!overs.match(/\d/)) {
            addError("Overs Added must be a valid number");
        }
        if (!chipped.match(/\d/)) {
            addError("Chipped Material Added must be a valid number");
        }
        if (!tempM.match(/\d/)) {
            addError("Temperature Middle must be a valid number");
        }
        if (!tempS.match(/\d/)) {
            addError("Temperature South must be a valid number");
        }
        if (document.getElementById("error").innerHTML == "") {
            let url = "http://localhost:3000/windrow";
            //"http://localhost:3000/windrow";// need to change 3000 to process.env.PORT
            const message = {
                "date": date,
                "windrowNumber": windrowNumber,
                "startW": startedToday,
                "finishW": finishedToday,
                "turnW": turnW,
                "waterW": waterW,
                "decontaminateW": decontaminateW,
                "manure": manure,
                "food": food,
                "overs": overs,
                "chipped": chipped,
                "tempM": tempM,
                "tempS": tempS
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
                        document.getElementById("viewAll").display = "block";
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
    /**
     * Checks if the error div is empty
     */
    function emptyError() {
        if (document.getElementById("error").innerHTML === "") {
            return true;
        }
        return false;
    }
    /**
     * Adds an error message to the error div
     * @param {Error string} error 
     */
    function addError(error) {
        let errorDiv = document.createElement("div");
        errorDiv.innerHTML = error;
        document.getElementById("error").appendChild(errorDiv);
    }
    /**
     * Removes all errors from error div
     */
    function clearError() {
        document.getElementById("error").innerHTML = "";
    }
/**
 * Checks server message for errors
 * @param {response from server} response 
 */
    function checkStatus(response) {
        const lowEndValid = 200;
        const highEndValid = 300;
        if (response.status >= lowEndValid && response.status < highEndValid) {
            return response.text();
        }
        else {
            clearError();
            addError(response.statusText);
        }
    }
})();
