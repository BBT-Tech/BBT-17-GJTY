$.get(
	paths.user.isInQueue,
	function(r) {
		if (r.status == 0) {
			regStatus = r.data.isRegisterAble;

			switch(regStatus) {
				case 0:
					if (r.data.isInQueue && (r.data.curPos - r.data.userPos <= 5))
						location.href = './index.html';

					setVerticalAlign("#welcome");
					$("#auth").click(function() {
						location.href = './user/subscribeMsg/';
					});
					break;

				case 1:
					setVerticalAlign("#pending");
					$("#fresh").click(function() {
						$.get(
							paths.user.isInQueue,
							function(re) {
								if (re.data.isRegisterAble == 0)
									location.reload();
								else
									$("#pending-info").fadeOut(300, function() {
										$(this).fadeIn(500);
									});
							}
						).fail(function() {
							alert('获取状态信息失败，请联系管理员');
						})
					});
					break;

				case -1:
					if (!r.data.isInQueue) $("#show-pos").hide();
					setVerticalAlign("#closed");

					$("#show-pos").click(function() {
							$("#position").text(r.data.userPos);

							$("#epilogue").fadeOut(1000);
							$("#closed-info").fadeOut(1000);
							$("#show-pos").fadeOut(1000, function() {
								$("#epilogue").fadeIn(1000);
								$("#closed-pos").fadeIn(1000);
							});
					});
					break;
			}
		} else {
			if (r.status == -1) location.href = r.redirect;
			else alert(r.errorMessage);
		}
	}
).fail(function() {
	alert('获取状态信息失败，请联系管理员');
});

function setVerticalAlign(e) {
	divBase = e == "#welcome" ? 2 : 3;

	$(e).show();
	$("body").css("margin-top", function() {
		return (this.scrollHeight - $("#guide").prop('scrollHeight')) / divBase;
	});
}
