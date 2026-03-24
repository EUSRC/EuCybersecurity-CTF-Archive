<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>别吵醒他</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-image: url("lan.jpg"); /* 替换为您的背景图链接 */
            background-size: cover;
            color: black; /* 设置文字颜色为白色，以便在背景图上可见 */
            text-align: center; /* 设置文本居中 */
        }
        #flag {
            font-size: 3em; /* 设置字体大小为3倍基础字体大小 */
            margin: 0; /* 移除默认的外边距 */
        }
    </style>
</head>
<body>
    <div class="container">
        <?php
        if (isset($_POST['sheep']) && $_POST['sheep'] == 'lan') {
            echo "<h1 id='flag'>/flag.php</h1>"; 
        }
        ?>
    </div>
    </div>
                <!--
        $sheep=$_POST['sheep'];
        echo $sheep;
        if($sheep=='lan'){
            echo 'Syc{good_good_good}';
        }
        -->
      <div>
</body>
</html>