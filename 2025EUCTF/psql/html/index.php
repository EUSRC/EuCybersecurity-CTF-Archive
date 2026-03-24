<?php
require_once('config/db.php');


if (!mysqli_query($conn, "SHOW TABLES LIKE 'users'")) {
    initDatabase($conn); // 如果表不存在，执行初始化
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // 存在 SQL 注入漏洞的查询，直接使用用户输入的内容
    $query = "SELECT * FROM users WHERE username = '$username'";
    
    // 执行查询并添加错误处理
    $result = mysqli_query($conn, $query);
    
    // 检查查询结果是否有效
    if ($result) {
        if (mysqli_num_rows($result) > 0) {
            $user = mysqli_fetch_assoc($result);
            
            // 直接比较明文密码
            if ($password === $user['password']) {
                // 密码匹配，登录成功
                header("Location: dashboard.php?user_id=" . $user['id']);
                exit;
            } else {
                $error = "用户名或密码错误！";
            }
        } else {
            // 用户名不存在，返回错误信息
            $error = "用户名或密码错误！";
        }
    } else {
        // 这里可以记录日志或进行其他处理，但不向用户展示错误信息
        $error = "登录失败，请稍后再试。";  // 只提示用户登录失败，不泄露具体错误
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>图书管理系统 - 登录</title>
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css">
    <style>
        body { background: #f0f2f5; }
        .login-box { max-width: 400px; margin: 100px auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="container">
        <div class="login-box">
            <h2 class="text-center mb-4">📚 图书管理系统</h2>
            <?php if ($error): ?>
                <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>
            <form method="POST">
                <div class="mb-3">
                    <label class="form-label">用户名</label>
                    <input type="text" name="username" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">密码</label>
                    <input type="password" name="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">登录</button>
            </form>
        </div>
    </div>
</body>
</html>
