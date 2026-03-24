<?php
require_once('config/db.php');
session_start();

// --- 核心逻辑 ---
if (!isset($_SESSION['uid'])) {
    header("Location: index.php");
    exit;
}

$user_id = (int)$_SESSION['uid'];
$role = $_SESSION['role'] ?? 'user';

// 获取用户信息
if (isset($conn)) {
    $stmt = $conn->prepare("SELECT id, username, role FROM users WHERE id = ? LIMIT 1");
    if (!$stmt) { die("Prepare failed: " . $conn->error); }
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result ? $result->fetch_assoc() : null;
} else {
    $user = ['id' => $user_id, 'username' => 'TestUser', 'role' => $role];
}

if (!$user) {
    session_destroy();
    die("用户不存在或会话已失效。");
}

function getVisitorIP(): string {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

// 伪造的系统日志 (线索)
$system_logs = [
    ['time' => date('H:i:s'), 'type' => 'INFO', 'msg' => '用户 ' . $user['username'] . ' 建立会话'],
    ['time' => date('H:i:s', time() - 120), 'type' => 'INFO', 'msg' => '计划任务: 每日索引更新完成'],
    ['time' => date('H:i:s', time() - 3600), 'type' => 'WARNING', 'msg' => '防火墙: 拦截来自 114.5.1.4 的 SQL 注入尝试'],
    ['time' => date('H:i:s', time() - 7200), 'type' => 'ERROR', 'msg' => 'Search Module: Syntax Error in /search.php'], 
    ['time' => date('H:i:s', time() - 14400), 'type' => 'INFO', 'msg' => 'Database: `flags` table backup completed.'], 
];

// 伪造的推荐内容 (适配横版图片)
// 这里的 cover 请使用你的横版图片，例如 assets/banner1.jpg
$hot_content = [
    ['title' => '【硬核】Web安全攻防实战教程', 'cover' => 'assets/book1.jpg', 'views' => '10.2万', 'tag' => '必看'],
    ['title' => '3小时速通 C++ 指针与内存管理', 'cover' => 'assets/book2.jpg', 'views' => '5.6万', 'tag' => '热门'],
    ['title' => '颈椎病康复指南 (程序员限定版)', 'cover' => 'assets/book3.jpg', 'views' => '233万', 'tag' => '养生'],
    ['title' => '删库跑路？MySQL 容灾备份详解', 'cover' => 'assets/book4.jpg', 'views' => '8000', 'tag' => '进阶'],
];
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>会员中心 - 次哩次哩</title>
    <style>
        :root {
            --bili-pink: #FB7299;
            --bili-blue: #00AEEC;
            --bg-body: #f1f2f3;
            --card-bg: #ffffff;
            --text-main: #18191C;
            --text-gray: #9499A0;
            --card-radius: 8px;
            --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
            --shadow-hover: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
            background-color: var(--bg-body);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* 导航栏 */
        .navbar {
            background: #fff;
            height: 60px;
            padding: 0 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            position: sticky;
            top: 0;
            z-index: 999;
        }

        .logo-box {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: bold;
            font-size: 18px;
            color: var(--bili-pink);
        }

        .nav-user {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 14px;
        }
        
        .nav-link { text-decoration: none; color: var(--text-gray); transition: 0.3s; }
        .nav-link:hover { color: var(--bili-blue); }

        /* 主布局 */
        .main-container {
            max-width: 1180px;
            margin: 20px auto;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            flex: 1;
        }

        /* 顶部 Banner 区 */
        .header-card {
            background: #fff;
            border-radius: var(--card-radius);
            box-shadow: var(--shadow-sm);
            margin-bottom: 20px;
            overflow: visible; 
        }
        
        .banner-img {
            height: 140px;
            background: url('assets/banner.png') center/cover no-repeat;
            background-color: #eee;
            border-radius: var(--card-radius) var(--card-radius) 0 0;
        }

        .user-row {
            padding: 0 24px 20px 180px;
            position: relative;
            min-height: 105px; /* 保持高度，防止头像挤压 */
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .avatar {
            position: absolute;
            left: 24px;
            top: -30px;
            width: 130px;
            height: 130px;
            border-radius: 50%;
            border: 4px solid #fff;
            background: url('assets/avatar.jpg') center/cover;
            background-color: #ddd;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 10;
        }

        .user-meta {
            padding-top: 12px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .username { font-size: 24px; font-weight: bold; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
        .user-role { font-size: 12px; padding: 1px 6px; border-radius: 3px; border: 1px solid currentColor; vertical-align: middle; }
        .role-admin { color: var(--bili-pink); border-color: var(--bili-pink); background: #fff0f6; }
        .role-user { color: var(--bili-blue); border-color: var(--bili-blue); background: #f0faff; }

        .stat-grid {
            display: flex;
            gap: 40px;
            text-align: center;
        }
        .stat-item .num { font-size: 20px; font-weight: bold; color: var(--text-main); }
        .stat-item .label { font-size: 12px; color: var(--text-gray); margin-top: 2px; }

        /* 内容双栏布局 */
        .content-wrapper {
            display: grid;
            grid-template-columns: 8fr 3fr;
            gap: 20px;
        }

        .card {
            background: #fff;
            border-radius: var(--card-radius);
            padding: 24px;
            box-shadow: var(--shadow-sm);
            margin-bottom: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover { box-shadow: var(--shadow-hover); }

        .card-header {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding-left: 10px;
            border-left: 4px solid var(--bili-pink);
            line-height: 1;
        }

        /* 视频/内容卡片网格 (适配横图) */
        .video-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr); /* 大图模式，一行两个 */
            gap: 20px;
        }
        
        .video-item {
            text-decoration: none;
            color: inherit;
            display: block;
            border-radius: 6px;
            overflow: hidden;
        }
        
        .video-cover {
            width: 100%;
            /* 关键修改：16:9 比例适配横图 */
            aspect-ratio: 16/9;
            background: #eee;
            border-radius: 6px;
            overflow: hidden;
            position: relative;
        }
        
        .video-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .video-item:hover .video-cover img { transform: scale(1.05); }
        
        /* 播放量/角标 */
        .video-info-overlay {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 30px 10px 6px;
            background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
            color: #fff;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .video-title { 
            font-size: 14px; 
            margin-top: 10px; 
            line-height: 1.4;
            height: 40px; /* 限制两行高度 */
            overflow: hidden; 
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .video-tag {
            position: absolute; top: 6px; right: 6px;
            background: var(--bili-pink); color: #fff;
            font-size: 10px; padding: 2px 6px; border-radius: 4px;
        }

        /* 日志样式 */
        .log-item {
            display: flex;
            font-size: 13px;
            padding: 10px 0;
            border-bottom: 1px dashed #eee;
            align-items: center;
        }
        .log-item:last-child { border: none; }
        
        .log-time { color: var(--text-gray); width: 80px; font-family: monospace; flex-shrink: 0; }
        .log-tag { width: 80px; font-weight: bold; flex-shrink: 0; }
        .log-msg { flex: 1; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .tag-INFO { color: var(--bili-blue); }
        .tag-WARNING { color: #f9c74f; }
        .tag-ERROR { color: #ff4d4f; }

        /* 侧边栏样式 */
        .server-status { margin-bottom: 15px; }
        .status-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-gray); margin-bottom: 5px; }
        .progress-bar { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--bili-blue); border-radius: 3px; }
        .fill-pink { background: var(--bili-pink); }

        .quick-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            background: #f6f7f8;
            border-radius: 8px;
            margin-bottom: 10px;
            text-decoration: none;
            color: #333;
            transition: all 0.2s;
            font-size: 14px;
        }
        .quick-btn:hover { background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); color: var(--bili-blue); }

        /* 页脚 */
        .footer {
            margin-top: 40px;
            background: #fff;
            padding: 30px 0;
            text-align: center;
            color: var(--text-gray);
            font-size: 12px;
            border-top: 1px solid #eee;
        }
        .footer p { margin: 5px 0; }
    </style>
</head>
<body>

    <nav class="navbar">
        <div class="logo-box">
            <svg viewBox="0 0 22 22" width="24" height="24" fill="currentColor"><path d="M16.5,4h-3.2l1.6-3.2C14.9,0.7,14.8,0.5,14.7,0.4C14.6,0.2,14.5,0.2,14.3,0.2l-0.1,0L11,3.4L7.8,0.2C7.7,0.1,7.5,0.1,7.3,0.2C7.2,0.3,7.1,0.5,7.1,0.7L8.7,4H5.5C2.5,4,0,6.5,0,9.5v8C0,20.5,2.5,23,5.5,23h11c3,0,5.5-2.5,5.5-5.5v-8C22,6.5,19.5,4,16.5,4z"/></svg>
            次哩次哩创作中心
        </div>
        <div class="nav-user">
            <span>Hi, <?= htmlspecialchars($user['username']) ?></span>
            <a href="logout.php" class="nav-link">[退出]</a>
        </div>
    </nav>

    <div class="main-container">
        <div class="header-card">
            <div class="banner-img"></div>
            <div class="user-row">
                <div class="avatar"></div>
                <div class="user-meta">
                    <div>
                        <div class="username">
                            <?= htmlspecialchars($user['username']) ?>
                            <?php if ($user['role'] === 'admin'): ?>
                                <span class="user-role role-admin">Lv.6 大会员 (Admin)</span>
                            <?php else: ?>
                                <span class="user-role role-user">Lv.1 注册会员</span>
                            <?php endif; ?>
                        </div>
                        <div style="font-size: 12px; color: #999;">UID: <?= (int)$user['id'] ?> · IP: <?= htmlspecialchars(getVisitorIP()) ?></div>
                    </div>
                    <div class="stat-grid">
                        <div class="stat-item"><div class="num">0</div><div class="label">关注</div></div>
                        <div class="stat-item"><div class="num">0</div><div class="label">粉丝</div></div>
                        <div class="stat-item"><div class="num">5</div><div class="label">获赞</div></div>
                        <div class="stat-item"><div class="num">2025</div><div class="label">节操值</div></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper">
            <div class="left-col">
                
                <div class="card">
                    <div class="card-header">
                        热门推荐
                        <span style="font-size: 12px; font-weight: normal; margin-left: auto; color: #999; cursor: pointer;">查看更多 ></span>
                    </div>
                    <div class="video-grid">
                        <?php foreach ($hot_content as $item): ?>
                            <a href="search.php?q=<?= urlencode($item['title']) ?>" class="video-item">
                                <div class="video-cover">
                                    <span class="video-tag"><?= $item['tag'] ?></span>
                                    <img src="<?= $item['cover'] ?>" onerror="this.style.backgroundColor='#e7e7e7'" alt="Cover">
                                    <div class="video-info-overlay">
                                        <span>▶ <?= $item['views'] ?></span>
                                        <span>4:03</span>
                                    </div>
                                </div>
                                <div class="video-title"><?= $item['title'] ?></div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">系统运行日志</div>
                    <div class="log-list">
                        <?php if ($user['role'] === 'admin'): ?>
                            <?php foreach ($system_logs as $log): ?>
                                <div class="log-item">
                                    <div class="log-time"><?= $log['time'] ?></div>
                                    <div class="log-tag tag-<?= $log['type'] ?>">[<?= $log['type'] ?>]</div>
                                    <div class="log-msg" title="<?= htmlspecialchars($log['msg']) ?>"><?= htmlspecialchars($log['msg']) ?></div>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div style="text-align: center; color: #999; padding: 20px;">
                                <div style="font-size: 40px; margin-bottom: 10px;">🛡️</div>
                                您无权查看系统底层日志
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <div class="right-col">
                <div class="card">
                    <div class="card-header">创作中心</div>
                    <a href="search.php" class="quick-btn">
                        <span>🎬 视频搜索系统</span>
                        <span>→</span>
                    </a>
                    <a href="#" class="quick-btn" onclick="alert('开发中')">
                        <span>☁️ 个人网盘</span>
                        <span>→</span>
                    </a>
                    <a href="#" class="quick-btn" onclick="alert('开发中')">
                        <span>⚙️ 账号设置</span>
                        <span>→</span>
                    </a>
                </div>

                <div class="card">
                    <div class="card-header">服务器负载</div>
                    <div class="server-status">
                        <div class="status-label"><span>CPU 使用率</span><span>42%</span></div>
                        <div class="progress-bar"><div class="progress-fill" style="width: 42%;"></div></div>
                    </div>
                    <div class="server-status">
                        <div class="status-label"><span>内存占用</span><span>86%</span></div>
                        <div class="progress-bar"><div class="progress-fill fill-pink" style="width: 86%;"></div></div>
                    </div>
                    <div class="server-status">
                        <div class="status-label"><span>今日访问量</span><span>11,4514</span></div>
                    </div>
                </div>

                <div class="card" style="padding: 0; overflow: hidden; height: 120px;">
                    <img src="assets/ad.jpg" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.backgroundColor='#f0f0f0'">
                </div>
            </div>
        </div>
    </div>

    <footer class="footer">
        <p>© 2025 CiliCili Technology Co., Ltd. All Rights Reserved.</p>
        <p>二次元ICP备 114514号-1 | 营业执照 | 侵权投诉</p>
    </footer>

</body>
</html>