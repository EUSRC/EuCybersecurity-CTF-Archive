<?php
// 开启输出缓冲（关键！避免提前输出导致header失效）
ob_start();

// 取参数（避免未定义警告）
$get_ok  = (isset($_GET['gogogo'])  && $_GET['gogogo'] === 'youth');
$post_ok = (isset($_POST['Summer']) && $_POST['Summer'] === 'gogogo');

// 两者都满足：跳转
if ($get_ok && $post_ok) {
    // 清空输出缓冲区，确保header能正常发送
    ob_clean();
    header('Location: 1.php');
    exit();
}

// 满足一半：给“假反馈”
$hint = '';
if ($get_ok && !$post_ok) {
    $hint = 'Almost there...';
} elseif (!$get_ok && $post_ok) {
    $hint = 'Keep going...';
}

// 结束输出缓冲并发送内容
ob_end_flush();
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title></title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: url('1.png') no-repeat center center fixed;
            background-size: cover;
            height: 100vh;
            width: 100vw;
        }
        .hint {
            position: fixed;
            left: 16px;
            bottom: 16px;
            padding: 10px 14px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 14px;
            color: rgba(255,255,255,0.9);
            background: rgba(0,0,0,0.55);
            border-radius: 8px;
            user-select: none;
        }
    </style>
</head>
<body>
<?php if ($hint !== ''): ?>
    <div class="hint"><?php echo htmlspecialchars($hint, ENT_QUOTES, 'UTF-8'); ?></div>
<?php endif; ?>

<!-- 
1. POST传参：Summer=gogogo
2. GET传参：gogogo=youth
-->
</body>
</html>