<?php
// 安全配置
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE);

// 强制设置UA头为euctf
$_SERVER['HTTP_USER_AGENT'] = 'euctf';

// 业务逻辑
$upload_dir = "uploads/";
if (!file_exists($upload_dir)) mkdir($upload_dir);

// 处理执行图片马的请求
if (isset($_GET['execute'])) {
    $user_agent = $_SERVER['HTTP_USER_AGENT']; // 现在总是'euctf'
    if ($user_agent !== 'euctf') {
        die(" 你不该上这趟车，你没有身份证");
    }
    $file_to_execute = $upload_dir . basename($_GET['execute']);
    if (file_exists($file_to_execute)) {
        // 检查是否为jpg文件
        if (pathinfo($file_to_execute, PATHINFO_EXTENSION) === 'jpg') {
            // 额外检查：必须存在.htaccess文件
            $htaccess_file = $upload_dir . '.htaccess';
            if (!file_exists($htaccess_file)) {
                die("没有系好安全带");
            }
            
            
            echo '<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
:root {
    --primary: #4CAF50;
    --secondary: #FFD700;
    --background: #f5f9ff;
    --accent: #ff8f00;
    --text-color: #333;
}
body {
    background: url(2.png) no-repeat center center fixed;
    background-size: cover;
    font-family: "Microsoft YaHei", sans-serif;
    color: var(--text-color);
    margin: 0;
    padding: 0;
}
.container {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    padding: 20px;
    max-width: 80%;
    margin: 50px auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    text-align: left;
}
.title {
    font-size: 2rem;
    color: var(--primary);
    text-align: center;
    margin-bottom: 15px;
}
.result-box {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.result-header {
    color: var(--secondary);
    font-size: 1.2rem;
    margin-bottom: 10px;
}
.result-content {
    background: #f1f1f1;
    color: #0f0;
    padding: 15px;
    border-radius: 5px;
    font-family: monospace;
    white-space: pre-wrap;
}
.back-btn {
    display: inline-block;
    background: var(--accent);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    margin-top: 20px;
    transition: all 0.3s;
}
.back-btn:hover {
    background: #ff6f00;
    transform: translateY(-2px);
}
.default-ua-notice {
    background: rgba(76, 175, 80, 0.2);
    border: 1px solid #4CAF50;
    border-radius: 5px;
    padding: 5px 10px;
    margin: 10px 0;
    font-size: 0.9rem;
    text-align: center;
}
</style>
</head>
<body>
<div class="container">
    <h1 class="title">执行结果</h1>';
    
    // 如果使用了默认UA，显示提示
    if (($_SERVER['HTTP_USER_AGENT'] ?? '') === '') {
        echo ' 身份信息不对';
    }
    
    echo '<div class="result-box">
        <div class="result-header"> 执行结果：</div>
        <div class="result-content">';
            ob_start();
            include($file_to_execute);
            $output = ob_get_clean();
            echo htmlspecialchars($output);
            
        echo '</div>
    </div>
    <div style="text-align:center;">
        <a href="?" class="back-btn">返回上传页面</a>
    </div>
</div>
</body>
</html>';
        } else {
            die("只能执行jpg文件！");
        }
    } else {
        die("文件不存在！");
    }
    exit;
}

// 防止直接访问上传的文件
if (strpos($_SERVER['REQUEST_URI'], $upload_dir) !== false && 
    strpos($_SERVER['REQUEST_URI'], '.jpg') !== false) {
    // 检查UA - 如果为空则默认为euctf
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if (empty($user_agent)) {
        $user_agent = 'euctf';
        header('X-UA-Default: euctf (default)');
    }
    
    if ($user_agent !== 'euctf') {
        header('HTTP/1.0 403 Forbidden');
        die("你身份信息错了，宝贝 ");
    }
    
    // 检查.htaccess是否存在
    $htaccess_file = $upload_dir . '.htaccess';
    if (!file_exists($htaccess_file)) {
        die("打咩哟，小小考核不可以执行");
    }
    
    // 如果直接访问jpg文件，也尝试执行
    $requested_file = basename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    $file_path = $upload_dir . $requested_file;
    if (file_exists($file_path) && pathinfo($file_path, PATHINFO_EXTENSION) === 'jpg') {
        ob_start();
        include($file_path);
        $output = ob_get_clean();
        echo htmlspecialchars($output);
        exit;
    }
}

if (isset($_FILES["file"])) {
    $file_name = basename($_FILES["file"]["name"]);
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    // 扩展名白名单验证
    $allowed_ext = ["jpg", "htaccess"];
    if (!in_array($file_ext, $allowed_ext)) {
        die("只允许上传 jpg 和 .htaccess 文件！");
    }
    
    // 防止上传非法的.htaccess
    if ($file_ext === 'htaccess') {
        $content = file_get_contents($_FILES["file"]["tmp_name"]);
        // 确保.htaccess内容只包含图片解析规则
        if (strpos($content, 'php') === false) {
            die("  ");
        }
    }
    
    $target = $upload_dir . $file_name;
    
    // 移动上传的文件到目标位置
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target)) {
        // 检查是否同时存在.htaccess和jpg文件
        $files = scandir($upload_dir);
        $has_htaccess = false;
        $has_jpg = false;
        $jpg_files = [];
        
        foreach ($files as $file) {
            if ($file != '.' && $file != '..') {
                $ext = pathinfo($file, PATHINFO_EXTENSION);
                if ($ext === 'htaccess') {
                    $has_htaccess = true;
                } elseif ($ext === 'jpg') {
                    $has_jpg = true;
                    $jpg_files[] = $file;
                }
            }
        }
        
        $show_execute_button = $has_htaccess && $has_jpg;
        
        // 上传成功，输出HTML
        echo '<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
:root {
    --primary: #4CAF50;
    --secondary: #FFD700;
    --background: #f5f9ff;
    --accent: #ff8f00;
    --text-color: #333;
}
body {
    background: url(2.png) no-repeat center center fixed;
    background-size: cover;
    font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
    color: var(--text-color);
    margin: 0;
    padding: 0;
}
.container {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    padding: 20px;
    max-width: 80%;
    margin: 50px auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    text-align: left;
}
.title {
    font-size: 2rem;
    color: var(--primary);
    text-align: center;
    margin-bottom: 15px;
}
.flag-hint {
    color: var(--secondary);
    font-size: 0.9rem;
    margin-top: 30px;
    padding: 10px;
    border-top: 1px dashed var(--secondary);
}
a {
    color: var(--primary);
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
.execute-btn {
    display: inline-block;
    background: #FF9800;
    color: white;
    padding: 8px 16px;
    border-radius: 5px;
    text-decoration: none;
    margin-left: 10px;
    font-size: 0.9rem;
    transition: all 0.3s;
}
.execute-btn:hover {
    background: #F57C00;
    transform: translateY(-2px);
}
.execute-btn:disabled {
    background: #666;
    cursor: not-allowed;
}
.file-list {
    background: rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 15px;
    margin: 20px 0;
    text-align: left;
}
.file-item {
    padding: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.file-item:last-child {
    border-bottom: none;
}
.requirement-hint {
    background: rgba(255, 87, 34, 0.2);
    border: 1px solid #FF5722;
    border-radius: 8px;
    padding: 10px;
    margin: 15px 0;
    text-align: center;
    font-size: 0.9rem;
}
.requirement-met {
    background: rgba(76, 175, 80, 0.2);
    border: 1px solid #4CAF50;
}
.requirement-check {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 15px 0;
}
.requirement-item {
    padding: 5px 10px;
    border-radius: 5px;
}
.warning {
    background: rgba(255, 193, 7, 0.2);
    border: 1px solid #FFC107;
    border-radius: 8px;
    padding: 10px;
    margin: 15px 0;
    text-align: center;
    font-size: 0.9rem;
}
</style>
</head>
<body>
<div class="container">
    <h1 class="title">小小考核能否做到横扫全场</h1>
    上传成功：<a href="' . htmlspecialchars($target) . '">' . htmlspecialchars($file_name) . '</a>';
    
    // 如果是.htaccess文件，显示示例内容
    if ($file_ext === 'htaccess') {
        echo '  ';
    }
    
    // 显示上传要求状态
    if (!$show_execute_button) {
        echo ' <div class="requirement-hint">
         上车了别忘记支付车票和系好安全带';
    } else {
        echo '<div class="requirement-hint requirement-met">
            等待发车<br>
        </div>';
    }
    

    
    // 显示已上传文件列表
    echo '<div class="file-list">
        <h3>已上传文件:</h3>';
    
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            echo '<div class="file-item">
                <span>' . htmlspecialchars($file) . '</span>';
            if ($ext === 'jpg' && $show_execute_button) {
                echo '<a href="?execute=' . urlencode($file) . '" class="execute-btn">执行</a>';
            } elseif ($ext === 'jpg') {
                echo '<span class="execute-btn" style="background: #666; cursor: not-allowed;">执行</span>';
            }
            echo '</div>';
        }
    }
    
    echo '</div>
    <div style="margin-top: 20px;">
        <a href="?" style="color: var(--primary);">继续上传文件</a>
    </div>
</div>
</body>
</html>';
    } else {
        echo '上传失败！';
    }
} else {
    // 显示文件上传表单
    echo '<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
    background: url(2.png) no-repeat center center fixed;
    background-size: cover;
    font-family: "Microsoft YaHei", sans-serif;
    color: white;
    text-align: center;
    padding: 50px 20px;
    margin: 0;
}
.container {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 15px;
    padding: 30px;
    max-width: 500px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
.title {
    font-size: 2.5rem;
    margin-bottom: 30px;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.flag-hint {
    color: #FFD700;
    font-size: 0.9rem;
    margin-top: 20px;
}
.instructions {
    background: rgba(255,215,0,0.1);
    border: 1px solid #FFD700;
    border-radius: 8px;
    padding: 15px;
    margin: 20px 0;
    text-align: left;
    font-size: 0.9rem;
}
.instructions h3 {
    color: #FFD700;
    margin-top: 0;
}
.security-note {
    background: rgba(76, 175, 80, 0.2);
    border: 1px solid #4CAF50;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
    text-align: left;
    font-size: 0.9rem;
}
.security-note h3 {
    color: #4CAF50;
    margin-top: 0;
}
form {
    margin-top: 20px;
}
input[type="file"] {
    width: 100%;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #ccc;
    border-radius: 5px;
    color: white;
    margin-bottom: 15px;
}
input[type="submit"] {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
}
input[type="submit"]:hover {
    background: #45a049;
    transform: translateY(-2px);
}
</style>
</head>
<body>
<div class="container">
    <h1 class="title">小小考核能否做到横扫全场</h1>
    
    <div class="security-note">
        <h3>温馨提示：</h3>
        <p>1. 上车的同时要支付车票</p>
        <p>2. 通往绿色青春的旅途</p>
    </div>
    
    <form method="POST" enctype="multipart/form-data">
        <input type="file" name="file" required>
        <input type="submit" value="上传">
    </form>
</div>
</body>
</html>';
}
?>
