<?php
// 現在の日時を取得
$now = new DateTime();

$env = json_decode(file_get_contents(__DIR__ . "/config.json"), true);

$env['project_directory'] = __DIR__;

// Check if the environment variable is set
if (!$env) {
    die("config.jsonの読み込みに失敗しました");
}

if (isset($_GET['mode']) && isset($env['node-list'][$_GET['mode']])) {
    $mode = $_GET['mode'];
} else {
    $mode = 'root';
}

// 
if (isset($env['node-list'][$mode])) {
    foreach ($env['node-list'][$mode] as $key => $value) {
        // echo $key;
        if (is_array($value)) {
            // echo "..array\n";
            $env[$key] = array_merge($env[$key], $value);
        } else {
            // echo "..single\n";
            $env[$key] = $value;
        }
    }
}

// var_dump($env);

// browser.phpから移動
if (dirname($env['path']) == ".") {
    $root_folder_path = __DIR__ . "/" . basename($env['path']);
} else {
    $root_folder_path = $env['path'];
}
$root_folder_name = basename($root_folder_path) . '/';

// $now_with_microseconds = $now->format('Y-m-d H:i:s.u');

/**
 *  Scan a directory recursively and return an associative array of its contents.
 *
 * @param string $dir The directory path to scan.
 * @param string $base The base path for relative paths (used internally).
 * @return array An associative array where keys are file/folder names and values are their contents.
 */
function scanDirectory($ignore, $dir, $base = '')
{
    $result = [];
    $message = "";
    if (is_dir($dir)) {
        $items = scandir($dir);
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }
            if (in_array($item, $ignore)) {
                continue;
            }
            $path = $dir . DIRECTORY_SEPARATOR . $item;
            $relativePath = ltrim($base . $item, '/');
            if (is_dir($path)) {
                // $result[] = $relativePath . '/';
                // $result[$relativePath . '/'] = scanDirectory($path, $relativePath . '/');
                $result[$relativePath . '/'] = scanDirectory($ignore, $path)[0];
            } else {
                $result[] = $relativePath;
            }
        }
    } else {
        $message = "{$dir} is not found.";
    }
    return array($result, $message);
}

/**
 * Generate HTML for a directory structure.
 *
 * @param string $basedir The base directory path.
 * @param array $dir The directory structure as an associative array.
 * @return string HTML representation of the directory structure.
 */
function htmlDirectory($basedir, $dir)
{
    $result = "";
    foreach ($dir as $key => $name) {
        if (str_ends_with($key, "/")) {
            $result .= "<li class='folder close'><span class='name' title='{$basedir}{$key}'>{$key}</span><ul>";
            $result .= htmlDirectory("{$basedir}{$key}", $name);
            $result .= "</ul></li>";
        } else {
            $result .= "<li class='file'><span class='name' title='{$basedir}{$name}'>{$name}</span></li>\n";
        }
    }
    return $result;
}
