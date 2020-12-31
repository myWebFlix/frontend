document.addEventListener("DOMContentLoaded", () => {
	setupAuth();

	let user_token = getCookie("user_token");

	const urlParams = new URLSearchParams(window.location.search);
	let videoId = parseInt(urlParams.get("id"));
	
	if (isNaN(videoId)) {
		//window.location.href = "index.html"
		videoId = 1;
	}

	let xhrStream = new XMLHttpRequest();
	let xhrMeta = new XMLHttpRequest();
	let xhrComm = new XMLHttpRequest();

	xhrStream.open('GET', 'http://localhost:8080/v1/streams/' + videoId, true);
	//xhrStream.open('GET', 'http://martin.zoxxnet.com/webflix/v1/streams/' + videoId, true);
	xhrStream.setRequestHeader('ID-Token', user_token);
	xhrStream.onload = () => {
		console.log('Response:\n' + xhrStream.responseText);
		
		if (xhrStream.status == 401) {
			window.location.href = 'login.html';
		} else {
			setupStream(JSON.parse(xhrStream.responseText));
		}

	};

	//xhrMeta.open('GET', 'http://localhost:8080/v1/videos/' + videoId, true);
	xhrMeta.open('GET', 'http://martin.zoxxnet.com/webflix/v1/videos/' + videoId, true);
	xhrMeta.setRequestHeader('ID-Token', user_token);
	xhrMeta.onload = () => {
		console.log('Response:\n' + xhrMeta.responseText);
		
		if (xhrMeta.status == 401) {
			window.location.href = 'login.html';
		} else {
			setupMetadata(JSON.parse(xhrMeta.responseText));
		}

	};

	xhrComm.open('GET', 'http://martin.zoxxnet.com/comments/v1/comments/' + videoId, true);
	xhrComm.setRequestHeader('ID-Token', user_token);
	xhrComm.onload = () => {
		console.log('Response:\n' + xhrComm.responseText);
		
		if (xhrComm.status == 401) {
			window.location.href = 'login.html';
		} else {
			setupComments(JSON.parse(xhrComm.responseText));
		}

	};


	xhrStream.send();
	xhrMeta.send();
	xhrComm.send();
});

function setupStream(streams) {
	const video = document.getElementById("video");
	const quality = document.getElementById("videoQuality");
	const source = document.createElement("source");

	source.setAttribute("id", "videoSource");
	source.setAttribute("src", streams[0].url);
	video.appendChild(source);
	video.load();

	for (let stream of streams) {
		console.log(stream);
		let option = document.createElement("option");
		option.value = stream.url;
		option.text = stream.quality;
		quality.appendChild(option);
	}
	quality.onchange = () => {changeQuality(video, quality, source)};
}

function changeQuality(video, quality, source) {
	source.setAttribute("src", quality.value);
	console.log(quality);
	video.load();
}

function setupMetadata(meta) {
	const title = document.getElementById("videoTitle");
	const desc = document.getElementById("videoDesc");

	title.innerText = meta.title;
	desc.innerText = meta.description;
}

function setupComments(comments) {
	const parent = document.getElementById("comments");

	for (let comment of comments) {
		const div = document.createElement("div");
		div.innerHTML = `<p>User ${comment.comment_user_id} at ${comment.comment_timestamp}</p>
		<p>${comment.comment_text}</p><hr>`;
		parent.appendChild(div);
	}
}
