<?php
require_once('config/db.php');
session_start();

// 1. 权限检查
if (!isset($_SESSION['uid'])) {
    header("Location: index.php");
    exit;
}

$q = $_GET['q'] ?? '';
$rows = [];
$sql = "";

if ($q !== '') {
    // 漏洞点：直接拼接字符串，存在 SQL 注入 (考点保留)
    // 表名改成 videos，列名 author 改成 uploader
$sql = "SELECT id, title, uploader FROM videos WHERE title LIKE '%$q%' ORDER BY id DESC";
    
    // 模拟数据库查询 (CTF环境请确保 $conn 存在)
    if (isset($conn)) {
        $res = mysqli_query($conn, $sql);
        if ($res) {
            while ($r = mysqli_fetch_assoc($res)) {
                $rows[] = $r;
            }
        }
    } else {
        // 无数据库时的演示数据 (改成视频风格)
        if (stripos($q, 'sql') !== false || $q === '') {
            $rows[] = ['id' => 10086, 'title' => '【教程】SQL 注入从入门到删库', 'author' => '极客张三'];
            $rows[] = ['id' => 10010, 'title' => '高性能 MySQL 调优实战', 'author' => 'DBA老王'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>视频检索 - 次哩次哩后台</title>
    <style>
        /* 复用 dashboard.php 的核心变量，保持风格统一 */
        :root {
            --bili-pink: #FB7299;
            --bili-blue: #00AEEC;
            --bg-gray: #f9fafc;
            --card-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
            --text-main: #18191C;
            --text-gray: #9499A0;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
            background-color: var(--bg-gray);
            color: var(--text-main);
        }

        /* 顶部导航 */
        .navbar {
            background: #fff;
            height: 64px;
            padding: 0 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0,0,0,0.02);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo {
            font-weight: bold;
            font-size: 18px;
            color: var(--bili-blue);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .back-link {
            font-size: 14px;
            color: var(--text-gray);
            text-decoration: none;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .back-link:hover { color: var(--bili-blue); }

        /* 主容器 */
        .container {
            max-width: 900px;
            margin: 40px auto;
            padding: 0 20px;
        }

        /* 搜索区域卡片 */
        .search-card {
            background: #fff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: var(--card-shadow);
            text-align: center;
            margin-bottom: 24px;
        }

        .page-title {
            font-size: 24px;
            margin-bottom: 30px;
            color: var(--text-main);
            font-weight: 500;
        }

        /* 搜索框样式 */
        .search-box {
            display: flex;
            max-width: 600px;
            margin: 0 auto;
            position: relative;
        }

        .search-input {
            flex: 1;
            height: 48px;
            padding: 0 20px;
            border: 2px solid #e3e5e7;
            border-right: none;
            border-radius: 8px 0 0 8px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s;
            color: var(--text-main);
        }

        .search-input:focus {
            border-color: var(--bili-blue);
        }

        .search-btn {
            height: 52px; /* border 2px + height 48px */
            padding: 0 32px;
            background: var(--bili-blue);
            color: #fff;
            border: none;
            border-radius: 0 8px 8px 0;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
            font-weight: 500;
        }

        .search-btn:hover {
            background: #00a1d6;
        }

        /* 调试控制台 (SQL回显) - CTF的重要部分 */
        .debug-console {
            margin-top: 30px;
            text-align: left;
            background: #f6f7f8;
            border-left: 4px solid var(--bili-pink);
            padding: 15px 20px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            color: #61666d;
            overflow-x: auto;
        }
        
        .debug-label {
            font-weight: bold;
            color: var(--bili-pink);
            margin-bottom: 5px;
            display: block;
        }

        /* 结果区域 */
        .result-card {
            background: #fff;
            border-radius: 12px;
            padding: 24px;
            box-shadow: var(--card-shadow);
            min-height: 200px;
        }

        .result-header {
            font-size: 16px;
            color: var(--text-gray);
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
        }

        /* 表格样式 */
        .clean-table {
            width: 100%;
            border-collapse: collapse;
        }

        .clean-table th {
            text-align: left;
            color: #999;
            font-weight: 400;
            padding: 12px 16px;
            font-size: 14px;
        }

        .clean-table td {
            padding: 16px;
            color: var(--text-main);
            border-bottom: 1px solid #f4f5f7;
            font-size: 14px;
        }

        .clean-table tr:last-child td {
            border-bottom: none;
        }

        .clean-table tbody tr {
            transition: background 0.2s;
        }

        .clean-table tbody tr:hover {
            background-color: #f9f9f9;
        }

        .empty-state {
            text-align: center;
            padding: 40px 0;
            color: var(--text-gray);
        }

        .empty-icon {
            font-size: 48px;
            margin-bottom: 10px;
            display: block;
            opacity: 0.5;
        }
    </style>
</head>
<body>

    <nav class="navbar">
        <div class="logo">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            次哩次哩视频管理系统
        </div>
        <a href="dashboard.php" class="back-link">
            <span>←</span> 返回创作中心
        </a>
    </nav>

    <div class="container">
        <div class="search-card">
            <h2 class="page-title">视频检索</h2>
            <form method="GET" action="">
                <div class="search-box">
                    <input type="text" name="q" class="search-input" value="<?= htmlspecialchars($q, ENT_QUOTES, 'UTF-8') ?>" placeholder="请输入视频标题或AV号..." autocomplete="off">
                    <button type="submit" class="search-btn">搜索</button>
                </div>
            </form>

            <?php if ($sql): ?>
                <div class="debug-console">
                    <span class="debug-label">⚡ SQL DEBUG LOG:</span>
                    <code><?= htmlspecialchars($sql, ENT_QUOTES, 'UTF-8') ?></code>
                </div>
            <?php endif; ?>
        </div>

        <div class="result-card">
            <div class="result-header">
                <span>检索结果</span>
                <?php if ($q !== ''): ?>
                    <span>找到 <?= count($rows) ?> 个视频</span>
                <?php endif; ?>
            </div>

            <?php if ($q === ''): ?>
                <div class="empty-state">
                    <span class="empty-icon">📺</span>
                    <div>请输入关键词开始检索</div>
                </div>
            <?php elseif (!$rows): ?>
                <div class="empty-state">
                    <span class="empty-icon">🍃</span>
                    <div>没有找到相关视频</div>
                    <div style="font-size: 12px; margin-top: 5px;">换个词试试？</div>
                </div>
            <?php else: ?>
                <table class="clean-table">
                    <thead>
                        <tr>
                            <th width="100">AV号 (ID)</th>
                            <th>视频标题</th>
                            <th width="150">UP主</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($rows as $r): ?>
                            <tr>
                                <td style="color: var(--text-gray); font-family: monospace;">av<?= htmlspecialchars($r['id']) ?></td>
                                <td style="font-weight: 500;">
                                    <span style="color: #FB7299; border: 1px solid #FB7299; border-radius: 3px; font-size: 12px; padding: 0 4px; margin-right: 5px;">投稿</span>
                                    <?= htmlspecialchars($r['title']) ?>
                                </td>
                                <td><?= htmlspecialchars($r['uploader']) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
        
    </div>

</body>
</html>