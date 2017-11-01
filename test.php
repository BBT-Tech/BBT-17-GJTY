<?php
$file = fopen('./test.log', 'a');
fwrite($file, file_get_contents('php://input') . PHP_EOL);
fclose($file);
