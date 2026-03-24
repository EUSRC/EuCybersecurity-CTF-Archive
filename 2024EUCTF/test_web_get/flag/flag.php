<html>
<head>
    <!-- <if (isset($_GET['flag'])) {
    echo "flag";
}> -->
	<meta charset="utf-8">
</head>
<body>
	<form action="" method="POST" enctype="multipart/form-data">
	<p>好像可以直接获得flag</p>

</form>
</body>
</html>
<?php
if (isset($_GET['flag'])) {
    echo "flag{testflag}";
}
?>