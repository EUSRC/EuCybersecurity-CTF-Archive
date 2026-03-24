<?php
// config/db.php

// 数据库配置
// 请确保这里的账号密码与 db.sql 底部创建的一致
$db_host = 'localhost';
$db_user = 'root';      // 对应 db.sql 里的用户
$db_pass = 'root';   // 对应 db.sql 里的密码
$db_name = 'ctf_db';


$FINAL_FLAG = "flag{testflag}";

// 建立连接
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

// 检查连接
if (!$conn) {
    // 生产环境不建议直接输出错误信息，但这是 CTF 靶场，方便调试
    die("数据库连接失败: " . mysqli_connect_error());
}

mysqli_set_charset($conn, "utf8mb4");

// =======================================================
// 🛡️ Flag 自动维护逻辑 (Auto-Heal)
// =======================================================
// 每次页面加载时检查 Flag 是否存在，不存在则自动插入。
// 这样可以防止数据库被重置后 Flag 丢失。

$check_sql = "SELECT id FROM flags LIMIT 1";
$result = mysqli_query($conn, $check_sql);

// 如果查询成功，且行数为 0 (说明表是空的)
if ($result && mysqli_num_rows($result) === 0) {
    // 使用预编译语句插入 Flag，安全规范
    $stmt = mysqli_prepare($conn, "INSERT INTO flags (flag) VALUES (?)");
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "s", $FINAL_FLAG);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }
}

?>