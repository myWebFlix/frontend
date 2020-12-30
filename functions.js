document.addEventListener("DOMContentLoaded", () => {
    getVideos();
    four();
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

    //xhr.open('GET', 'http://localhost:8080/v1/videos', true);
    xhr.open('GET', 'http://martin.zoxxnet.com/webflix/v1/videos', true);
    xhr.setRequestHeader('ID-Token', user_token);
    xhr.onload = function() {
        console.log('Response:\n' + xhr.responseText);
        
        if (xhr.status == 401) {
            window.location.href = 'loginPage.html';
        } else {
            generateVideoGrid(JSON.parse(xhr.responseText));
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

// Get the elements with class="column"
var elements = document.getElementsByClassName("column");

// Declare a loop variable
var i;

function generateVideoGrid(videos) {
    var columnSeparator = Math.floor(videos.length / 3) + 1;
    console.log(columnSeparator);

    var html = '<div class="column">';
    var slikaSrc = "/assets/video-sablona.jpg";
    var stevecInColumn = 0.0;
    var skupniStevec = 0;

    for (video in videos) {
        console.log(videos[video].title)
        if (skupniStevec % 2 == 0) {
            slikaSrc = "/assets/video-sablona.jpg";
        } else {
            slikaSrc = "/assets/video-sablona2.webp";
        }

        html += '<div><center><h1>#{title}</h1><img class="video-stream-zac-picture" src="#{slikaSrc}"/></div>'.replace("#{title}", videos[video].title).replace("#{slikaSrc}", slikaSrc);
        stevecInColumn += 1.0;
        skupniStevec += 1;

        if (stevecInColumn >= columnSeparator && skupniStevec != (videos.length)) {
            console.log("je")
            stevecInColumn = 0.0;
            html += '</div>';
            html += '<div class="column">';
        }

        //console.log(html)
    }

    html += '</div>';

    console.log(html)
    document.getElementById('videoGrid').innerHTML = html
}

// Full-width images
function one() {
    for (i = 0; i < elements.length; i++) {
    elements[i].style.msFlex = "100%";  // IE10
    elements[i].style.flex = "100%";
  }
}

// Two images side by side
function two() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.msFlex = "50%";  // IE10
    elements[i].style.flex = "50%";
  }
}

// Four images side by side
function four() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.msFlex = "25%";  // IE10
    elements[i].style.flex = "25%";
  }
}

// Add active class to the current button (highlight it)
var header = document.getElementById("myHeader");
var btns = header.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

