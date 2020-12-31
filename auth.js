function setupAuth() {
	gapi.load('auth2', function() {
		gapi.auth2.init();
	});
}

function getCookie(cname) {
	var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (let c of ca) {
		c = c.trim();
		if (c.indexOf(name) === 0)
			return c.substring(name.length, c.length);
	}
	return "";
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        eraseCookie("user_token");
        console.log('User signed out.');

        window.location.href = 'login.html';
    });
    auth2.disconnect();
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}
