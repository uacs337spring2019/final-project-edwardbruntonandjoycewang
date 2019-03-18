/*
Edward Brunton
CSC 337 001
*/
"use strict";
(function () {
    /**
     * Enables the click buttons after the html loads
     */
    window.onload = function () {
        document.getElementById("login").onclick = login;
        document.getElementById("createNewAccount").onclick = newAccount;
        document.getElementById("newAccount").onclick = switchToNewAccount;
        document.getElementById("existingAccount").onclick = switchToExistingAccount;
        document.getElementById("newAccountFieldSet").style.display = 'none';
        console.log("loaded");
    };
    function switchToNewAccount() {
        console.log("Switch to new account");
        document.getElementById("existingAccountFieldSet").style.display = 'none';
        document.getElementById("newAccountFieldSet").style.display = 'block';
    }
    function switchToExistingAccount() {
        console.log("Switch to existing account");
        document.getElementById("existingAccountFieldSet").style.display = 'block';
        document.getElementById("newAccountFieldSet").style.display = 'none';
    }
    function login() {

        console.log("Login button click");
    }
    function clearError() {
        document.getElementById("error").innerHTML = "";
    }
    function addError(error) {
        let errorDiv = document.createElement("div");
        errorDiv.innerHTML = error;
        document.getElementById("error").appendChild(errorDiv);
    }
    function newAccount() {
        clearError();
        let password = document.getElementById("passwordAccount").value;
        let cPassword = document.getElementById("confirmPasswordAccount").value;
        let name = document.getElementById("fullNameAccount").value.trim();
        let email = document.getElementById("emailAccount").value;
        let validItems = true;
        if (password !== cPassword) {
            addError("Passwords must match");
            validItems = false;
        }
        if (password.length < 8) {
            addError("Password must be at least 8 characters long");
            validItems = false;
        }
        if (password.toUpperCase() === password || password.toLowerCase() === password) {
            addError("Password must contain a mix of upper and lower case");
            validItems = false;
        }
        if (password.indexOf(" ") !== -1) {
            addError("Password must not have a space");
            validItems = false;
        }
        let a = parseInt(password, 10);
        console.log(a);
        if (!/\d/.test(password)) {
            addError("Password must contain a number");
            validItems = false;
        }
        if (name.indexOf(" ") === -1 || name.length < 3) {
            addError("Must have a first and a last name");
            validItems = false;
        }
        if (!
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            addError("Email must have proper form");
            validItems = false;
        }
        if (validItems) {
            let url = "http://localhost:3000/register";
            const message = {
                email: email,
                fillName: name,
                password: password
            };
            const fetchOptions = {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            };
            fetch(url, fetchOptions)
                .then(checkStatus)
                .then(function (responseText) {
                    loadFunction();
                })
                .catch(function (responseText){
                    clearError();
                    addError(response.statusText);
                });
        }
    }
    /**
     *Checks the status of a response and returns the text or the error code
     *Parameters:
        *Response: server response that contains status and text
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