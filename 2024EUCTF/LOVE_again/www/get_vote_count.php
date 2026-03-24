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

// 初始化响应
$response = $data;

// 检查票数是否达到 100
if ($data['movieA'] >= 100) {
    // 读取 flag 文件
    $flagFile = 'flag.txt';
    if (file_exists($flagFile)) {
        $flagContent = trim(file_get_contents($flagFile));
        $response['flag'] = $flagContent;
    } else {
        $response['flag'] = 'Flag 文件不存在。';
    }
}

echo json_encode($response);
