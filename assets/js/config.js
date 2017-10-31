// Change it to false while deploying this project
testing = false;

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
