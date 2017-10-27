$("#call-next").click(function() {
	d;
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
		'{status: 0}',
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
		'{status: -1}',
		function(response) {
			//Todo
		}
	).fail(function() {
		alert('操作失败，请联系管理员');
	});
});

$("#logout").click(function() {
	$.post('../admin/logOut/.php', '',function(response) {
			alert('退出系统成功！');
			location.reload();
		}
	).fail(function() {
		alert('操作失败，请联系管理员');
	});
});
