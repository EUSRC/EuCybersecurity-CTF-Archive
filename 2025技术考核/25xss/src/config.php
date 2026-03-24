<?php
session_start();

// 简单的消息存储（实际环境中应该用数据库）
if (!isset($_SESSION['messages'])) {
    $_SESSION['messages'] = [];
}

// 获取 flag
function getFlag() {
    if (file_exists('flag.php')) {
        include 'flag.php';
        return $FLAG;
    }
    return "flag{default_flag_please_check_flag_file}";
}
?>