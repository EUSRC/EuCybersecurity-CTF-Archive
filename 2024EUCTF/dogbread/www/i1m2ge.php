<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>面包艺术</title>
    <link rel="stylesheet" href="styles/image-styles.css">
    <script>
        let clickCount = 0;

        function handleClick() {
            clickCount++;
            if (clickCount === 2) {
                alert("小狗告诉你你想要的在: /secret.php");
                clickCount = 0; // 重置计数器
            }
        }
    </script>
</head>
<body>
    <div class="art-container">
        <h1>面包店里不起眼角落的一只小狗</h1>
        <img src="img/hidden_clue.php" alt="面包艺术" class="art-image" onclick="handleClick()">
        <p>也许你摸摸它会有不一样的收获呢</p>
    </div>
</body>
</html>
