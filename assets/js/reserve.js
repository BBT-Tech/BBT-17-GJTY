var formSource = 'https://100steps.withcic.cn/2017_gjty/user/onSubscribedMsg/';
var wechatSource = 'https://mp.weixin.qq.com/mp/subscribemsg';

var regPattern = {
		"phone": /^1[0-9]{10}$/,
		"email": /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,}(\.[a-z]{2,})*)$/
	};

var statusHeight = "calc((100vh - 488px) / 2)";
var successHeight = "calc((100vh - 411px) / 2)";

if (document.referrer.indexOf(wechatSource) == 0
	|| document.referrer.indexOf(formSource) == 0) {
	$("#reserve").show();
	setVerticalAlign("#reserve");

	bindChecker("phone");
	bindChecker("email");

	$("#reserve").submit(function(e) {
		e.preventDefault();

		if (!(regPattern.phone.test($("#phone").val())
			&& regPattern.email.test($("#email").val())))
			return;

		var data = {};
		$.each(
			$(this).serializeArray(),
			function(i, v) { data[v.name] = v.value; }
		);

		$.post(
			paths.user.register,
			JSON.stringify(data),
			function(response) {
				if (response.status == 0) {
					$("body").css("margin-top", successHeight);

					var waiting = response.data.userPos - response.data.curPos;
					$("#during-content").hide();
					$("#waiting").text(waiting);
					$("#time").text(waiting * response.data.avgServeTime);

					$("#position").text(response.data.userPos);
					$("#position").hide();
					$("#reserve").hide();

					$("#status").fadeIn(1200, function() {
						$("#position").show(1300);
					});
				} else {
					if (response.status == -1) location.href = response.redirect;
					else alert(response.errorMessage);
				}
			}
		).fail(function() {
			alert('表单提交失败，请联系管理员');
		});
	});
} else {
	$.get(
		paths.user.isInQueue,
		function(response) {
			if (response.status == 0) {
				var d = response.data;
				if (!d.isInQueue || (d.isRegisterAble == -1))
					location.href = './guide.html';

				var waiting = parseWaiting(d.userPos - d.curPos);
				switch(waiting) {
					case -1:
						return;

					case 0:
						$("#waiting-content").hide();
						$("#position").text(d.userPos);
						break;

					default:
						$("#during-content").hide();
						$("#position").text(d.userPos);
						$("#waiting").text(waiting);
						$("#time").text(waiting * d.avgServeTime);
						break;
				}

				$("body").css("margin-top", statusHeight);
				if (waiting == 0) $("body").css("margin-top", "+=2em");

				$("#success").hide();
				$("#position").hide();
				$("#status-title").show();
				$("#status").fadeIn(1200, function() {
					$("#position").show(1300);
				});
			} else {
				if (response.status == -1) location.href = response.redirect;
				else alert(response.errorMessage);
			}
		}
	).fail(function() {
		alert('获取状态信息失败，请联系管理员');
	});
}

$("#fresh").click(function () {
	$.getJSON(
		paths.user.queueInfo,
		function(d) {
			var waiting = parseWaiting($("#position").text() - d.curPos);
			switch(waiting) {
				case -1:
					return;

				case 0:
					$("#waiting-content").fadeOut(700, function() {
						$("#during-content").fadeIn(1000, function() {
							$("body").animate({marginTop: "+=2em"}, 900);
						});
					});
					break;

				default:
					$("#waiting").fadeOut(300, function() {
						$(this).text(waiting).fadeIn(500);
					});

					$("#time").fadeOut(300, function() {
						$(this).text(waiting * d.avgServeTime).fadeIn(500);
					});
					break;
			}
		}
	).fail(function() {
		alert('获取队列信息失败，请联系管理员');
	});
});

function parseWaiting(w) {
	if (w < -5) {
		$("#status").hide();
		$("#missed").fadeIn(700);
		setVerticalAlign("#missed");
		$("#reserve-again").click(function() {
			location.href = './guide.html';
		});
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
