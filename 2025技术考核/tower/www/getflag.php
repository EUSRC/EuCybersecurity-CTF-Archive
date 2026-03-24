<?php
// 和前端 BOSS_SECRET 一样
$SECRET = "BOSSTOKEN_9f8a1c0e_dont_guess_me";

// 1. 获取前端传来的 token
$token = $_GET['token'] ?? "";

// 2. 按完全相同的算法算预期值：base64( SECRET . ":boss_dead" )
$expected = base64_encode($SECRET . ":boss_dead");

// 3. token 不对就拒绝
if (!hash_equals($expected, $token)) {
    http_response_code(403);
    echo "nope";
    exit;
}

// 4. 只有 token 正确才输出 flag，占位符等 flag.sh 替换
echo "flag{testflag}";
