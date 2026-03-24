<?php
// 登录验证脚本

// 数据库配置
$host = 'localhost'; // 数据库主机地址
$username = 'root'; // 数据库用户名
$password = '123456'; // 数据库密码
$database = 'eu2024'; // 数据库名

// 创建数据库连接
$conn = new mysqli($host, $username, $password, $database);

// 检查连接
if ($conn->connect_error) {
    die("数据库连接失败: " . $conn->connect_error);
}

// 从POST请求中获取用户名和密码
$username = $_POST['username'];
$password = $_POST['password'];

// SQL查询语句
$sql = "SELECT username,password FROM users WHERE username = '$username' AND password = '$password'";

// 执行查询
$result = $conn->query($sql);

// 检查查询结果
if ($result->num_rows > 0) {
    // 用户名和密码匹配
    session_start(); // 开始新的或继续现有的会话
    $_SESSION['loggedin'] = true; // 设置session变量
    $_SESSION['access_flag'] = true; // 这里应该是赋值操作，而不是比较
    $_SESSION['username'] = $username; // 可以将用户名也存入session
    echo json_encode(array("success" => true));
    exit();
} else {
    // 用户名或密码错误
    // 获取数据库错误信息
    $db_error = $conn->error;
    // 关闭数据库连接
    $conn->close();
    // 将错误信息以JSON格式返回
    echo json_encode(array("error" => "登录失败：用户名或密码错误", "db_error" => $db_error));
    exit();
}
?>