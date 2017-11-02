var request = new XMLHttpRequest();
request.onload = function() {
	var data = JSON.parse(this.response);
	var e = document.getElementById("position");

	if(e.innerText != data.curPos) {
		e.classList.add("fresh");
		setTimeout(function() {
			e.innerText = data.curPos;
			e.classList.remove("fresh");
		}, 1000);
	}
};

setInterval(function() {
	request.open('GET', (paths.admin.queueInfo + new Date()));
	request.send();
}, 3000);
