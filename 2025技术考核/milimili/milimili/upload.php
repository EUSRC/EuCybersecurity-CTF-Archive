<?php
// Milimili Upload Handler

$upload_dir = 'uploads/';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $filename = $file['name'];
    $tmp_name = $file['tmp_name'];

    // Get file extension
    $ext = pathinfo($filename, PATHINFO_EXTENSION);

    // Blacklist check: Simply block "php" extension
    // Vulnerability: Only blocks "php". Allows "phtml", "php5", "pHp" (if logic is sensitive, but usually we make it case-insensitive for standard bad blacklists, creating bypass opportunities with other exts)
    // Detailed prompt: "only limit .php suffix".

    if (strtolower($ext) == 'php') {
        echo "<script>alert('上传失败！为了安全，我们不支持 .php 文件作为头像 (Upload Failed! No .php allowed)'); window.location.href='user.php';</script>";
        exit;
    }

    // Attempt upload
    // Randomize name to avoid overwrites but keep extension
    $new_name = uniqid() . '.' . $ext;
    $target_path = $upload_dir . $new_name;

    if (move_uploaded_file($tmp_name, $target_path)) {
        echo "<script>alert('上传成功！头像路径: " . $target_path . "'); window.location.href='user.php';</script>";
    } else {
        echo "<script>alert('上传出错，请稍后重试。'); window.location.href='user.php';</script>";
    }
} else {
    echo "No file uploaded.";
}
?>