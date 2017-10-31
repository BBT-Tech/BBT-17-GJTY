<?php
header('Content-Type: application/json');

// sleep(3);
$i = json_decode(file_get_contents('php://input'), true);
// $i['curPos']++;
// $i['queueLength'] = $i['curPos'] + 1;
$i['queueLength'] = $i['curPos'];
echo '{"status": 0, "data":' . json_encode($i) . '}';
