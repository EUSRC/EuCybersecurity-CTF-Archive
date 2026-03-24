<?php
include 'config.php';

// 过滤cat flag/cat /flag（包括script内部）
function filterCatFlag($content) {
    // 匹配cat flag/cat /flag及其变体（忽略大小写、空格）
    $pattern = '/\bcat\s+\/?\s*flag\b/i';
    // 替换为无害文本，同时处理script内部的关键词
    $content = preg_replace($pattern, '[禁止的命令]', $content);
    return $content;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>挑战留言板</title>
    <link rel="stylesheet" href="static/style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>留言板</h1>
            <p>发表一下你本次比赛的收获</p>
        </div>

        <div class="main-content">
            <div class="left-panel">
                <div class="message-form card">
                    <h2>📝 发布留言</h2>
                    <form action="post.php" method="POST">
                        <div class="input-group">
                            <label for="author">昵称：</label>
                            <input type="text" id="author" name="author" placeholder="请输入您的昵称（可选）" maxlength="50">
                        </div>
                        <div class="input-group">
                            <label for="message">留言内容：</label>
                            <textarea id="message" name="message" placeholder="在这里写下您的留言..." required maxlength="500"></textarea>
                        </div>
                        <button type="submit" class="submit-btn">发布留言</button>
                    </form>
                </div>
            </div>
            
            <div class="right-panel">
                <div class="messages card">
                    <h2>📋 最新留言</h2>
                    <?php if (empty($_SESSION['messages'])): ?>
                        <div class="no-messages">
                            <div class="empty-icon">💬</div>
                            <p>还没有留言，快来第一个发言吧！</p>
                        </div>
                    <?php else: ?>
                        <div class="messages-list">
                            <?php foreach (array_reverse($_SESSION['messages']) as $index => $msg): ?>
                                <div class="message">
                                    <div class="message-header">
                                        <div class="author">
                                            <span class="avatar"><?php echo $msg['author'] ? '👤' : '🤖'; ?></span>
                                            <strong><?php echo htmlspecialchars($msg['author'] ?: '匿名用户'); ?></strong>
                                        </div>
                                        <span class="timestamp"><?php echo $msg['time']; ?></span>
                                    </div>
                                    <div class="message-content">
                                       
                                        <?php echo filterCatFlag($msg['message']); ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
<!-- 这里没你想要的别看了 -->
   <script src="message-scripts.js"></script>

</body>
</html>