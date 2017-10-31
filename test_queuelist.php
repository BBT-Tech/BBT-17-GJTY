<?php
header('Content-Type: application/json');

$id = rand(1, 120);

echo
'{"status": 0,' .
'"data":[' .
'{"posID": ' . $id++ . ', "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":false},' .
'{"posID": ' . $id++ . ', "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":true},' .
'{"posID": ' . $id++ . ', "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":false},' .
'{"posID": ' . $id++ . ', "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":true},' .
'{"posID": ' . $id++ . ', "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":true},' .
'{"posID": ' . $id++ . ', "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":false},' .
// '{"posID": 17, "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":false},' .
// '{"posID": 18, "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":true},' .
// '{"posID": 19, "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":false},' .
'{"posID": ' . $id++ . ', "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":true}]}';
// '{"posID": 20, "name": "董建华", "mobileNumber": "' . mt_rand() .'", "emailAddress": "Chee-hwa@gmail.com", "registerDate": "2017-10-27 21:52:36", "isNoticed":true}]}';
