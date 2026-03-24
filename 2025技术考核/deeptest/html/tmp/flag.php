<?php
$check = isset($_GET['check']) ? $_GET['check'] : '';

if ($check === 'ok') {
    header('Content-Type: text/plain; charset=utf-8');
     echo "euctf{dirsearch_is_a_good_tools_for_you}";
    exit;
}
?>
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <!--
    if ($_GET['check'] === 'ok') {
        echo $flag;
    }
    -->
    <title>Flag</title>
</head>
<body>
    <p>好像已经很接近了。</p>
    <p>但事情真的这么简单吗？</p>
</body>
</html>
