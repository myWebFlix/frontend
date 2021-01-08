const URL = "http://rok.zoxxnet.com";

let user_token = null;
let video_id = null;

document.addEventListener("DOMContentLoaded", () => {
	setupAuth();

	user_token = getCookie("user_token");

	const urlParams = new URLSearchParams(window.location.search);
	video_id = parseInt(urlParams.get("id"));
	
	if (isNaN(video_id)) {
		window.location.href = "index.html"
	}

	getComments(0);
	setupRating();

	let xhrStream = new XMLHttpRequest();
	let xhrMeta = new XMLHttpRequest();

	// Get stream
	
	//xhrStream.open('GET', 'http://localhost:8080/v1/streams/' + video_id, true);
	xhrStream.open('GET', URL + '/video-stream/v1/streams/' + video_id, true);
	xhrStream.setRequestHeader('ID-Token', user_token);
	xhrStream.onload = () => {
		console.log('Response:\n' + xhrStream.responseText);
		
		if (xhrStream.status == 200) {
			setupStream(JSON.parse(xhrStream.responseText));
		} else if (xhrStream.status == 401) {
			window.location.href = 'login.html';
		}

	};

	// Get metadata

	//xhrMeta.open('GET', 'http://localhost:8080/v1/videos/' + video_id, true);
	xhrMeta.open('GET', URL + '/webflix/v1/videos/' + video_id, true);
	xhrMeta.setRequestHeader('ID-Token', user_token);
	xhrMeta.onload = () => {
		console.log('Response:\n' + xhrMeta.responseText);
		
		if (xhrMeta.status == 200) {
			setupMetadata(JSON.parse(xhrMeta.responseText));
		} else if (xhrMeta.status == 401) {
			window.location.href = 'login.html';
		}

	};


	xhrStream.send();
	xhrMeta.send();
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

const COMMENTS = {
	max: 5,
	page: 0,
	pages: 1,
	loading: false
}

function getComments(page) {
	if (COMMENTS.loading)
		return;
	COMMENTS.loading = true;

	let query = `{
		allComments(video_id: ${video_id}, pagination: {offset: ${page * COMMENTS.max}, limit: ${COMMENTS.max}}) {
			result {
				user_name 
				timestamp 
				text
			}
			pagination {
				offset 
				limit 
				total
			}
		}
	}`;

	query = query.replace(/\s+/g, ' '); // Minify query
	
	let xhr = new XMLHttpRequest();
	xhr.open('POST', URL + '/comments/graphql', true);
	xhr.setRequestHeader('ID-Token', user_token);
	xhr.setRequestHeader('Content-Type', 'application/graphql');
	xhr.onload = () => {
		console.log('Response:\n' + xhr.responseText);

		if (xhr.status == 200) {
			setupComments(JSON.parse(xhr.responseText));
		} else if (xhr.status == 401) {
			window.location.href = 'login.html';
		}

		COMMENTS.loading = false;
	};

	xhr.send(query);
}

function commentsNext() {
	if (COMMENTS.page + 1 < COMMENTS.pages)
		getComments(COMMENTS.page + 1);
}

function commentsPrev() {
	if (COMMENTS.page > 0)
		getComments(COMMENTS.page - 1)
}

function setupComments(json) {
	const parent = document.getElementById("comments");
	parent.innerHTML = "";

	console.log(json);

	// Pagination

	let pag = json.data.allComments.pagination;
	COMMENTS.pages = Math.ceil(pag.total / COMMENTS.max);
	COMMENTS.page = Math.trunc(pag.offset / COMMENTS.max);
	document.getElementById("commentsPageMax").innerHTML = COMMENTS.pages;
	document.getElementById("commentsPage").innerHTML = COMMENTS.page + 1;

	// Comments

	let comments = json.data.allComments.result;
	let counter = pag.offset;
	for (let comment of comments) {

		let date = new Date(comment.timestamp);
		let hours = date.getHours().toString().padStart(2, '0');
		let	minutes = date.getMinutes().toString().padStart(2, '0');
		let dateString = `${hours}:${minutes}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

		const div = document.createElement("div");

		const p_info = document.createElement("p");
		p_info.textContent = `(#${++counter}) User ${comment.user_name} at ${dateString}`;

		const p_text = document.createElement("p");
		p_text.textContent = `${comment.text}`

		div.appendChild(p_info);
		div.appendChild(p_text);
		div.appendChild(document.createElement("hr")); // Temporary

		// div.innerHTML = `<p>User ${comment.comment_user_id} at ${dateString}</p>
		// 	<p>${comment.comment_text}</p><hr>`;

		parent.appendChild(div);
	}

}

// Global variable for storing state
const RATING = {
	current: null,
	stars: []
};

function setupRating() {
	for (let i = 1; i <= 5; ++i) {
		let star = document.getElementById("rating" + i);
		RATING.stars.push(star);
		star.addEventListener("click", () => postRating(i, video_id));
	}

	let xhr = new XMLHttpRequest();
	xhr.open('GET', URL + '/ratings/v1/ratings/' + video_id, true);
	xhr.setRequestHeader('ID-Token', user_token);
	xhr.onload = () => {
		if (xhr.status == 200) {
			let json = JSON.parse(xhr.responseText);
			setRating(json.rating);
		}
	};

	xhr.send();
}

// Send rating POST request
function postRating(rating) {
	let xhr = new XMLHttpRequest();
	xhr.open('POST', URL + '/ratings/v1/ratings/' + video_id, true);
	xhr.setRequestHeader('ID-Token', user_token);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = () => {
		if (xhr.status == 200) {
			let json = JSON.parse(xhr.responseText);
			setRating(json.rating);
		}
	};

	let body = { rating: rating };
	xhr.send(JSON.stringify(body));
}

// Set rating UI
function setRating(rating) {
	if (rating !== RATING.current) {
		for (let i = 0; i < 5; ++i) {
			if (i < rating)
				RATING.stars[i].classList.add("active");
			else
				RATING.stars[i].classList.remove("active");
		}
		RATING.current = rating;
	}
}

function submitComment() {
	const commentInput = document.getElementById("commentInput");
	const commentStatus = document.getElementById("commentStatus");

	let text = commentInput.value;
	commentInput.value = "";
	
	text = text.trim();
	if (text.length > 0) {
		
		commentStatus.innerHTML = "Submitting comment ..."

		let xhr = new XMLHttpRequest();
		xhr.open('POST', URL + '/comments/v1/comments/' + video_id, true);
		xhr.setRequestHeader('ID-Token', user_token);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = () => {
			if (xhr.status == 200) {
				commentStatus.innerHTML = "Comment submitted succesfully!";
			} else {
				commentStatus.innerHTML = "Error submitting comment!";
			}
		};

		let body = { comment_text: text };
		xhr.send(JSON.stringify(body));
	}
}
