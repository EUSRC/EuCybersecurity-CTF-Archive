<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "ctf_db";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("数据库连接失败: " . mysqli_connect_error());
}
?>