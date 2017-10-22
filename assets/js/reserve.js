if (true/*document.referrer == 'source'*/) {
	$("#position").text(17);
	$("#waiting").text(3);
	$("#time").text(15);

	$("#status").hide();

	$("#reserve").submit(function(e) {
		e.preventDefault();

		data = {};
		$.each(
			$(this).serializeArray(),
			function(i, v) { data[v.name] = v.value; }
		);

		$.post(
			'./user/register/',
			JSON.stringify(data),
			function(response) {
				if (response.status == 0) {
					$("#position").text(response.data.userPos);
					$("#waiting").text(response.data.queueLength - curPos - 1);
					$("#time").text(status.pre_num * response.data.avgServeTime);
				} else {
					alert(response.data.errorMessage);
				}
			}
		)

		.fail(function() {
			alert('操作出错，请联系管理员');
		});
	});
} else {
	window.location.href = './user/subscribeMsg/';
}
