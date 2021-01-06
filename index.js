const URL = "http://martin.zoxxnet.com"; // "http://rok.zoxxnet.com";

document.addEventListener("DOMContentLoaded", () => {
	setupAuth();

	getVideos();
	four();
});

function getVideos() {
	var user_token = getCookie("user_token");
	console.log(user_token)

	var xhr = new XMLHttpRequest();

	//xhr.open('GET', 'http://localhost:8080/v1/videos', true);
	xhr.open('GET', URL + '/webflix/v1/videos', true);
	xhr.setRequestHeader('ID-Token', user_token);
	xhr.onload = function() {
		console.log('Response:\n' + xhr.responseText);
		
		if (xhr.status == 401) {
			window.location.href = 'login.html';
		} else {
			generateVideoGrid(JSON.parse(xhr.responseText));
		}

	};
	xhr.send();
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

		
		html += `<div><center>
			<h1>${videos[video].title}</h1>
			<a href="watch.html?id=${videos[video].id}">
				<img class="video-stream-zac-picture" src="${slikaSrc}"/>
		  	</a>
		</center></div>`;
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
