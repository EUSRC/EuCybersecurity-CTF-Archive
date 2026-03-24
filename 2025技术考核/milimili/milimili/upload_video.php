<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>投稿 - Milimili</title>
    <link rel="stylesheet" href="assets/style.css">
    <style>
        .upload-center {
            text-align: center;
            padding: 100px;
        }

        .upload-box {
            border: 2px dashed #ccc;
            padding: 50px;
            width: 600px;
            margin: 0 auto;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .upload-box:hover {
            border-color: #fb7299;
            background: #fdf5f7;
        }

        .upload-icon {
            font-size: 48px;
            color: #ccc;
        }
    </style>
</head>

<body>
    <header class="milimili-header">
        <div class="header-left">
            <a href="index.php" class="logo">Milimili</a>
        </div>
    </header>

    <div class="upload-center">
        <div class="upload-box" onclick="alert('服务器磁盘已满，无法上传视频。')">
            <div class="upload-icon">☁️</div>
            <h2>拖拽视频到此处上传</h2>
            <p>或者点击选择文件</p>
        </div>
        <p style="margin-top: 20px; color: #999;">当前仅支持 .mp4 格式 (才怪)</p>
    </div>
</body>

</html>