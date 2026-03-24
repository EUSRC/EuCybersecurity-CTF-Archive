<?php
$flag = 'flag{testflag}';

if (isset($_SERVER['HTTP_REFERER']) && $_SERVER['HTTP_REFERER'] === 'https://EUCTF.cn') {
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && $_SERVER['HTTP_X_FORWARDED_FOR'] === '127.0.0.1') {
        echo renderFlagHTML($flag);
    } else {
        echo renderHTML('只能在本地阅读哦！');
    }
} else {
    echo renderHTML('你的请求来源好像有些不对   https://EUCTF.cn');
}

function renderFlagHTML($flag) {
    return "<!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Flag Revealed</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                background-image: url('lanxing.png'); /* 替换为你的背景图链接 */
                background-size: cover; /* 覆盖整个页面 */
                background-position: center; /* 背景图居中显示 */
            }
            .flag-container { 
                text-align: center; 
                background: rgba(255, 255, 255, 0.8); /* 半透明背景 */
                border-radius: 8px; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                padding: 40px; 
                max-width: 600px; /* 限制最大宽度 */
                margin: auto; /* 水平居中 */
            }
            h1 { color: #27ae60; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class='flag-container'>
            <h1>Congratulations!</h1>
            <p>Your flag is: <strong>{$flag}</strong></p>
        </div>
    </body>
    </html>";
}

function renderHTML($message) {
    return "<!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>EUCTF Challenge</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                background-image: url('lanxing.png'); /* 替换为你的背景图链接 */
                background-size: cover; /* 覆盖整个页面 */
                background-position: center; /* 背景图居中显示 */
            }
            .container { 
                text-align: center; 
                background: rgba(255, 255, 255, 0.8); /* 半透明背景 */
                border-radius: 8px; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                padding: 40px; 
                max-width: 600px; /* 限制最大宽度 */
                margin: auto; /* 水平居中 */
            }
            h1 { color: #DC3545; margin-bottom: 20px; }
            p { color: #7f8c8d; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>{$message}</h1>
            <p>请确保从正确的来源访问页面。</p>
        </div>
    </body>
    </html>";
}
?>