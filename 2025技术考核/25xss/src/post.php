<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['message'])) {
    $author = trim($_POST['author'] ?? '');
    $message = trim($_POST['message']);
    
    // 存储消息（不进行HTML转义）
    $_SESSION['messages'][] = [
        'author' => $author,
        'message' => $message,
        'time' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR']
    ];
    
    // 限制消息数量
    if (count($_SESSION['messages']) > 20) {
        array_shift($_SESSION['messages']);
    }
}

header('Location: index.php');
exit;
?>