// Change it to false while deploying this project
testing = true;



paths = {
	"admin": {
		"getRegisterAble": "../admin/getRegisterAble/",
		"setRegisterAble": "../admin/setIsRegisterAble/",
		"getQueueItem": "../admin/getQueueItem/posID/",
		"getQueueListByPos": "../admin/getQueueListByPos/",
		"getQueueList": "../admin/getQueueList/",
		"callNext": "../admin/goNext/",
		"login": "../admin/checkLogin/",
		"logout": "../admin/logOut/",
		"queueInfo": "../queueinfo.json"
	},
	"user": {
		"register": "./user/register/",
		"isInQueue": "./user/isUserInQueue/",
		"queueInfo": "./queueinfo.json"
	}
};

if (testing) {
	paths = {
		"admin": {
			"getRegisterAble": "../test_registerable.php",
			"setRegisterAble": "../test_registerable.php",
			"getQueueItem": "../test_queueitem.php",
			"getQueueListByPos": "../test_queuelist.php",
			"getQueueList": "../test_queuelist.php",
			"callNext": "../test_callnext.php",
			"login": "../test_log.php",
			"logout": "../test_log.php",
			"queueInfo": "../test_queueinfo.php"
		},
		"user": {
			"register": "./test_register.php",
			"isInQueue": "./test_isUserInQueue.php",
			"queueInfo": "./test_queueinfo.php"
		}
	};
}
