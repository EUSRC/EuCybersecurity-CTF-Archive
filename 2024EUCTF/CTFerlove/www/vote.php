<?php
session_start();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 获取用户提交的影片选项
    $movie = $_POST['movie'] ?? null;

    // 检查用户是否已投票
    if ($movie && (!isset($_SESSION['voted']) || $_SESSION['voted'] !== true)) {
        // 读取当前票数
        $data = json_decode(file_get_contents('votes.json'), true);
        if (!$data) {
            $data = ['movieA' => 0, 'movieB' => 0, 'movieC' => 0];
        }

        // 验证影片选项
        if (array_key_exists($movie, $data)) {
            $data[$movie]++;

            // 更新票数
            file_put_contents('votes.json', json_encode($data));

            // 标记会话为已投票
            $_SESSION['voted'] = true;

            echo json_encode(['success' => true, 'message' => '投票成功！']);
        } else {
            echo json_encode(['success' => false, 'message' => '无效的视频选择。']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => '你已经投过票了。']);
    }
} else {
    echo json_encode(['success' => false, 'message' => '无效的请求方法。']);
}
