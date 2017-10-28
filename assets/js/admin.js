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
		'../admin/checkLogin/',
		'{"userName": "' + $("#username").val() +
		'","passWord": "' + $("#password").val() + '"}',
		function(response) {
			if (response.status == 0) {
				//Success
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
		'../admin/logOut/',
		'',
		function(response) {
			if (response.status == 0) {
				errorAlert('退出系统成功！');
				location.reload();
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

function errorAlert(err, refresh =false) {
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

confirmOperation(
	'<p>emmmmmm</p>' +
	'<p>确定操作吗</p>' +
	'<p>董先生连任吼不吼哇？</p>',
	function() {
		errorAlert('喵喵喵？');
	}
);
