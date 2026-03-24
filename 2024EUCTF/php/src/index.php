<?php
highlight_file(__FILE__);

$md51 = md5(md5('EUCTF'));
$a = @$_GET['a'];
if(isset($a)){
    if ($md51 === $a) {
    include '../wtfflag.php'; 
    } else {
        echo "false!!!";
    }
}