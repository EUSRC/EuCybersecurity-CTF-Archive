<?php
error_reporting(0);
highlight_file(__FILE__);

if(isset($_GET['c'])){
    $c = $_GET['c'];
    
   if (
    preg_match('/flag|file|php|cat|system|passthru|popen|proc_open|assert|base64|read|fopen|glob|scandir/i', $c)
) {
    die("Hacker!");
}
	eval($c);  
} else {
    echo "Please provide parameter 'c'";
}
?>