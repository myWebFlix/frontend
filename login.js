document.addEventListener("DOMContentLoaded", () => {

});

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    
    let id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);

    var d = new Date()
    d.setTime(d.getTime()+(365*24*60*60*1000))
    document.cookie = "user_token=" + id_token + "; expires=" + d.toGMTString();

    var xhr = new XMLHttpRequest();

    console.log("GET call");

    xhr.open('GET', 'http://localhost:8080/v1/videos', true);
    //xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('ID-Token', id_token);
    xhr.onload = function() {
        console.log('Response:\n' + xhr.responseText);
    };
    xhr.send();
}

