<?php
require_once '../common.php';

// var_dump($env);
$dirs = scanDirectory($env['ignore'], $root_folder_path);
// $allFilesAndFolders = $result[0];

$result = [];
$result['serial'] = $now->format('Y-m-d H:i:s.u');
// $result['folders'] = $allFilesAndFolders;
$result['folders'] = $dirs[0];
$result['message'] = basename($dirs[1]);
$result['name'] = $root_folder_name;

header("Content-Type: application/json");
echo json_encode($result);
