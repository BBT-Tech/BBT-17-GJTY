// var formSource = 'https://100steps.withcic.cn/2017_gjty/user/onSubscribed/';
var formSource = '';
var phoneReg = /^1[0-9]{10}$/;
var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

if (document.referrer.indexOf(formSource) == 0) {
	$("#reserve").show();

	$("#phone").mouseout(function() {
		if (phoneReg.test($("#phone").val()))
			$("#phone-error").slideUp(700);
		else
			$("#phone-error").slideDown(700);
	});

	$("#email").mouseout(function() {
		if (emailReg.test($("#email").val()))
			$("#email-error").slideUp(700);
		else
			$("#email-error").slideDown(700);
	});

	$("#reserve").submit(function(e) {
		e.preventDefault();

		var data = {};
		$.each(
			$(this).serializeArray(),
			function(i, v) { data[v.name] = v.value; }
		);

		$.post(
			// './user/register/',
			'./test_register.php',
			JSON.stringify(data),
			function(response) {
				if (response.status == 0) {
					$("#status").addClass("success-status");

					$("#position").text(response.data.userPos);
					$("#waiting").text(response.data.userPos - response.data.curPos);
					$("#time").text($("#waiting").text() * response.data.avgServeTime);

					$("#reserve").hide();
					$("#position").hide();
					$("#status").fadeIn(1200, function() {
						$("#position").show(1300);
					});
				} else {
					alert(response.errorMessage);
				}
			}
		).fail(function() {
			alert('表单提交失败，请联系管理员');
		});
	});
} else {
	$.get(
		// './user/isUserInQueue/',
		'./test_isUserInQueue.php',
		function(response) {
			if (response.status == 0) {
				if (response.data.isInQueue) {
					$("#success").hide();
					$("#status-title").show();

					$("#position").text(response.data.userPos);
					$("#waiting").text(response.data.userPos - response.data.curPos);
					$("#time").text($("#waiting").text() * response.data.avgServeTime);

					$("#position").hide();
					$("#status").fadeIn(1200, function() {
						$("#position").show(1300);
					});
				} else {
					window.location.href = './guide.html';
				}
			} else {
				alert(response.errorMessage);
			}
		}
	).fail(function() {
		alert('获取状态信息失败，请联系管理员');
	});

	$("#fresh").click(function () {
		$.getJSON(
			// './queueinfo.json',
			'./test_queueinfo.php',
			function(d) {
				var waiting = $("#position").text() - d.curPos;
				waiting = waiting > 0 ? waiting : 0;
				if (waiting <= -5) {
					alert('您已过号五个，请重新取号><');
					window.location.href = './guide.html';
				}

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
}
