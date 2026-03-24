<?php
session_start();

if (!isset($_SESSION['login'])) {
    header("Location: index.php");
    exit;
}

// 读取 flag (逻辑保留)
$flag = "Flag file not found";

$flag_path = "/flag";
if (file_exists($flag_path)) {
    $flag = trim(file_get_contents($flag_path));
}
?>

<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>控制台 - 管理中心</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
    :root {
        --nav-bg: #001529;
        --nav-text: #fff;
        --primary: #1677ff;
        --bg: #f0f2f5;
    }
    
    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        background: var(--bg);
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    /* 顶部导航栏 */
    .navbar {
        height: 64px;
        background: var(--nav-bg);
        color: var(--nav-text);
        display: flex;
        align-items: center;
        padding: 0 24px;
        box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
    
    .logo {
        font-size: 18px;
        font-weight: 600;
        margin-right: 40px;
        display: flex;
        align-items: center;
    }
    .logo i { margin-right: 10px; color: var(--primary); }

    .user-info {
        margin-left: auto;
        font-size: 14px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .avatar {
        width: 24px;
        height: 24px;
        background: #1890ff;
        border-radius: 50%;
        margin-right: 8px;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
    }

    /* 主内容区 */
    .container {
        padding: 24px;
        flex: 1;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
    }

    /* 面包屑 */
    .breadcrumb {
        margin-bottom: 16px;
        color: #00000073;
        font-size: 14px;
    }

    /* 卡片风格 */
    .card {
        background: #fff;
        border-radius: 2px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12), 0 5px 12px 4px rgba(0,0,0,0.09);
    }

    .welcome-header h1 {
        font-size: 20px;
        font-weight: 500;
        color: #000000d9;
        margin-bottom: 8px;
    }
    .welcome-header p {
        color: #00000073;
        font-size: 14px;
    }

    /* Flag 展示区 */
    .flag-section {
        margin-top: 30px;
    }
    .flag-label {
        font-size: 14px;
        font-weight: 500;
        color: #000000d9;
        margin-bottom: 10px;
        display: block;
    }

    .flag-box {
        background: #f5f5f5;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 16px;
        font-family: 'Consolas', 'Monaco', monospace;
        color: var(--primary);
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .status-badge {
        background: #f6ffed;
        border: 1px solid #b7eb8f;
        color: #52c41a;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 4px;
    }
</style>
</head>

<body>

    <nav class="navbar">
        <div class="logo"><i class="fab fa-cloudscale"></i> Enterprise Cloud Console</div>
        <div class="nav-links">
            <span style="opacity: 0.7; font-size: 14px; margin-right: 20px;">产品</span>
            <span style="opacity: 0.7; font-size: 14px;">解决方案</span>
        </div>
        <div class="user-info">
            <div class="avatar">A</div>
            <span>admin</span>
        </div>
    </nav>

    <div class="container">
        <div class="breadcrumb">首页 / 管理控制台 / 系统详情</div>

        <div class="card welcome-header">
            <h1>欢迎回来，管理员</h1>
            <p>上次登录时间：<?php echo date("Y-m-d H:i:s"); ?> | 登录IP：<?php echo $_SERVER['REMOTE_ADDR']; ?></p>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 20px; font-size: 16px;">敏感数据访问 (Secret Key)</h3>
            
            <div class="flag-section">
                <span class="flag-label">系统核心 Flag 密钥：</span>
                <div class="flag-box">
                    <span><?php echo htmlspecialchars($flag); ?></span>
                    <span class="status-badge"><i class="fas fa-check-circle"></i> 已验证</span>
                </div>
                <p style="margin-top: 10px; color: #999; font-size: 12px;">
                    <i class="fas fa-info-circle"></i> 该密钥仅超级管理员可见，请勿泄露给第三方。
                </p>
            </div>
        </div>
    </div>

</body>
</html>