var systemClosed = false, posUpdating = false;

$.get(
	paths.admin.getRegisterAble,
	function(response) {
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
									paths.admin.setRegisterAble,
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

		// Show only current position card when there is no enough width = =
		if (document.body.clientWidth < 700) {
			$(".buttons").remove()
			$("#call-next").remove();
			$("#placeholder").remove();
			$("#related").remove();
			$("#all-info").remove();
		} else {
			$(".buttons").animate({"opacity": 1}, 1000);
		}
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
		paths.admin.login,
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
	$("#logout-btn").click(function() {
		confirmOperation(
			'<p>确定要退出系统吗？</p>',
			function() {
				$.post(
					paths.admin.logout, '',
					function(response) {
						handleResponse(response, function() {
							errorAlert('退出系统成功！', false);
							$("#error-alert").on('hide.bs.modal', function () {
								$("#information").fadeOut(700);
								$("#all-info").fadeOut(700);

								$(".buttons").fadeOut(700, function() {
									$("#show-all-info").hide();
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

	$.getJSON(paths.admin.queueInfo, function(data) {
		if (data.queueLength == 0) {
			$("#name").text('（暂无预约信息）');
			$("#placeholder").show();
			$("#show-all-info").hide();
			$("#export-all-info").hide();
			setInterval(function() {
				$.getJSON(paths.admin.queueInfo, function(d) {
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
			updateQueue(data.queueLength, data.curPos);

			if (data.curPos > 0) updateCurPos(data.curPos, (data.queueLength == data.curPos));
			else $("#name").text('（暂未开始叫号）');
		}

		if (!systemClosed) {
			$("#close-system").click(function() {
				confirmOperation(
					'<p>活动结束后系统将不再接受新的预约</p>' +
					'<p>管理页面会继续正常显示 直到所有已预约号码都处理完毕</p>' +
					'<p>是否确定结束本次光迹涂鸦活动？</p>',
					function() {
						$.post(
							paths.admin.setRegisterAble,
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

			// Automatically request and add new reserve data while reserve system is open
			setInterval(function() { updateQueue(); }, 10000);
		}
	}).fail(function() { failed(); });
}

function callNextPrepare() {
	$("#call-next").removeClass("disabled");
	$("#call-next").click(function() {
		confirmOperation(
			'<p>更新至下一号的同时将通过微信提醒接下来的三位同学</p>' +
			'<p>该操作可能需要较长的处理时间，请耐心等待</p>' +
			'<p>是否确定更新？</p>',
			function() {
				$.post(
					paths.admin.callNext,
					'{"curPos": ' + $("#position").text() + '}',
					function(response) {
						handleResponse(response, function() {
							var d = response.data;
							if ((d.queueLength == d.curPos)
								&& systemClosed) location.reload();

							$("#related-queue>tr.rgba-orange-strong").removeClass("rgba-orange-strong");
							$("#related-queue>tr>td:first-child:contains(" + d.curPos + ")").parent()
							.addClass("rgba-orange-strong");

							updateCurPos(d.curPos, (d.queueLength == d.curPos));

							// On reserve system opening: automatically request and update per 10s
							// On reserve system closed: update when there is a next-call
							if (systemClosed) updateQueue();
						});
					}
				).fail(function() { failed(); });
			}
		)
	});
}

function showAllPrepare() {
	$("#show-all-info").removeClass("disabled");

	$("#show-all-info").click(function() {
		$("#show-all-info").unbind('click');

		$.getJSON(paths.admin.queueInfo, function(data) {
			rowLimit = 11, pageLimit = 9;
			pages = Math.ceil(data.queueLength / rowLimit);

			var linkNum = (pages > pageLimit ? pageLimit : pages);
			for (var i = 0; i < linkNum; i++) {
				$(".page-item:eq(-2)").before(
					'<li class="page-item"><a class="page-link">' + (i + 1) + '</a></li>'
				);
			}
			togglePage(1);
			$(".page-link").click(function() { togglePage($(this).text()); });
		});

		$("#all-info").show();
		$("body").animate({scrollTop: $(document).height()}, 1700, function() {
			$("#show-all-info").addClass("disabled");
		});
	});
}

function allInfoPrepare() {
	showAllPrepare();

	$("#hide-all-info").click(function() {
		$("body").animate({scrollTop: 0}, 1700, function() {
			$("#all-content").html('');
			showAllPrepare();
		});

		$("#all-info").hide(1700);
	});

	$("#export-all-info").click(function() {
		$.getJSON(paths.admin.queueInfo, function(data) {
			$.get(
				paths.admin.getQueueList +
				(testing ? '' : ('/page/1/limit/' + data.queueLength + '/')),
				function(response) {
					handleResponse(response, function() {
						exportData(response.data, '光迹涂鸦预约信息.csv');
					});
				}).fail(function() { failed(); });
		}).fail(function() { failed(); });
	});
}

function updateCurPos(pos, final) {
	posUpdating = true;
	$("#call-next").unbind('click');
	$("#call-next").addClass("disabled");

	$.get(
		paths.admin.getQueueItem + (testing ? '' : (pos + '/')),
		function(response) {
			handleResponse(response, function() {
				$("#progress").hide();
				$("#confirm-operation").modal('hide');

				var d = response.data;
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

							posUpdating = false;
							if (!final) callNextPrepare();
						}, 700);
					}, 2333);
				}, 700);
			});
		}
	).fail(function() { failed(); });
}

function updateQueue(l, p) {
	// The Maximum of queue rows is 7
	var displayedLen = $("#related-queue>tr").length;
	var queueStatus = displayedLen >= 7 ? 'full' : (displayedLen == 0 ? 'empty' : 'filled');

	switch(queueStatus) {
		case 'empty':
			/******************************************************************
			  * Variable l(length) and p(position) are for this initial render
			  * Send request with appropriate start position
			  * Center the row of current position data if rows == 7
			  ****************************************************************/
			$.get(
				paths.admin.getQueueListByPos +
				(testing ? '' : 'start/' + String(parseStartPos(l, p)) + '/limit/7/'),
				function(response) {
					handleResponse(response, function() {
						$.each(response.data, function(i, d) { appendToQueue(d); });
					});
				}
			).fail(function() { failed(); });

			// Delay some time to make sure queue data is in DOM = =
			setTimeout(function() {
				// Initial highlight for current position
				$("#related-queue>tr>td:first-child:contains(" + p + ")").parent()
				.addClass("rgba-orange-strong");
			}, 300);
			break;

		case 'full':
			$.getJSON(paths.admin.queueInfo, function(data) {
				var curMax = parseInt($("#related-queue>tr:eq(-1)>td:eq(0)").text());
				if (data.queueLength > curMax
					// There is new item in queue data
					&& data.curPos > parseInt($("#related-queue>tr:eq(3)>td:eq(0)").text())) {
					// Make sure the centered row displays data of current position
					$.get(
						paths.admin.getQueueItem + (testing ? '' : ((curMax + 1) + '/')),
						function(response) {
							handleResponse(response, function() {
								$("#related-queue>tr:eq(0)").addClass("fadeOutUp");
								setTimeout(function() {
									$("#related-queue>tr:eq(0)").remove();
									appendToQueue(response.data);
								}, 700);
							});
						}
					).fail(function() { failed(); });
				}
			}).fail(function() { failed(); });
			break;

		case 'filled':
			// Append all the responsed data to table
			$.get(
				paths.admin.getQueueListByPos +
				(
					testing ? '' :
					('start/' + String(displayedLen + 1) +
					'/limit/' + String(7 - displayedLen) + '/')
				),
				function(response) {
					handleResponse(response, function() {
						$.each(response.data, function(i, d) { appendToQueue(d); });
					});
				}
			).fail(function() { failed(); });
			break;
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

	if ($("#call-next.disabled").length == 1
		&& (!posUpdating)) callNextPrepare();
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

function togglePage(page, limit) {
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
			page = parseInt(page);
			if (page <= 0 || page > pages) return;
			freshPagination(page);

			$.get(
				paths.admin.getQueueList + (testing ? '' : 'page/' + page + '/limit/' + rowLimit + '/'),
				function(response) {
					handleResponse(response, function() {
						$("#all-content").html('');
						$.each(response.data, function(i, d) {
							$("#all-content").append(
							'<tr>' +
								'<td>' + d.posID + '</td>' +
								'<td>' + d.name + '</td>' +
								'<td>' + d.mobileNumber + '</td>' +
								'<td>' + d.emailAddress + '</td>' +
								'<td>' + d.registerDate + '</td>' +
								'<td>' + (d.isNoticed ? '已发送' : '') + '</td>' +
							'</tr>');
						});
					});
				}
			).fail(function() { failed(); });
			break;
	}
}

function freshPagination(newPage) {
	$(".page-item.active").removeClass("active");

	$(".page-item.disabled").removeClass("disabled");
	if (newPage == 1) $(".page-item:eq(1)").addClass("disabled");
	if (newPage == pages) $(".page-item:eq(-2)").addClass("disabled");

	// IF pages < 9: just display all the page buttons
	// ELSE: display 9 page buttons and make sure the active page is centered
	var start = ((pages < 9 || newPage < 5) ? 1 :
		(
			(pages - newPage) < 5 ? (pages - 8) : (newPage - 4))
		);

	$.each($(".page-item:gt(1):lt(-2)>a"), function(i) {
		var n = start + i;
		$(this).text(prefixNumber(n, String(pages).length));
		if (n == newPage)
			$(this).parent().addClass("active");
	});
}

function prefixNumber(n, width) {
	var n = String(n), len = n.length;
	return len >= width ? n : (new Array(width - len + 1).join('0') + n);
}

function confirmOperation(msg, func) {
	$("#progress").hide();
	$("#confirm-info").html(msg);

	$("#confirm-btn").on('click', function () {
		$("#progress").show();
		func();
	});

	$("#confirm-operation").on('hide.bs.modal', function () {
		$("#confirm-btn").unbind('click');
	});

	$("#confirm-operation").modal('show');
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

function errorAlert(err, refresh =true) {
	$("#error-info").text(err);
	$("#error-alert").on('hide.bs.modal', function () {
		if (refresh)
			setTimeout(function() { location.reload(); }, 500);
	});
	$("#error-alert").on('show.bs.modal', function () {
		// Prevent Bootstrap Operation: add scrollbarWidth as padding-right
		$("body").css("padding-right", 0);
	});

	$("#progress").hide();
	$("#confirm-operation").modal('hide');
	$("#error-alert").modal('show');
}

function failed() {
	errorAlert('获取数据失败，请联系管理员');
}
