document.addEventListener("DOMContentLoaded", () => {
    
});

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    
    let id_token = googleUser.getAuthResponse().id_token;

    googleUser.disconnect()

    console.log(id_token);
    if (id_token != undefined) {

        console.log(id_token);

        var d = new Date()
        d.setTime(d.getTime()+(365*24*60*60*1000))
        document.cookie = "user_token=" + id_token + "; expires=" + d.toGMTString() + ";SameSite=Lax";

        window.location.href = 'index.html';
    }
}

