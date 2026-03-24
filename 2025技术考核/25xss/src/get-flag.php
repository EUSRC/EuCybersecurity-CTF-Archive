<?php
// 确保只返回 flag，没有其他输出
require_once 'config.php'; // 如果需要的话
session_start(); // 如果需要的话

// 只输出 flag 值，确保没有空格或换行
echo getFlag();
?>