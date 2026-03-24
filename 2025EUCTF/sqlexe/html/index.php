<?php
header("Content-Type: application/json");

// 检查 User-Agent 是否为 "IkunBrowser"
if (!isset($_SERVER['HTTP_USER_AGENT']) || $_SERVER['HTTP_USER_AGENT'] !== "IkunBrowser") {
    http_response_code(403);
    echo json_encode(["error" => "Forbidden", "message" => "你的ip已被记录：{$_SERVER['REMOTE_ADDR']}，再打击毙你"], JSON_UNESCAPED_UNICODE);
    exit;
}

// 读取 id 参数
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Bad Request", "message" => "Missing id parameter"]);
    exit;
}

// 连接数据库
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "euctf";

// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error", "message" => "Database connection failed"]);
    exit;
}

// SQL 查询（存在SQL注入漏洞）
$sql = "SELECT id, name, phone FROM euctf WHERE id = '$id'";  // 直接拼接，存在 SQL 注入漏洞

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // 输出查询结果
    $row = $result->fetch_assoc();
    $response = [
        "id" => $row["id"],
        "name" => $row["name"],
        "phone" => $row["phone"],
        "client_ip" => $_SERVER['REMOTE_ADDR']  // 输出来源 IP
    ];
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    // 如果没有找到该 id 的记录
    http_response_code(404);
    echo json_encode(["error" => "Not Found", "message" => "No data found for the provided id"], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>
