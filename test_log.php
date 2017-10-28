<?php
header('Content-Type: application/json');

$i = file_get_contents('php://input');
echo '{"status": 0, "data":' . ($i == '' ? '{}' : $i) . '}';
// echo '{"status": 1, "errorMessage": "用户名或密码错误"}';
