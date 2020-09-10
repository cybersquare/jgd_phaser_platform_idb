let request = indexedDB.open("phaser_db", 1);

request.onupgradeneeded = function() {
    let db = request.result;
    if (!db.objectStoreNames.contains('users')) { // if there's no "users" store
        db.createObjectStore('users', {keyPath: 'username'}); // create it
        alert('db created');
    }
};

request.onerror = function() {
    console.error("Error", request.error);
};

// request.onsuccess = function() {
// let db = request.result;
// // continue to work with database using db object
// };

function register(){
    // Get data from the form
    var username = document.getElementById("txt_username").value;
    var password = document.getElementById("txt_password").value;
    var name = document.getElementById("txt_name").value;
    var gender = "male";
    if(document.getElementById("radio_female").checked){
        gender="female"
    }
    
    var status = 1;
    // Check whether the user has entered the username.
    if(username == ''){
        document.getElementById("txt_username").style.borderColor="red";
        status = 0;
    }
    else{
        document.getElementById("txt_username").style.borderColor="grey";
        status = 1;
    }

    // Check whether the user has password username.
    if(password == ''){
        document.getElementById("txt_password").style.borderColor="red";
        status = 0;
    }
    else{
        document.getElementById("txt_password").style.borderColor="grey";
        status = 1;
    }
    // Check whether the user has entered his/her name.
    if(name == ''){
        document.getElementById("txt_name").style.borderColor="red";
        status = 0;
    }
    else{
        document.getElementById("txt_name").style.borderColor="grey";
        status = 1;
    }

    // Stop the program if any of the detail is not entered.
    if(status == 0){
        return false;
    }
    // request is the object returned by indexedDB.open()
    let db = request.result; 
    // create an object of transaction. Parameters are name of stores and mode of operation
    let transaction = db.transaction("users", "readwrite"); 
    // Get an object store to operate on it
    let users = transaction.objectStore("users"); 
    //data
    let user = {
    username: username,
    password: password,
    fullname: name,
    gender: gender
    };
    // Insert data
    let reg = users.add(user);
    //Call back
    reg.onsuccess = function() {
        console.log("User registered", reg.result);
        localStorage.setItem("loggedUser", username)
        window.location.href = "platform.html";
    };

    reg.onerror = function() {
        console.log("Error", reg.error);
    };
}


function login(){
    // Get details from the form
    var username = document.getElementById("txt_login_username").value;
    var password = document.getElementById("txt_login_password").value;

    var status = 1;
    // Check whether the user has entered username
    if(username == ''){
        document.getElementById("txt_login_username").style.borderColor="red";
        status = 0;
    }
    else{
        document.getElementById("txt_login_username").style.borderColor="grey";
        status = 1;
    }
    // Check whether the user has entered username
    if(password == ''){
        document.getElementById("txt_login_password").style.borderColor="red";
        status = 0;
    }
    else{
        document.getElementById("txt_login_password").style.borderColor="grey";
        status = 1;
    }

    if(status == 0){
        return false;
    }

    // request is the object returned by indexedDB.open()
    let db = request.result;
    // create an object of transaction. Parameters are name of stores and mode of operation
    let transaction = db.transaction("users"); 
    // Get an object store to operate on it
    let users = transaction.objectStore("users"); 
    // Get record from store
    check =users.get(username);
    // Call back
    check.onsuccess = function(){
        // Logic for processing the record an update HTML page goes here.
        if(check.result){
            if(check.result.password == password){
                localStorage.setItem("loggedUser", username);
                window.location.href="platform.html"
            }
            else{
                alert("Wrong password");
            }
        }
        else{
            alert("Invalid user");
        }
    };
    check.onerror = function(){
        console.log("Error")
    }
}

