<?php

header("content-type:text/html;charset=utf-8");

$name1=$_POST["username"];

$pwd1=$_POST["userpwd"];


if($name1 === 'system' && $pwd1 === 'system123')
{
    echo "<script>alert('登陆成功')</script>";
	echo "<script>alert('flag{testflag}');;history.back()</script>";
}else{
    echo "<script language=javascript>alert('登陆失败');;history.back()</script>";
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login</title>
</head>
<body>
    
</body>
</html>
