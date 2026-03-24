<?php
highlight_file(__FILE__);

function f($s) {
    $x = md5($s);
    return md5($x);
}

$md51 = f('EUCTF2025');

$a = $_GET['a'] ?? null;
if (isset($a)) {
    if ($md51 === $a) {
        echo getenv('GZCTF_FLAG');
    } else {
        echo "false!!!";
    }
}
