if (window.getComputedStyle(document.body).marginTop.indexOf('-') == 0)
	document.body.style.marginTop = 0;

var request = new XMLHttpRequest();
request.onload = function() {
	var data = JSON.parse(this.response);
	if(document.getElementById('position').innerText != data.curPos)
		document.getElementById('position').innerText = data.curPos;
};

setInterval(function() {
	// request.open('GET', '../queueinfo.json');
	request.open('GET', '../test_queueinfo.php');
	request.send();
}, 5000);
