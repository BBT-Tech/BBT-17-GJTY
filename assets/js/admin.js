$("#call-next").click(function() {
	//Todo
});

$("#open-screen").click(function() {
	window.open('./screen.html');
});

$("#show-all-info").click(function() {
	$("#all-info").show();
});

$("#hide-all-info").click(function() {
	$("#all-info").hide();
});

$("#start-system").click(function() {
	$.post(
		'../admin/setIsRegisterAble/',
		'{"status": 0}',
		function(response) {
			//Todo
		}
	).fail(function() {
		errorAlert('操作失败，请联系管理员');
	});
});

$("#close-system").click(function() {
	$.post(
		'../admin/setIsRegisterAble/',
		'{"status": -1}',
		function(response) {
			//Todo
		}
	).fail(function() {
		errorAlert('操作失败，请联系管理员');
	});
});

$("#login-btn").click(function() {
	$.post(
		// '../admin/checkLogin/',
		'../test_log.php',
		'{"userName": "' + $("#username").val() +
		'","passWord": "' + $("#password").val() + '"}',
		function(response) {
			if (response.status == 0) {
				location.reload();
			} else {
				errorAlert(response.errorMessage);
			}
		}
	).fail(function() {
		errorAlert('操作失败，请联系管理员');
	});
});

$("#logout").click(function() {
	$.post(
		// '../admin/logOut/',
		'../test_log.php',
		'',
		function(response) {
			if (response.status == 0) {
				confirmOperation(
					'<p class="confirm-info-oneline">确定要退出系统吗？</p>',
					function() {
						errorAlert('退出系统成功！', false);
						$('#error-alert').on('hide.bs.modal', function () {
							$("#information").fadeOut(700);
							$("#all-info").fadeOut(700);

							$(".buttons").fadeOut(700, function() {
								$(".buttons").css("padding-top", "calc(100vh - 11em)");
								$(".buttons").fadeIn(500, function() {
									setTimeout(function() {
										$("#login").modal('show');
									}, 500);
								});
							});
						});
					}
				);
			} else {
				errorAlert(response.errorMessage);
			}
		}
	).fail(function() {
		errorAlert('操作失败，请联系管理员');
	});
});

function confirmOperation(msg, func) {
	$("#progress").hide();
	$("#confirm-info").html(msg);

	$('#confirm-btn').on('click', function () {
		$("#progress").show();
		func();
	});

	$('#confirm-operation').on('hide.bs.modal', function () {
		$("#confirm-btn").unbind('click');
	});

	$("#confirm-operation").modal('show');
}

function errorAlert(err, refresh =true) {
	$("#error-info").text(err);
	$('#error-alert').on('hide.bs.modal', function () {
		if (refresh) location.reload();
	});
	$('#error-alert').on('show.bs.modal', function () {
		// Prevent Bootstrap Operation: add scrollbarWidth as padding-right
		$("body").css("padding-right", 0);
	});

	$("#progress").hide();
	$("#confirm-operation").modal('hide');
	$("#error-alert").modal('show');
}
