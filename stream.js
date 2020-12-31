document.addEventListener("DOMContentLoaded", () => {
	
	const getStream = async () => {
		const res = await fetch('http://localhost:8080/v1/streams/mn43bsa9');
		const streams = await res.json();
				
		const video = document.getElementById("video");
		const source = document.createElement("source");
	
		source.setAttribute("src", streams[0].url);
		video.appendChild(source);
		video.load();
	}

	getStream();

});
