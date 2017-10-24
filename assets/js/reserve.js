// var formSource = 'https://100steps.withcic.cn/2017_gjty/user/onSubscribed/';
var formSource = 's';
var phoneReg = /^1[0-9]{10}$/;
var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

if (document.referrer.indexOf(formSource) == 0) {
	$("#reserve").show();

	$("#phone").change(function() {
		if (!phoneReg.test(this.value)) {
			$("#phone-error").slideDown(700);
			$(this).on('input', function() {
				if (phoneReg.test(this.value))
					$("#phone-error").slideUp(700);
			});
		}
	});

	$("#email").change(function() {
		if (!emailReg.test(this.value)) {
			$("#email-error").slideDown(700);
			$(this).on('input', function() {
				if (emailReg.test(this.value))
					$("#email-error").slideUp(700);
			});
		}
	});

	$("#reserve").submit(function(e) {
		e.preventDefault();

		if (!(phoneReg.test($("#phone").val())
			&& emailReg.test($("#email").val())))
			return;

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
					if (response.status == -1)
						window.location.href = response.redirect;
					else
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
				var d = response.data;
				if (d.isInQueue) {
					var waiting = d.userPos - d.curPos;
					if (waiting <= -5) {
						alert('您已过号五个以上，请重新取号> <');
						window.location.href = './guide.html';
					}
					waiting = waiting > 0 ? waiting : 0;

					$("#success").hide();
					$("#status-title").show();

					$("#position").text(d.userPos);
					$("#waiting").text(waiting);
					$("#time").text(waiting * d.avgServeTime);

					$("#position").hide();
					$("#status").fadeIn(1200, function() {
						$("#position").show(1300);
					});
				} else {
					window.location.href = './guide.html';
				}
			} else {
				if (response.status == -1)
					window.location.href = response.redirect;
				else
					alert(response.errorMessage);
			}
		}
	).fail(function() {
		alert('获取状态信息失败，请联系管理员');
	});
}

$("#fresh").click(function () {
	$.getJSON(
		// './queueinfo.json',
		'./test_queueinfo.php',
		function(d) {
			var waiting = $("#position").text() - d.curPos;
			if (waiting <= -5) {
				alert('您已过号五个以上，请重新取号> <');
				window.location.href = './guide.html';
			}
			waiting = waiting > 0 ? waiting : 0;

			$("#waiting").fadeOut(300, function() {
				$(this).text(waiting).fadeIn(500);
			});

			$("#time").fadeOut(300, function() {
				$(this).text(waiting * d.avgServeTime).fadeIn(500);
			});
		}
	).fail(function() {
		alert('获取队列信息失败，请联系管理员');
	});
});
