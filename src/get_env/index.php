<?php
require_once '../common.php';

$csses = scandir("../highlight/styles/");

$result = [];
$result['css_files'] = array_splice($csses,2);

header("Content-Type: application/json");
echo json_encode($result);
