var request = new XMLHttpRequest();
request.onload = function() {
	var data = JSON.parse(this.response);
	var e = document.getElementById("position");

	if(e.innerText != data.curPos) {
		e.classList.add("fade");
		setTimeout(function() {
			e.innerText = data.curPos;
			e.classList.remove("fade");
		}, 1000);
	}
};

setInterval(function() {
	// request.open('GET', '../queueinfo.json');
	request.open('GET', '../test_queueinfo.php');
	request.send();
}, 5000);
