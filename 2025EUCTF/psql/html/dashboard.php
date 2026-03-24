<?php
require_once('config/db.php');

// 开始会话
session_start();

// 处理退出登录请求
if (isset($_GET['action']) && $_GET['action'] == 'logout') {
    // 销毁会话
    session_destroy();
    header("Location: index.php"); // 跳转到登录页面，您可以根据实际情况修改
    exit();
}

if(!isset($_GET['user_id'])) {
    die("请通过正确方式访问！");
}

function getVisitorIP() {
    // 检查是否通过 HTTP_X_FORWARDED_FOR 访问（常见于代理服务器）
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    // 如果有多个 IP 地址，取第一个
    if (strpos($ip, ',') !== false) {
        $ip = explode(',', $ip)[0]; // 取第一个 IP
    }

    return $ip;
}

// 修复注入漏洞的核心代码
$user_id = $_GET['user_id'];
$stmt = $conn->prepare("SELECT username,email,id FROM users WHERE id = ?");
$stmt->bind_param("s", $user_id); // 即使ID是数字也按字符串处理
$stmt->execute();
$result = $stmt->get_result();

if(!$result) {
    die("数据库查询失败: " . $conn->error);
}

if($result->num_rows === 0) {
    die("用户不存在！");
}

$user = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<!-- 你真的学会sql注入了吗？ -->
<head>
    <title>用户中心</title>
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h2>欢迎回来，<?php echo htmlspecialchars($user['username']); ?></h2>
        
        <?php if($user['id'] == 1): ?>
        <div class="alert alert-success mt-3">
            <strong>Congratulations：</strong>
            flag1:flag{HBPhYU78pQ2zKsxV 另一部分的flag好像在数据库里呢，你有办法拿到他吗？
        </div>
        <?php endif; ?>

        <div class="card mt-4">
            <div class="card-body">
                <h5 class="card-title">账户信息</h5>
                <p class="card-text">
                    <br>邮箱：<?php echo htmlspecialchars($user['email']); ?><br>
                    注册时间：2025-03-15
                </p>
                <br>已经记录你的ip：<?php echo getVisitorIP(); ?><br>
                <br>即将派出黑客:<br>
                <img src="jbn.jpg" alt="no sql injection in here" style="max-width: 100%; height: auto;">
            </div>
            <a href="?action=logout" class="btn btn-danger mt-3">退出登录</a> 
        </div>
    </div>
</body>
</html>
