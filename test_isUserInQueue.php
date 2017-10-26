<?php
header('Content-Type: application/json');

// echo '{"status": -1, "data":{"isInQueue": false, "isRegisterAble": 0}}';
// echo '{"status": 0, "data":{"isInQueue": false, "isRegisterAble": 0}}';
// echo '{"status": 0, "data":{"isInQueue": false, "isRegisterAble": 1}}';
// echo '{"status": 0, "data":{"isInQueue": false, "isRegisterAble": -1}}';
echo '{"status": 0, "data":{"isInQueue": true, "userPos": 17, "curPos": 13, "queueLength":233, "avgServeTime":5 }}';
