$("#confirm-operation").modal('show');
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
		alert('操作失败，请联系管理员');
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
		alert('操作失败，请联系管理员');
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
				alert(response.errorMessage);
			}
		}
	).fail(function() {
		alert('操作失败，请联系管理员');
	});
});

$("#logout").click(function() {
	$.post(
		'../admin/logOut/',
		'',
		function(response) {
			if (response.status == 0) {
				alert('退出系统成功！');
				location.reload();
			} else {
				alert(response.errorMessage);
			}
		}
	).fail(function() {
		alert('操作失败，请联系管理员');
	});
});
