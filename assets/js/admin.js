var testing = true;

var systemClosed = false,
	paths = {
		"getRegisterAble": "../admin/getRegisterAble/",
		"setRegisterAble": "../admin/setIsRegisterAble/",
		"getQueueItem": "../admin/getQueueItem/posID/",
		"getQueueListByPos": "../admin/getQueueListByPos/",
		"getQueueList": "../admin/getQueueList/",
		"callNext": "../admin/goNext/",
		"login": "../admin/checkLogin/",
		"logout": "../admin/logOut/",
		"queueInfo": "../queueinfo.json"
	};

if (testing) {
	paths = {
		"getRegisterAble": "../test_registerable.php",
		"setRegisterAble": "../test_registerable.php",
		"getQueueItem": "../test_queueitem.php",
		"getQueueListByPos": "../test_queuelist.php",
		"getQueueList": "../test_queuelist.php",
		"callNext": "../test_callnext.php",
		"login": "../test_log.php",
		"logout": "../test_log.php",
		"queueInfo": "../test_queueinfo.php"
	};
}

$.get(
	paths["getRegisterAble"],
	function(response) {
		$("body").show();
		if (response.status == 0) {
			switch(response.data.status) {
				case 1:
					$("#placeholder-title").text('预约系统暂未开放');
					$("#placeholder-content").text('提示： 连接投影页至大屏幕 » 开始接受预约');
					$("#placeholder").show();

					$("#show-all-info").hide();
					$("#export-all-info").hide();
					$("#close-system").hide();

					$("#start-system").click(function() {
						confirmOperation(
							'<p>现场已经准备完成的话就可以开始接受预约了</p>' +
							'<p>记得将投影页面接到大屏幕上哦</p>' +
							'<p>一切就绪的话就点击下面的确定键吧</p>',
							function() {
								$.post(
									paths["setRegisterAble"],
									'{"status": 0}',
									function(response) {
										handleResponse(response, function() {
											errorAlert('操作成功，系统开始接受预约');
										});
									}
								).fail(function() { failed(); });
							}
						)
					});
					break;

				case -1:
					systemClosed = true;
					initialPrepare();

					$("#start-system").hide();
					$("#close-system").hide();
					break;

				case 0:
					initialPrepare();
					$("#start-system").hide();
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
).fail(function() { failed(); });

$("#open-screen").click(function() {
	window.open('./screen.html');
});

$("#login-btn").click(function() {
	$("#login-modal").modal('show');
});

$("#login-modal-btn").click(function() {
	$.post(
		paths["login"],
		'{"userName": "' + $("#username").val() +
		'","passWord": "' + $("#password").val() + '"}',
		function(response) {
			handleResponse(response, function() {
				location.reload();
			});
		}
	).fail(function() { failed(); });
});

function initialPrepare() {
	$("#all-info").show();
	$("#information").hide();
	$(".buttons").hide();
	allInfoPrepare();
	return;
	///////////////////////////////////////
	$("#logout-btn").click(function() {
		confirmOperation(
			'<p>确定要退出系统吗？</p>',
			function() {
				$.post(
					paths["logout"], '',
					function(response) {
						handleResponse(response, function() {
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
						});
					}
				).fail(function() { failed(); });
			}
		);
	});

	if (!systemClosed) {
		$("#close-system").click(function() {
			confirmOperation(
				'<p>活动结束后系统将不再接受新的预约</p>' +
				'<p>管理页面会继续正常显示 直到所有已预约号码都处理完毕</p>' +
				'<p>是否确定结束本次光迹涂鸦活动？</p>',
				function() {
					$.post(
						paths["setRegisterAble"],
						'{"status": -1}',
						function(response) {
							handleResponse(response, function() {
								errorAlert('已结束本次光迹涂鸦活动', false);
								systemClosed = true;
							});
						}
					).fail(function() { failed(); });
				}
			)
		});
	}

	$.getJSON(paths["queueInfo"], function(data) {
		if (data.queueLength == 0) {
			$("#name").text('（暂无预约信息）');
			$("#placeholder").show();
			$("#show-all-info").hide();
			$("#export-all-info").hide();
			setInterval(function() {
				$.getJSON(paths["queueInfo"], function(d) {
					if (d.queueLength > 0) location.reload();
				});
			}, 10000);
			return;
		} else {
			allInfoPrepare();

			if (systemClosed && (data.queueLength == data.curPos)) {
				$("#name").text('（活动已结束）');
				$("#open-screen").hide();

				$("#placeholder-title").text('本次光迹涂鸦活动已经结束');
				$("#placeholder-content").text('预约队列处理完毕 现在可以查看或导出所有数据');
				$("#placeholder").show();
				return;
			}

			$("#related").show();
			$("#call-next").show();
			callNextPrepare();
			updateQueue(data.queueLength, data.curPos);

			if (data.curPos > 0)
				showCurPos(data.curPos);
			else
				$("#name").text('（暂未开始叫号）');

			// Automatically request and add new reserve data
			setInterval(function() { updateQueue(); }, 10000);
		}
	}).fail(function() { failed(); });
}

function callNextPrepare() {
	$("#call-next").click(function() {
		confirmOperation(
			'<p>更新至下一号的同时将通过微信提醒接下来的三位同学</p>' +
			'<p>该操作可能需要较长的处理时间，请耐心等待</p>' +
			'<p>是否确定更新？</p>',
			function() {
				$.post(
					paths["callNext"],
					'{"curPos": ' + $("#position").text() + '}',
					function(r) {
						handleResponse(r, function() {
							if (r.data.curPos == r.data.queueLength) {
								if (systemClosed) location.reload();
								$("#call-next").unbind('click');
								$("#call-next").addClass("disabled");
							}
							showCurPos(r.data.posID);
						});
					}
				).fail(function() { failed(); });
			}
		)
	});
}

function allInfoPrepare() {
	// $("#show-all-info").click(function() {
		$.getJSON(paths["queueInfo"], function(data) {
			var rowLimit = 15, pageLimit = 9;
			pages = Math.ceil(data.queueLength / rowLimit);
			for (var i = 0; i < pages; i++) {
				$(".page-item:nth-last-child(2)").before(
					'<li class="page-item' + (i < pageLimit ? '' : ' d-none') +
					'"><a class="page-link">' + (i + 1) + '</a></li>'
					);
			}
			$(".page-item:nth-child(3)").addClass("active");
			$(".page-link").click(function() { togglePage($(this).text()); });
		});

		$("#show-all-info").fadeOut(100, function() {
			$("#hide-all-info").fadeIn(200);
		});
		//prepare pagination and table
		$("#all-info").show();
		$("body").animate({scrollTop: $(document).height()}, 3000);
	// });

	$("#hide-all-info").click(function() {
		$("#hide-all-info").fadeOut(100, function() {
			$("#show-all-info").fadeIn(200);
		});
		$("body").animate({scrollTop: 0}, 3000);
		$("#all-info").hide(2000);
	});

	$("#export-all-info").click(function() {
		$.getJSON(paths["queueInfo"], function(data) {
			$.get(
				paths["getQueueList"] +
				(testing ? '' : ('/page/1/limit/' + data.queueLength + '/')),
				function(response) {
					handleResponse(response, function() {
						exportData(response.data, '光迹涂鸦预约信息.csv');
					});
				}).fail(function() { failed(); });
		}).fail(function() { failed(); });
	});
}

function showCurPos(pos) {
	$.get(
		paths["getQueueItem"] + (testing ? '' : (pos + '/')),
		function(response) {
			handleResponse(response, function() {
				var d = response.data;
				$("#progress").hide();
				$("#confirm-operation").modal('hide');
				setTimeout(function() {
					infoToggle("#name", d.name);
					infoToggle("#phone", d.mobileNumber);
					infoToggle("#email", d.emailAddress);
					infoToggle("#reg-time", d.registerDate);
					infoToggle("#wechat-msg", ((d.isNoticed ? '已' : '未') + '发送'));

					setTimeout(function() {
						$("#position").removeClass("fadeInUp");
						$("#position").addClass("fadeOutUp");

						setTimeout(function() {
							$("#position").text(d.posID);
							$("#position").removeClass("fadeOutUp");
							$("#position").addClass("fadeInUp");
						}, 700);
					}, 2333);
				}, 700);
			});
		}
	).fail(function() { failed(); });
}

function updateQueue(l, p) {
	// Variable l(length) and p(position) are for the initial render
	var curLength = $("#related-queue>tr").length;
	if (curLength < 7) {
		// Rendered queue is not full
		$.get(
			/*************************************************************
			  * Send request with appropriate start position
			  * Center current position among rows if length >= 7
			  * And then append all the responsed data to table
			  ***********************************************************/
			paths["getQueueListByPos"] +
			(
				testing ? '' :
				'start/' + (curLength == 0 ? parseStartPos(l, p) : (curLength + 1)) + '/' +
				'limit/' + (7 - curLength) + '/'
			),
			function(response) {
				handleResponse(response, function() {
					$.each(response.data, function(i, d) {
						if (i < 7) appendToQueue(d);
					});
				});
			}
		).fail(function() { failed(); });
	} else {
		$.getJSON(paths["queueInfo"], function(data) {
			var curMax = parseInt($("#related-queue>tr:last-child>td:first-child").text());
			if (data.queueLength > curMax
				// There is new item in queue data
				&& data.curPos > parseInt($("#related-queue>tr:nth-child(4)>td:first-child").text())) {
				// Make sure the centered row displays data of current position
				$.get(
					paths["getQueueItem"] + (testing ? '' : ((curMax + 1) + '/')),
					function(response) {
						handleResponse(response, function() {
							$("#related-queue>tr:first-child").addClass("fadeOutUp");
							setTimeout(function() {
								$("#related-queue>tr:first-child").remove();
								appendToQueue(response.data);
							}, 700);
						});
					}
				).fail(function() { failed(); });
			}
		}).fail(function() { failed(); });;
	}
}

function appendToQueue(newRow) {
	$("#related-queue").append(
	'<tr class="animated fadeInUp">' +
		'<td>' + newRow.posID + '</td>' +
		'<td>' + newRow.name + '</td>' +
		'<td>' + newRow.mobileNumber + '</td>' +
		'<td>' + newRow.emailAddress + '</td>' +
		'<td>' + newRow.registerDate + '</td>' +
		'<td>' + (newRow.isNoticed ? '已发送' : '') + '</td>' +
	'</tr>');

	if ($("#call-next.disabled").length == 1) {
		callNextPrepare();
		$("#call-next").removeClass("disabled");
	}
}

function parseStartPos(len, pos) {
	return (len < 8 || pos < 5) ? 1 :
		(len - pos > 3) ? (pos - 3) : (len - 6);
}

function infoToggle(ele, val) {
	$(ele).removeClass("fadeInRight");
	$(ele).addClass("animated zoomOutUp");
	setTimeout(function() {
		$(ele).text(val);
		$(ele).removeClass("zoomOutUp");
		$(ele).addClass("fadeInRight");
	}, 1000);
}

function togglePage(page) {
	switch(page) {
		case '首页':
			togglePage(1);
			break;
		case '末页':
			togglePage(pages);
			break;
		case '«':
			togglePage(parseInt($(".page-item.active").text()) - 1);
			break;
		case '»':
			togglePage(parseInt($(".page-item.active").text()) + 1);
			break;

		default:
			alert(page);
			break;
	}
}

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
		if (refresh)
			setTimeout(function() { location.reload(); }, 500);
	});
	$('#error-alert').on('show.bs.modal', function () {
		// Prevent Bootstrap Operation: add scrollbarWidth as padding-right
		$("body").css("padding-right", 0);
	});

	$("#progress").hide();
	$("#confirm-operation").modal('hide');
	$("#error-alert").modal('show');
}

function handleResponse(response, successFunc) {
	if (response.status == 0) {
		successFunc();
	} else {
		errorAlert(response.errorMessage);
	}
}

function exportData(data, filename) {
	var string = '\ufeff' + '号码,姓名,手机号,邮箱地址,报名时间,微信提醒' + '\n';
	$.each(data, function(index, row) {
		string += String(Object.values(row))
		.replace(/(true)|(false)/g, function(noticed) {
			return (noticed == 'true' ? '已发送' : '未发送');
		}) + '\n';
	});
	var blob = new Blob([string], { type: 'text/csv;charset=utf-8' });

	var link = document.createElement('a');
	$(link).attr({ 'download': filename, 'href': URL.createObjectURL(blob)});
	link.click();
}

function failed() {
	errorAlert('获取数据失败，请联系管理员');
}
