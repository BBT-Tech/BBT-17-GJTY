$.get(
	// './user/isUserInQueue/',
	'./test_isUserInQueue.php',
	function(r) {
		if (r.status == 0 || r.status == -1) {
			switch(r.data.isRegisterAble) {
				case 0:
					if ((typeof r.data.isInQueue != 'undefined')
						&& (r.data.curPos - r.data.userPos <= 5))
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
							// './user/isUserInQueue/',
							'./test_isUserInQueue.php',
							function(re) {
								if (re.data.isRegisterAble == 0)
									location.reload();
								else
									$("#pending-info").fadeOut(300, function() {
										$(this).fadeIn(500);
									});
							}
						)
					});
					break;

				case -1:
					setVerticalAlign("#closed");
					break;
			}
		} else {
			alert(r.errorMessage);
		}
	}
).fail(function() {
	alert('获取状态信息失败，请联系管理员');
});

function setVerticalAlign(e) {
	divBase = e == "#closed" ? 3 : 2;

	$(e).show();
	$("body").css("margin-top", function() {
		return (this.scrollHeight - $("#guide").prop('scrollHeight')) / divBase;
	});
}
