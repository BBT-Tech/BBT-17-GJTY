<?php
header('Content-Type: application/json');

$i = file_get_contents('php://input');

// echo '{"status": 0, "data":{"status": 1}}';
// echo '{"status": 0, "data":{"status": 0}}';
echo '{"status": 0, "data":{"status": -1}}';
// echo '{"status": 1, "errorMessage": "请登录系统"}';
