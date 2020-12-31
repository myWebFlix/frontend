document.addEventListener("DOMContentLoaded", () => {

});


function upload() {
	//const url = "http://34.107.92.162/video-upload/v1/upload";
	const url = "http://localhost:8080/v1/upload";

	var oReq = new XMLHttpRequest();
	oReq.open("POST", url, true);
	oReq.onload = function (oEvent) {
		console.log("Uploaded.");
	};

	//var blob = new Blob(['abc123'], {type: 'text/plain'});
	let file = document.getElementById("upload").files[0];

	let title = document.getElementById("title").value;
	let desc = document.getElementById("description").value;

	oReq.setRequestHeader("Content-Type", "application/octet-stream")
	oReq.setRequestHeader("Video-Title", title)
	oReq.setRequestHeader("Video-Description", desc)
	oReq.setRequestHeader("Video-Name", file.name)

	oReq.send(file);

}
