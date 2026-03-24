<?php
header('Content-Type: application/json');

// 读取票数文件
$file = 'votes.json';
if (file_exists($file)) {
    $data = json_decode(file_get_contents($file), true);
    if (!$data) {
        $data = ['movieA' => 0, 'movieB' => 0, 'movieC' => 0];
    }
} else {
    $data = ['movieA' => 0, 'movieB' => 0, 'movieC' => 0];
}

echo json_encode($data);
