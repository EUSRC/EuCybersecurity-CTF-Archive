<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>神秘的秘密</title>
    <link rel="stylesheet" href="styles/secret-styles.css">
</head>
<body>
    <div class="secret-container">
        <header class="header">
            <h1>神秘区域</h1>
        </header>
        <main class="main-content">
            <?php
            if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['f']) && $_POST['f'] === 'love') {
                echo "<p class='success-message'>恭喜你！你找到了秘密配方：</p>";
                echo "<code class='secret-code'>flag{testflag}</code>";
            } else {
                echo "<p class='error-message'>面包小狗很开心地告诉你，秘密参数是: <strong>f=love</strong>，成功传参就能拿到你想要的了。</p>";
            }
            ?>
        </main>
        <footer class="footer">
            <p>原来面包小狗也是有人爱的！</p>
        </footer>
    </div>
</body>
</html>
