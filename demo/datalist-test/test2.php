<?php
header('Content-Type:text/json');
$key = $_REQUEST['key'];
$result = array();
for($i = 0; $i <= 10; $i ++) {
    array_push($result, $key.'test'.$i);
}
echo json_encode($result);