<?php
$textFile = 'flag.php';


if (file_exists($textFile) && is_readable($textFile)) {
    $fileContent = file_get_contents($textFile);
}
?>
<html>
<head>
	<meta charset="utf-8">
</head>

<body>
<!--试试扫描一下呢？ -->
	<form action="" method="POST" enctype="multipart/form-data">
	<p>东西会在什么地方呢？</p>
    
</body>

</html>
