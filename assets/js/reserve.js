if (true/*document.referrer == 'source'*/) {
	$("#reserve").show();

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
					$("#waiting").text(response.data.userPos - response.data.curPos);
					$("#time").text($("#waiting").text() * response.data.avgServeTime);

					$("#reserve").hide();
					$("#position").hide();
					$("#status").fadeIn(1200, function() {
						$("#position").show(1300);
					});
				} else {
					alert(response.data.errorMessage);
				}
			}
		).fail(function() {
			alert('表单提交失败，请联系管理员');
		});
	});
} else {
	$("#status").show();
	$.get(
		'./user/isUserInQueue/',
		function(response) {
			if (response.isInQueue) {
				$("#success").hide();
				$("#status-title").show();
				
				$("#position").text(response.data.userPos);
				$("#waiting").text(response.data.userPos - response.data.curPos);
				$("#time").text($("#waiting").text() * response.data.avgServeTime);
			} else {
				window.location.href = './guide.html';
			}
		}
	).fail(function() {
		alert('获取状态信息失败，请联系管理员');
	});

}

$("#fresh").click(function () {
	$.getJSON(
		'./queueinfo.json',
		function(d) {
			var waiting = $("#position").text() - d.curPos;
			waiting = waiting > 0 ? waiting : 0;

			$("#waiting").fadeOut(300, function() {
				$("#waiting").text(waiting).fadeIn(500);
			});

			$("#time").fadeOut(300, function() {
				$("#time").text(waiting * d.avgServeTime).fadeIn(500);
			});
		}
	).fail(function() {
		alert('获取队列信息失败，请联系管理员');
	});
});
