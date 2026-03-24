<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>消息中心 - Milimili</title>
    <link rel="stylesheet" href="assets/style.css">
    <style>
        .msg-container {
            max-width: 800px;
            margin: 40px auto;
            background: white;
            border-radius: 8px;
            min-height: 500px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .msg-sidebar {
            width: 200px;
            float: left;
            border-right: 1px solid #eee;
            height: 500px;
        }

        .msg-sidebar ul {
            list-style: none;
        }

        .msg-sidebar li {
            padding: 15px 20px;
            cursor: pointer;
            color: #666;
        }

        .msg-sidebar li.active {
            color: #fb7299;
            background: #fdf5f7;
        }

        .msg-content {
            margin-left: 200px;
            padding: 20px;
        }

        .msg-item {
            padding: 20px;
            border-bottom: 1px solid #eee;
        }

        .msg-title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .msg-time {
            font-size: 12px;
            color: #999;
        }
    </style>
</head>

<body>
    <header class="milimili-header">
        <div class="header-left">
            <a href="index.php" class="logo">Milimili</a>
        </div>
    </header>

    <div class="msg-container">
        <div class="msg-sidebar">
            <ul>
                <li class="active">系统通知</li>
                <li>我的消息</li>
                <li>收到的赞</li>
            </ul>
        </div>
        <div class="msg-content">
            <div class="msg-item">
                <div class="msg-title">欢迎加入 Milimili！</div>
                <div class="msg-time">2025-10-24 10:24</div>
                <p>这里是只有黑客才知道的世界，请遵守《网络安全法》，不要做违法的事情哦。</p>
            </div>
            <div class="msg-item">
                <div class="msg-title">安全警告</div>
                <div class="msg-time">2025-10-25 00:00</div>
                <p>检测到您的账号存在异常登录，如果您不是本人，那太好了，反正我们也管不了。</p>
            </div>
        </div>
    </div>
</body>

</html>