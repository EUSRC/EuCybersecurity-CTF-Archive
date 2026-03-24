<?php
// 上传目录常量定义
define('UPLOAD_PATH', 'uploads/');

// 删除文件名末尾的点
function deldot($filename) {
    return rtrim($filename, '.');
}

$is_upload = false;
$msg = null;

if (isset($_FILES['userfile'])) {
    if (file_exists(UPLOAD_PATH)) {
        // 禁止上传的文件扩展名列表
        $deny_ext = array(".php");
        $file_name = trim($_FILES['userfile']['name']);
        $file_ext = strrchr($file_name, '.'); // 获取扩展名
        $file_name = deldot($file_name); // 删除文件名末尾的点
        $file_ext = strtolower($file_ext); // 转换为小写
        $file_ext = str_ireplace('::$DATA', '', $file_ext); // 去除特殊字符串
        $file_ext = trim($file_ext); // 收尾去空

        if (!in_array($file_ext, $deny_ext)) {
            $uploaddir = 'uploads/';
            $uploadfile = $uploaddir . basename($file_name);
            
            if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
                $is_upload = true;
                $msg = "文件上传成功！路径：$uploadfile";
            } else {
                $msg = "文件上传失败！";
            }
        } else {
            $msg = "此文件扩展名不允许上传！";
        }
    } else {
        $msg = UPLOAD_PATH . " 文件夹不存在，请手工创建！";
    }
}

if ($msg) {
    echo $msg;
}
?>


<html>
<head>
    <meta charset="utf-8">
    <title>熊二想吃蜂蜜了</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-image: url("1675668164514207.jpg");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        form {
            position: absolute;
            top: 0;
            left: 0;
            margin: 10px;
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
        }
        input[type="file"] {
            margin-bottom: 5px;
        }
        .error-message {
            color: red;
            margin-top: 10px;
        }
        #codeDisplay {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-height: 300px;
            overflow: auto;
            z-index: 10;
        }
        #toggleCodeButton {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            cursor: pointer;
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <form action="flag.php" method="POST" enctype="multipart/form-data" onsubmit="return validateFile()">
        <input type="file" name="userfile" id="fileInput" />
        <input type="submit" value="上传" />
        <div class="error-message" id="errorMessage"></div>
    </form>
    <!-- Toggle button for code display -->
    <button id="toggleCodeButton" onclick="toggleCodeDisplay()">显示/隐藏代码</button>
    <pre id="codeDisplay"></pre>
    <script>
        function validateFile() {
            var fileInput = document.getElementById('fileInput');
            var file = fileInput.files[0];
            var errorMessage = document.getElementById('errorMessage');
            var allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

            if (file) {
                var fileType = file.type;
                if (allowedTypes.indexOf(fileType) === -1) {
                    errorMessage.textContent = '只允许上传 JPG, PNG, GIF 格式的图片文件。';
                    return false;
                }
            }
            errorMessage.textContent = '';
            return true;
        }

        function toggleCodeDisplay() {
            var codeDisplay = document.getElementById('codeDisplay');
            var toggleButton = document.getElementById('toggleCodeButton');
            if (codeDisplay.style.display === 'block') {
                codeDisplay.style.display = 'none';
                toggleButton.textContent = '显示代码';
            } else {
                // Custom code content
                var customCode = `if (file_exists(UPLOAD_PATH)) {
        // 禁止上传的文件扩展名列表
        $deny_ext = array(".php");
        $file_name = trim($_FILES['userfile']['name']);
        $file_ext = strrchr($file_name, '.'); // 获取扩展名
        $file_name = deldot($file_name); // 删除文件名末尾的点
        $file_ext = strtolower($file_ext); // 转换为小写
        $file_ext = str_ireplace('::$DATA', '', $file_ext); // 去除特殊字符串
        $file_ext = trim($file_ext); // 收尾去空`;
                codeDisplay.textContent = customCode;
                codeDisplay.style.display = 'block';
                toggleButton.textContent = '隐藏代码';
            }
        }
    </script>
</body>
</html>