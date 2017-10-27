var request = new XMLHttpRequest();
request.onload = function() {
	var data = JSON.parse(this.response);
	document.getElementById('position').innerText = data.curPos;
};

setInterval(function() {
	// request.open('GET', '../queueinfo.json');
	request.open('GET', '../test_queueinfo.php');
	request.send();
}, 5000);
