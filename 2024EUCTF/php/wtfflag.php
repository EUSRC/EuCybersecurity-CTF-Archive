<?php
highlight_file(__FILE__);
$EUCTF ="php_is_so_easy";
if(isset($_GET['EUCTF'])){
    if (strcmp($_GET['EUCTF'], $EUCTF) == 0) {
        echo getenv('GZCTF_FLAG');
} 
    }else {
        echo "no no no no flag";
          }
?>