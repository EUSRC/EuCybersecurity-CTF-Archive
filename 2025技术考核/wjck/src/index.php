<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件查看器 - CTF挑战</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>📁 文件查看器</h1>
        <p>这是一个简单的文件查看工具，可以查看网站上的各种文件。</p>
        
        <div class="file-list">
            <h2>可用文件：</h2>
            <ul>
                <li><a href="view.php?file=index.php">index.php</a></li>
                <li><a href="view.php?file=view.php">view.php</a></li>
                <li><a href="robots.txt">robots.txt</a></li>
            </ul>
        </div>
        
        <div class="custom-view">
            <h2>自定义文件查看：</h2>
            <form action="view.php" method="GET">
                <input type="text" name="file" placeholder="输入文件名" required>
                <button type="submit">查看文件</button>
            </form>
        </div>
        
        <div class="hint">
            <h3>💡 提示：</h3>
            <p>尝试查看一些隐藏文件...</p>
        </div>
    </div>
</body>
</html>