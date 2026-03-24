<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Milimili (゜-゜)つロ 干杯~</title>
    <link rel="icon" href="assets/images/favicon.png" type="image/png">
    <link rel="stylesheet" href="assets/style.css">
</head>

<body>

    <!-- Header -->
    <header class="milimili-header">
        <div class="header-left">
            <span class="logo">Milimili</span>
            <div class="nav-links">
                <a href="#">首页</a>
                <a href="#">番剧</a>
                <a href="#">直播</a>
                <a href="#">游戏中心</a>
            </div>
        </div>

        <div class="header-center">
            <div class="search-bar">
                <input type="text" placeholder="CTF 0day 漏洞挖掘">
                <button class="search-btn">搜索</button>
            </div>
        </div>

        <div class="header-right">
            <a href="user.php" class="user-profile">
                <div class="avatar-container">
                    <img src="assets/images/favicon.png" alt="Avatar" id="current-avatar">
                </div>
            </a>
            <a href="vip.php" class="header-btn">大会员</a>
            <a href="message.php" class="header-btn">消息</a>
            <a href="upload_video.php" class="header-btn highlight">投稿</a>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-container">

        <!-- Banner/Carousel Area (Simplified as one big banner) -->
        <div class="banner-section">
            <div class="banner-content">
                <h1>欢迎来到 Milimili CTF 专区</h1>
                <p>只有黑客才知道的世界</p>
            </div>
        </div>

        <!-- Video Grid -->
        <div class="video-grid-header">
            <h2><span class="icon">📺</span> 热门推荐</h2>
            <a href="#" class="more-link">查看更多 ></a>
        </div>

        <div class="video-grid">
            <!-- Video 1 -->
            <a href="/404.php" class="video-card">
                <div class="video-thumbnail">
                    <img src="assets/images/ctf.png" alt="CTF 7 Days">
                    <span class="duration">10:24</span>
                </div>
                <div class="video-info">
                    <h3 class="video-title">0基础7天通关CTF，学会这招你也是黑客大佬！</h3>
                    <div class="video-meta">
                        <span class="up-name">UP: 极客小明</span>
                        <span class="play-count">▶ 1003.2万</span>
                    </div>
                </div>
            </a>

            <!-- Video 2 -->
            <a href="/404.php" class="video-card">
                <div class="video-thumbnail">
                    <img src="assets/images/prison.png" alt="Prison">
                    <span class="duration">03:15</span>
                </div>
                <div class="video-info">
                    <h3 class="video-title">从入门到入狱：信息安全法律法规解读(第一期)</h3>
                    <div class="video-meta">
                        <span class="up-name">UP: 法外狂徒</span>
                        <span class="play-count">▶ 54.1万</span>
                    </div>
                </div>
            </a>

            <!-- Video 3 -->
            <a href="/404.php" class="video-card">
                <div class="video-thumbnail">
                    <img src="assets/images/webshell.png" alt="Webshell">
                    <span class="duration">23:59</span>
                </div>
                <div class="video-info">
                    <h3 class="video-title">【实战】手把手教你上传Webshell (仅供教学)</h3>
                    <div class="video-meta">
                        <span class="up-name">UP: 安全并不是绝对的</span>
                        <span class="play-count">▶ 88.8万</span>
                    </div>
                </div>
            </a>

            <!-- Video 4 -->
            <a href="/404.php" class="video-card">
                <div class="video-thumbnail">
                    <img src="assets/images/drama.png" alt="Drama">
                    <span class="duration">05:20</span>
                </div>
                <div class="video-info">
                    <h3 class="video-title">震惊！某高校CTF战队竟然为了Flag做出这种事...</h3>
                    <div class="video-meta">
                        <span class="up-name">UP: 吃瓜前线</span>
                        <span class="play-count">▶ 233.3万</span>
                    </div>
                </div>
            </a>

            <!-- Video 5 -->
            <a href="/404.php" class="video-card">
                <div class="video-thumbnail">
                    <img src="assets/images/php_vs_java.png" alt="PHP vs Java">
                    <span class="duration">12:00</span>
                </div>
                <div class="video-info">
                    <h3 class="video-title">PHP是世界上最好的语言？Java程序员看完沉默了</h3>
                    <div class="video-meta">
                        <span class="up-name">UP: 语言之争</span>
                        <span class="play-count">▶ 999+</span>
                    </div>
                </div>
            </a>

            <!-- Video 6 -->
            <a href="/404.php" class="video-card">
                <div class="video-thumbnail">
                    <img src="assets/images/clickbait_flag.png" alt="Free Flag">
                    <span class="duration">01:00</span>
                </div>
                <div class="video-info">
                    <h3 class="video-title">Flag在这里！不看后悔一辈子！</h3>
                    <div class="video-meta">
                        <span class="up-name">UP: 骗子</span>
                        <span class="play-count">▶ 1</span>
                    </div>
                </div>
            </a>
        </div>
    </main>

    <footer class="milimili-footer">
        <p>© 2025 Milimili - 咪哩咪哩 (゜-゜)つロ 干杯~-fake-CTF-Edition</p>
        <!-- 开发者日记: 听说 .php 被禁止上传了？还好我以前写过 .phtml 的兼容代码... 应该没事吧？ -->
    </footer>

    <script src="assets/script.js"></script>
</body>

</html>