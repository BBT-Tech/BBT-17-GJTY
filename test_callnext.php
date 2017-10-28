<?php
header('Content-Type: application/json');

sleep(3);
$i = file_get_contents('php://input');
echo '{"status": 0, "data":' . $i . '}';
