var regPattern = {
	"phone": /^1[0-9]{10}$/,
	"email": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

var formSource = '';
// var formSource = 'https://100steps.withcic.cn/2017_gjty/user/onSubscribedMsg/';
var statusHeight = "calc((100vh - 496px) / 2)";
var successHeight = "calc((100vh - 419px) / 2)";

if (document.referrer.indexOf(formSource) == 0) {
	$("#reserve").show();
	setVerticalAlign("#reserve");

	bindChecker("phone");
	bindChecker("email");

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
					$("body").css("margin-top", successHeight);

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
						location.href = response.redirect;
					else
						alert(response.errorMessage);
				}
			}
		).fail(function() {
			alert('表单提交失败，请联系管理员');
		});
	});
} else {
	showStatus();
}

$("#fresh").click(function () {
	$.getJSON(
		// './queueinfo.json',
		'./test_queueinfo.php',
		function(d) {
			var waiting = parseWaiting($("#position").text() - d.curPos);
			if (waiting == -1) return;

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

$("#reserve-again").click(function() {
	location.href = './user/subscribeMsg/';
});

$("#show-status").click(function() {
	$("#missed").hide();
	showStatus(true);
});

function showStatus(missed =false) {
	$.get(
		// './user/isUserInQueue/',
		'./test_isUserInQueue.php',
		function(response) {
			if (response.status == 0) {
				var d = response.data;
				if (d.isInQueue) {
					var waiting = missed ? 0 : parseWaiting(d.userPos - d.curPos);
					if (waiting == -1) return;

					$("#position").text(d.userPos);
					$("#waiting").text(waiting);
					$("#time").text(waiting * d.avgServeTime);

					$("body").css("margin-top", statusHeight);

					$("#success").hide();
					$("#position").hide();
					$("#status-title").show();
					$("#status").fadeIn(1200, function() {
						$("#position").show(1300);
					});
				} else {
					location.href = './guide.html';
				}
			} else {
				if (response.status == -1)
					location.href = response.redirect;
				else
					alert(response.errorMessage);
			}
		}
	).fail(function() {
		alert('获取状态信息失败，请联系管理员');
	});
}

function parseWaiting(w) {
	if (w <= -5) {
		$("#status").hide();
		$("#missed").fadeIn(700);
		setVerticalAlign("#missed");
		return -1;
	}
	return w > 0 ? w : 0;
}

function bindChecker(e) {
	var err = "#" + e + "-error";
	$("#" + e).change(function() {
		if (!regPattern[e].test(this.value)) {
			$(err).slideDown(700);
			$(this).on('input', function() {
				if (regPattern[e].test(this.value))
					$(err).slideUp(700);
			});
		}
	});
};

function setVerticalAlign(e) {
	$("body").css("margin-top", function() {
		return (this.scrollHeight - $(e).prop('scrollHeight')) / 2;
	});
}
