function setVerticalAlign(e) {
	divBase = e == "#closed" ? 3 : 2;

	$(e).show();
	$("body").css("margin-top", function() {
		return (this.scrollHeight - $("#guide").prop('scrollHeight')) / divBase;
	});
}

$.get(
	// './user/isUserInQueue/',
	'./test_isUserInQueue.php',
	function(re) {
		if (re.status == 0 || re.status == -1) {
			regStatus = (re.status == -1 ? 0 : re.data.isRegisterAble);

			if (!re.data.isInQueue) {
				switch(regStatus) {
					case 0:
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
								function(r) {
									if (r.data.isRegisterAble == 0)
										location.href = './guide.html';
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
				location.href = './index.html';
			}
		} else {
			alert(re.errorMessage);
		}
	}
).fail(function() {
	alert('获取状态信息失败，请联系管理员');
});
