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
    
    var username = document.getElementById("txt_username").value;
    var password = document.getElementById("txt_password").value;
    var name = document.getElementById("txt_name").value;
    var gender = "male";
    if(document.getElementById("radio_female").checked){
        gender="female"
    }
    
    var status = 1;
    if(username == ''){
        document.getElementById("txt_username").style.borderColor="red";
        status = 0;
    }
    else{
        document.getElementById("txt_username").style.borderColor="grey";
        status = 1;
    }

    if(password == ''){
        document.getElementById("txt_password").style.borderColor="red";
        status = 0;
    }
    else{
        document.getElementById("txt_password").style.borderColor="grey";
        status = 1;
    }

    if(name == ''){
        document.getElementById("txt_name").style.borderColor="red";
        status = 0;
    }
    else{
        document.getElementById("txt_name").style.borderColor="grey";
        status = 1;
    }

    if(status == 0){
        return false;
    }
    let db = request.result;
    let transaction = db.transaction("users", "readwrite"); // (1)
    
    // get an object store to operate on it
    let users = transaction.objectStore("users"); // (2)

    let user = {
    username: username,
    pasword: password,
    fullname: name,
    gender: gender
    };
    let reg = users.add(user); // (3)

    reg.onsuccess = function() { // (4)
        console.log("User registered", reg.result);
        localStorage.setItem("loggedUser", username)
        window.location.href = "platform.html";
    };

    reg.onerror = function() {
        console.log("Error", reg.error);
    };
}


function login(){
    
    var username = document.getElementById("txt_login_username").value;
    var password = document.getElementById("txt_login_password").value;

    var status = 1;
    if(username == ''){
        document.getElementById("txt_login_username").style.borderColor="red";
        status = 0;
    }
    else{
        document.getElementById("txt_login_username").style.borderColor="grey";
        status = 1;
    }

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

    let db = request.result;
    let transaction = db.transaction("users"); // (1)
    let users = transaction.objectStore("users"); // (2)
    check =users.get(username);
    check.onsuccess = function(){
        if(check.result){
            if(check.result.pasword == password){
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
    }
}