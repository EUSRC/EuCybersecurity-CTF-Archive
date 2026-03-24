<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件内容 - CTF挑战</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>📄 文件内容查看器</h1>
        
        <?php
        if (isset($_GET['file'])) {
            $filename = $_GET['file'];
            echo "<h2>正在查看: " . htmlspecialchars($filename) . "</h2>";
            if (file_exists($filename)) {
                echo "<div class='file-content'>";
                echo "<h3>文件内容:</h3>";
                echo "<pre>";
                highlight_file($filename);
                echo "</pre>";
                echo "</div>";
            } else {
                echo "<div class='error'>文件不存在: " . htmlspecialchars($filename) . "</div>";
            }
        } else {
            echo "<div class='error'>请指定要查看的文件</div>";
        }
        ?>
        
        <br>
        <a href="index.php" class="back-link">← 返回首页</a>
    </div>
</body>
</html>