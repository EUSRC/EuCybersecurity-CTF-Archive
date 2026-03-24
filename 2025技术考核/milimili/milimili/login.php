<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录 - Milimili</title>
    <link rel="stylesheet" href="assets/style.css">
    <style>
        .login-box {
            width: 400px;
            margin: 100px auto;
            background: white;
            padding: 40px;
            text-align: center;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .login-logo {
            font-size: 32px;
            color: #fb7299;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .input-group {
            margin-bottom: 20px;
        }

        .input-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .login-btn {
            width: 100%;
            padding: 10px;
            background: #fb7299;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }

        .login-footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>

<body>
    <div class="login-box">
        <div class="login-logo">Milimili</div>
        <p>扫描二维码登录 (功能未开发)</p>
        <div class="input-group">
            <input type="text" placeholder="账号/邮箱/手机号" value="admin">
        </div>
        <div class="input-group">
            <input type="password" placeholder="密码" value="******">
        </div>
        <button class="login-btn" onclick="alert('你已经是管理员了，不需要登录！'); window.location.href='index.php';">登录</button>
        <div class="login-footer">
            注册账号 | 忘记密码
        </div>
    </div>
</body>

</html>