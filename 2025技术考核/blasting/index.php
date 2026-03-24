<?php
session_start();

$error = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // 题目逻辑保留：弱口令（CTF 用）
    if ($username === 'admin' && $password === 'admin1234') {
        $_SESSION['login'] = true;
        header("Location: admin.php");
        exit;
    } else {
        // 统一错误信息
        $error = "账号或密码错误，请重试"; 
    }
}
?>

<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>统一身份认证 | Unified Authentication</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
    :root {
        --primary-color: #1677ff; /* 企业蓝 */
        --hover-color: #4096ff;
        --bg-color: #f0f2f5;
        --text-main: #000000e0;
        --text-secondary: #00000073;
        --border-color: #d9d9d9;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: var(--bg-color);
        background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg'); /* 极简背景纹理 */
        background-repeat: no-repeat;
        background-position: center 110px;
        background-size: 100%;
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    /* 顶部 Logo 区域 */
    .header {
        padding: 32px 0;
        text-align: center;
    }
    .header-logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
    }
    .header-title {
        font-size: 33px;
        color: var(--text-main);
        font-weight: 600;
        position: relative;
        top: 2px;
    }

    /* 登录卡片 */
    .main {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 20px;
    }

    .login-box {
        width: 380px;
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 6px 16px -8px rgba(0,0,0,0.08), 0 9px 28px 0 rgba(0,0,0,0.05), 0 12px 48px 16px rgba(0,0,0,0.03);
        position: relative;
    }

    /* 模拟右上角扫码登录角标 */
    .qr-corner {
        position: absolute;
        top: 10px;
        right: 10px;
        color: var(--primary-color);
        font-size: 24px;
        cursor: pointer;
        opacity: 0.8;
    }

    .tab-title {
        font-size: 18px;
        margin-bottom: 25px;
        color: var(--text-main);
        font-weight: 500;
        border-bottom: 2px solid var(--primary-color);
        display: inline-block;
        padding-bottom: 4px;
    }

    .form-item {
        margin-bottom: 24px;
        position: relative;
    }

    .input-icon {
        position: absolute;
        left: 12px;
        top: 12px;
        color: var(--text-secondary);
        font-size: 14px;
    }

    input {
        width: 100%;
        height: 40px;
        padding: 4px 11px 4px 35px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 14px;
        color: var(--text-main);
        transition: all 0.3s;
        outline: none;
    }

    input:hover { border-color: var(--hover-color); }
    input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2); }

    button {
        width: 100%;
        height: 40px;
        background: var(--primary-color);
        border: none;
        border-radius: 4px;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 2px 0 rgba(0,0,0,0.045);
    }

    button:hover { background: var(--hover-color); }

    .extras {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        font-size: 14px;
    }
    
    .extras label { color: var(--text-main); cursor: pointer; }
    .extras a { color: var(--primary-color); text-decoration: none; }

    .divider {
        margin-top: 24px;
        border-top: 1px solid #f0f0f0;
        padding-top: 15px;
        display: flex;
        justify-content: space-between;
        color: var(--text-secondary);
        font-size: 12px;
    }
    .divider i { font-size: 18px; margin: 0 5px; cursor: pointer; transition: color 0.3s;}
    .divider i:hover { color: var(--primary-color); }

    .error-msg {
        background: #ffccc7;
        border: 1px solid #ff7875;
        color: #c02321;
        padding: 8px 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        font-size: 13px;
        display: flex;
        align-items: center;
    }
    .error-msg i { margin-right: 8px; }

    /* 底部版权 */
    .footer {
        text-align: center;
        color: var(--text-secondary);
        font-size: 14px;
        padding-bottom: 24px;
    }
    .footer div { margin-bottom: 8px; }
    .copyright { font-size: 12px; }
</style>
</head>

<body>

    <div class="header">
        <span style="font-size: 40px; color: var(--primary-color); margin-right: 10px;"><i class="fab fa-cloudscale"></i></span>
        <span class="header-title">Enterprise Cloud</span>
    </div>

    <div class="main">
        <div class="login-box">
            <i class="fas fa-qrcode qr-corner" title="切换扫码登录"></i>

            <div class="tab-title">账号密码登录</div>

            <?php if ($error): ?>
                <div class="error-msg">
                    <i class="fas fa-times-circle"></i> <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="post">
                <div class="form-item">
                    <i class="fas fa-user input-icon"></i>
                    <input type="text" name="username" placeholder="请输入账号" required autocomplete="off">
                </div>
                <div class="form-item">
                    <i class="fas fa-lock input-icon"></i>
                    <input type="password" name="password" placeholder="请输入密码" required>
                </div>

                <div class="extras">
                    <label><input type="checkbox"> 自动登录</label>
                    <a href="#">忘记密码</a>
                </div>

                <button type="submit">登 录</button>
            </form>

            <div class="divider">
                <span>其他登录方式</span>
                <div>
                    <i class="fab fa-weixin" title="微信"></i>
                    <i class="fab fa-qq" title="QQ"></i>
                    <i class="fab fa-alipay" title="支付宝"></i>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div>隐私政策 | 服务条款 | 帮助中心</div>
        <div class="copyright">Copyright © 2025 Enterprise Cloud Experience Technology Department</div>
    </div>

</body>
</html>