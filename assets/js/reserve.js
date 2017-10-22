if (true/*document.referrer == 'source'*/) {
	$("#reserve").hide();
	
	var status = new Vue({
		el: "#status",
		data: {
			num: 17,
			cur_num: 13,
			pre_num: 3,
			time: 15
		}
	})

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
			function(rsp) {
				if (rsp.status == 0) {
					status.num = rsp.data.userPos;
					status.cur_num = rsp.data.curPos;
					status.pre_num = rsp.data.queueLength - curPos - 1;
					status.time = status.pre_num * rsp.data.avgServeTime;
				} else {
					alert(rsp.data.errorMessage);
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
