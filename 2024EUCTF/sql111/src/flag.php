<?php
session_start();

// 检查用户是否登录
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    // 用户未登录或无权访问
    header("Location: login.php"); // 重定向到登录页面
    exit;
}

// 检查是否有权访问/flag文件
if (1 == 1) {
    // 用户有权访问
    echo file_get_contents('/flag'); // 输出flag文件内容
} else {
    // 用户无权访问
    echo "您无权访问此页面";
}

// 结束会话
session_destroy();
?>