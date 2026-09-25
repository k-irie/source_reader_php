<?php
require_once '../common.php';

$result = [];
$result['messages'] = [];

$result['result'] = false;
$result['selectable'] = $env['selectable'];

if (isset($_GET['name']) && $_GET['name'] !== "") {
    $filename = "{$root_folder_path}/{$_GET['name']}";

    // ファイルが存在するか確認
    if (file_exists($filename)) {
// echo getcwd() , "\n";
// echo pathinfo($filename, PATHINFO_DIRNAME)  . "\n";
chdir(pathinfo($filename, PATHINFO_DIRNAME));
// echo getcwd() , "\n";

        // ファイル名からMIMEタイプを取得する方法
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $filename);
        finfo_close($finfo);
        $result['mime_type'] = $mime_type;

        // 拡張子からファイルタイプを取得
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
// var_dump($extension);
        $result['filetype'] = $env['file-type'][$extension] ?? 'unknown';
// var_dump($result);
        $body = file_get_contents($filename);
        if (strpos($mime_type, 'image') === 0 || strpos($mime_type, 'application') === 0 ) {
            $body = "data:{$mime_type};base64," . base64_encode($body);
        }
        $result['source_contents'] = $body;

        $result['result'] = true;
    } else {
        $result['messages'][] = $filename;
        $result['messages'][] = "{$_GET['name']}:ファイルがありません";
    }
} else {
    $result['messages'][] = "パラメータ：nameが指定されていません";
}

header("Content-Type: application/json");
echo json_encode($result);
