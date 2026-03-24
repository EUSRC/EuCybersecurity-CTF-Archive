<?php
require_once('config/db.php');
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // 模拟数据库连接
    if (isset($conn)) {
        $stmt = mysqli_prepare($conn, "SELECT id, username, password, role FROM users WHERE username = ? LIMIT 1");
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $username);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if ($result && mysqli_num_rows($result) === 1) {
                $user = mysqli_fetch_assoc($result);
                if ($password === $user['password']) {
                    $_SESSION['uid'] = (int)$user['id'];
                    $_SESSION['role'] = $user['role'];
                    header("Location: dashboard.php");
                    exit;
                }
            }
        }
    }
    $error = "账号或密码错误"; 
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录 - 次哩次哩</title>
    <style>
        :root {
            --bili-blue: #00AEEC;
            --bili-pink: #FB7299;
            --text-main: #212121;
            --text-gray: #999999;
            --border-color: #E7E7E7;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            background-color: #f4f5f7;
            background-image: url('https://s1.hdslb.com/bfs/static/jinkela/long/images/login_bg.png'); 
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            user-select: none;
        }

        .login-modal {
            background: #fff;
            width: 820px;
            height: 480px; /* 保持这个高度 */
            border-radius: 10px;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
            display: flex;
            position: relative;
            overflow: hidden;
        }

        .close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            z-index: 100;
            transition: transform 0.3s;
        }
        .close-btn:hover {
            transform: rotate(90deg);
            color: var(--bili-blue);
        }

        /* --- 左侧扫码区 --- */
        .scan-section {
            flex: 1;
            border-right: 1px solid #f0f0f0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-top: 40px;
            position: relative;
        }

        .scan-title {
            font-size: 18px;
            color: var(--text-main);
            margin-bottom: 20px;
            letter-spacing: 1px;
            font-weight: 500;
        }

        .qr-box {
            width: 170px;
            height: 170px;
            background: #fff;
            border: 1px solid #e7e7e7;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
            position: relative;
            cursor: help;
            transition: box-shadow 0.3s;
        }
        
        .qr-box:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .qr-img {
            width: 100%;
            height: 100%;
            background-image: url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Flag%20is%20not%20here%20:)%20Try%20Brute%20Force'); 
            background-size: cover;
            opacity: 0.9;
            transition: opacity 0.3s;
        }
        
        .troll-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            text-align: center;
            color: var(--bili-pink);
            font-weight: bold;
            font-size: 15px;
            line-height: 1.6;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }

        .qr-box:hover .qr-img { opacity: 0.05; }
        .qr-box:hover .troll-text { opacity: 1; }

        .scan-hint {
            font-size: 14px;
            color: var(--text-main);
            margin-top: 10px;
            text-align: center;
        }
        .scan-hint span {
            color: var(--bili-blue);
            cursor: pointer;
        }

        /* --- 右侧表单区 --- */
        .form-section {
            flex: 1.25;
            /* 关键修改：增加顶部 padding，并使用 justify-content center 来辅助垂直居中 */
            padding: 50px 60px 40px 60px; 
            display: flex;
            flex-direction: column;
            justify-content: center; /* 让内容块在垂直方向上居中 */
            position: relative;
        }

        .tabs {
            display: flex;
            /* 关键修改：增加底部 margin，把输入框往下推 */
            margin-bottom: 45px; 
            font-size: 18px;
            /* 由于加了 justify-content center，这里 margin-top: auto 可以确保 tab 不会被挤到太下面，
               但实际上 flex column 布局下 margin-bottom 够大就行 */
        }

        .tab-item {
            margin-right: 40px;
            cursor: pointer;
            color: var(--text-main);
            position: relative;
            font-weight: 500;
        }
        
        .tab-item:last-child {
            color: var(--text-gray);
            font-weight: 400;
        }
        
        .tab-item.active {
            color: var(--bili-blue);
        }
        
        .tab-item.active::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            height: 3px;
            background-color: var(--bili-blue);
            border-radius: 2px;
        }

        .input-group {
            border: 1px solid var(--border-color);
            border-radius: 6px;
            margin-bottom: 24px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: border-color 0.3s;
        }
        
        .input-group:focus-within {
            border-color: var(--bili-blue);
        }
        
        .input-row {
            display: flex;
            align-items: center;
            /* 关键修改：再次增加垂直 padding，让输入框显得更高、不那么拥挤 */
            padding: 18px 20px; 
            position: relative;
            background: #fff;
        }
        
        .input-row:first-child {
            border-bottom: 1px solid var(--border-color);
        }

        .input-label {
            width: 70px;
            font-size: 14px;
            color: #212121;
            font-weight: 600;
        }

        .form-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 14px;
            color: var(--text-main);
            line-height: 20px;
        }
        .form-input::placeholder { color: #ccc; }

        .forget-pwd {
            font-size: 12px;
            color: var(--bili-blue);
            text-decoration: none;
            cursor: pointer;
            white-space: nowrap;
            margin-left: 10px;
        }

        .btn-group {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            gap: 20px;
        }

        .btn {
            flex: 1;
            height: 44px;
            border-radius: 4px;
            border: none;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            letter-spacing: 2px;
        }

        .btn-register {
            background: #fff;
            border: 1px solid #dcdfe6;
            color: var(--text-main);
        }
        .btn-register:hover {
            border-color: var(--bili-blue);
            color: var(--bili-blue);
        }

        .btn-login {
            background: var(--bili-blue);
            color: #fff;
        }
        .btn-login:hover {
            background-color: #00a1d6;
        }

        .other-login {
            /* 之前用 margin-top: auto 推到底部，现在因为用了 justify-content: center，这里直接给固定 margin */
            margin-top: 40px; 
            text-align: center;
            font-size: 12px;
            color: #999;
        }

        .sns-icons {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-top: 15px;
        }

        .sns-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .sns-icon:hover { transform: scale(1.1); }
        .wx { background: #46bb36; }
        .wb { background: #eb4f38; }
        .qq { background: #00aeec; }

        .error-msg {
            color: #f25d8e;
            font-size: 13px;
            margin-bottom: 15px;
            text-align: center;
            animation: shake 0.5s;
            background: #ffe6ef;
            padding: 8px;
            border-radius: 4px;
        }
        
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }

        .mascot-22 {
            position: absolute;
            bottom: 0; left: 0;
            width: 110px; height: 110px;
            background: url('https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login/img/22_33_2.png') no-repeat;
            background-size: contain;
            transform: translate(-20%, 30%) scale(1.5);
            pointer-events: none;
        }
        .mascot-33 {
            position: absolute;
            bottom: 0; right: 0;
            width: 120px; height: 120px;
            background: url('https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login/img/22_33_2.png') no-repeat;
            background-size: contain;
            transform: translate(25%, 30%) scale(1.5) scaleX(-1);
            pointer-events: none;
        }
    </style>
</head>
<body>

<div class="login-modal">
    <div class="close-btn" onclick="alert('这是CTF题目，关了你怎么做题？(￢_￢)')">×</div>

    <div class="scan-section">
        <div class="scan-title">扫描二维码登录</div>
        <div class="qr-box">
            <div class="qr-img"></div>
            <div class="troll-text">
                别扫了<br>没有Flag<br>去爆破密码!
            </div>
        </div>
        <div class="scan-hint">
            请使用 <span onclick="alert('并没有这个APP')">次哩次哩客户端</span><br>
            扫码登录或扫码下载APP
        </div>
        <div class="mascot-22"></div>
    </div>

    <div class="form-section">
        <div class="tabs">
            <div class="tab-item active">密码登录</div>
            <div class="tab-item" onclick="alert('短信服务太贵了，没钱开通，你还是爆破密码吧。')">短信登录</div>
        </div>

        <?php if ($error): ?>
            <div class="error-msg"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="input-group">
                <div class="input-row">
                    <label class="input-label">账号</label>
                    <input type="text" name="username" class="form-input" placeholder="请输入账号" autocomplete="off" required>
                </div>
                <div class="input-row">
                    <label class="input-label">密码</label>
                    <input type="password" name="password" class="form-input" placeholder="请输入密码" autocomplete="off" required>
                    <a href="javascript:;" class="forget-pwd" onclick="alert('忘记密码？我也忘了，我记得好像是4位数字呢。')">忘记密码?</a>
                </div>
            </div>

            <div class="btn-group">
                <button type="button" class="btn btn-register" onclick="alert('注册功能维护中...\n(其实是不想让你注册)')">注册</button>
                <button type="submit" class="btn btn-login">登录</button>
            </div>
        </form>

        <div class="other-login">
            <div>其他方式登录</div>
            <div class="sns-icons">
                <div class="sns-icon wx" onclick="alert('微信登录接口：404 Not Found')">微</div>
                <div class="sns-icon wb" onclick="alert('微博：Flag 不在这里')">博</div>
                <div class="sns-icon qq" onclick="alert('QQ：你号没了')">Q</div>
            </div>
        </div>

        <div class="mascot-33"></div>
    </div>
</div>

<script>
    document.addEventListener('contextmenu', function(e) {
         e.preventDefault(); 
    });

    console.log("%c 嘿！看这里！", "color: #00AEEC; font-size: 20px; font-weight: bold;");
    console.log("%c Flag 不在 Console 里，别翻了。去burp抓包爆破吧少年。", "color: #FB7299; font-size: 14px;");
</script>

</body>
</html>