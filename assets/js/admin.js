$.get(
	// '../admin/getRegisterAble/',
	'../test_registerable.php',
	function(response) {
		$("body").show();
		if (response.status == 0) {
			switch(response.data.status) {
				case 1:
					$("#show-all-info").hide();
					$("#export-all-info").hide();
					$("#close-system").hide();
					break;

				case -1:
					$("#open-screen").hide();
					$("#start-system").hide();
					$("#close-system").hide();
					break;

				case 0:
					$("#call-next").fadeIn(1000);
					$("#start-system").hide();
					//Todo
					break;
			}
			$("#login-btn").hide();
		} else {
			$("#show-all-info").hide();
			$("#export-all-info").hide();
			$("#start-system").hide();
			$("#close-system").hide();
			$("#logout-btn").hide();
			errorAlert(response.errorMessage, false);
		}
		$("#hide-all-info").hide();
		$(".buttons").animate({"opacity": 1}, 1000);
	}
).fail(function() {
	alert('获取状态信息失败，请联系管理员');
});

$("#call-next").click(function() {
	//Todo
});

$("#open-screen").click(function() {
	window.open('./screen.html');
});

$("#show-all-info").click(function() {
	$("#show-all-info").fadeOut(100, function() {
		$("#hide-all-info").fadeIn(200);
	});
	$("#all-info").show();
	$("body").animate({scrollTop: $(document).height()}, 3000);
});

$("#hide-all-info").click(function() {
	$("#hide-all-info").fadeOut(100, function() {
		$("#show-all-info").fadeIn(200);
	});
	$("body").animate({scrollTop: 0}, 3000);
	$("#all-info").hide(2000);
});

$("#export-all-info").click(function() {
	//Todo
});

$("#start-system").click(function() {
	confirmOperation(
		'<p>现场已经准备完成的话就可以开始接受预约了</p>' +
		'<p>记得将投影页面接到大屏幕上哦</p>' +
		'<p>一切就绪的话就点击下面的确定键吧</p>',
		function() {
			$.post(
				// '../admin/setIsRegisterAble/',
				'../test_registerable.php',
				'{"status": 0}',
				function(response) {
					errorAlert('操作成功，系统开始接受预约');
				}
			).fail(function() {
				errorAlert('操作失败，请联系管理员');
			});
		}
	)
});

$("#close-system").click(function() {
	confirmOperation(
		'<p>活动结束后系统将不再接受新的预约</p>' +
		'<p>管理页面会继续正常显示 直到所有已预约号码都处理完毕</p>' +
		'<p>是否确定结束本次光迹涂鸦活动？</p>',
		function() {
			$.post(
				// '../admin/setIsRegisterAble/',
				'../test_registerable.php',
				'{"status": -1}',
				function(response) {
					errorAlert('已结束本次光迹涂鸦活动');
				}
			).fail(function() {
				errorAlert('操作失败，请联系管理员');
			});
		}
	)
});

$("#login-modal-btn").click(function() {
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

$("#login-btn").click(function() {
	$("#login-modal").modal('show');
});

$("#logout-btn").click(function() {
	confirmOperation(
		'<p>确定要退出系统吗？</p>',
		function() {
			$.post(
				// '../admin/logOut/',
				'../test_log.php',
				'',
				function(response) {
					if (response.status == 0) {
						errorAlert('退出系统成功！', false);
						$("#error-alert").on('hide.bs.modal', function () {
							$("#information").fadeOut(700);
							$("#all-info").fadeOut(700);

							$(".buttons").fadeOut(700, function() {
								$("#show-all-info").hide();
								$("#hide-all-info").hide();
								$("#export-all-info").hide();
								$("#start-system").hide();
								$("#close-system").hide();
								$("#logout-btn").hide();
								$("#login-btn").show();
								$("#open-screen").show();

								$(".buttons").css("padding-top", "calc(100vh - 11em)");
								$(".buttons").fadeIn(500, function() {
									setTimeout(function() {
										$("#login-modal").modal('show');
									}, 500);
								});
							});
						});
					} else {
						errorAlert(response.errorMessage);
					}
				}
			).fail(function() {
				errorAlert('操作失败，请联系管理员');
			});
		}
	);
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
		if (refresh) {
			setTimeout(function() {
				location.reload();
			}, 500);
		}
	});
	$('#error-alert').on('show.bs.modal', function () {
		// Prevent Bootstrap Operation: add scrollbarWidth as padding-right
		$("body").css("padding-right", 0);
	});

	$("#progress").hide();
	$("#confirm-operation").modal('hide');
	$("#error-alert").modal('show');
}
