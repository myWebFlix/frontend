document.addEventListener("DOMContentLoaded", () => {
    getVideos();
});

function onLoad() {
    gapi.load('auth2', function() {
      gapi.auth2.init();
    });
  }

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

function getVideos() {
    var user_token = getCookie("user_token");
    console.log(user_token)

    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:8080/v1/videos', true);
    //xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('ID-Token', user_token);
    xhr.onload = function() {
        console.log('Response:\n' + xhr.responseText);
        
        if (xhr.status == 401) {
            window.location.href = 'loginPage.html';
        }

    };
    xhr.send();
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        eraseCookie("user_token");
        console.log('User signed out.');

        window.location.href = 'loginPage.html';
    });
    auth2.disconnect();
}

