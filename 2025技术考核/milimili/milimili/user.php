<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>个人中心 - Milimili</title>
    <link rel="stylesheet" href="assets/style.css">
    <style>
        .user-header-banner {
            background-image: url('https://picsum.photos/1200/200?blur=5');
            background-size: cover;
            height: 200px;
            position: relative;
        }

        .user-info-bar {
            background: white;
            padding: 20px 40px;
            display: flex;
            align-items: flex-end;
            position: relative;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .big-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 4px solid white;
            position: absolute;
            top: -40px;
            left: 40px;
            background: #fff;
            overflow: hidden;
            cursor: pointer;
        }

        .big-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .big-avatar .change-hint {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            font-size: 10px;
            text-align: center;
            padding: 2px 0;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .big-avatar:hover .change-hint {
            opacity: 1;
        }

        .user-text {
            margin-left: 120px;
        }

        .user-name {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .level-tag {
            font-size: 12px;
            background: #fb7299;
            color: white;
            padding: 1px 6px;
            border-radius: 4px;
        }

        .user-stats {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: #61666d;
        }
    </style>
</head>

<body>

    <!-- Header -->
    <header class="milimili-header">
        <div class="header-left">
            <a href="index.php" class="logo">Milimili</a>
            <div class="nav-links">
                <a href="index.php">首页</a>
                <a href="#">番剧</a>
                <a href="#">直播</a>
                <a href="#">游戏中心</a>
            </div>
        </div>

        <div class="header-right">
            <a href="user.php" class="user-profile">
                <div class="avatar-container">
                    <img src="assets/images/favicon.png" alt="Avatar">
                </div>
            </a>
            <a href="vip.php" class="header-btn">大会员</a>
            <a href="message.php" class="header-btn">消息</a>
            <a href="upload_video.php" class="header-btn highlight">投稿</a>
        </div>
    </header>

    <div class="main-container">
        <div class="user-header-banner"></div>
        <div class="user-info-bar">
            <!-- Avatar Upload Trigger -->
            <div class="big-avatar" onclick="document.getElementById('avatar-input').click()">
                <img src="assets/images/favicon.png" id="profile-avatar">
                <div class="change-hint">更换头像</div>
            </div>

            <div class="user-text">
                <div class="user-name">
                    Admin
                    <span class="level-tag">Lv6</span>
                </div>
                <div class="user-stats">
                    <span>关注 0</span>
                    <span>粉丝 10万</span>
                    <span>获赞 999+</span>
                </div>
            </div>

            <div style="margin-left: auto;">
                <button class="header-btn highlight" style="border: none; cursor: pointer;">编辑资料</button>
            </div>
        </div>

        <div style="margin-top: 20px; text-align: center; color: #999; padding: 50px;">
            <h3>我的投稿</h3>
            <p>空空如也~ 快去投稿吧！</p>
        </div>
    </div>

    <!-- Hidden Upload Form -->
    <form id="upload-form" action="upload.php" method="POST" enctype="multipart/form-data" style="display: none;">
        <input type="file" name="file" id="avatar-input" onchange="uploadFile()">
    </form>

    <script src="assets/script.js"></script>
</body>

</html>