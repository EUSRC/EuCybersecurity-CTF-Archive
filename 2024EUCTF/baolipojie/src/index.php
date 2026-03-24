<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="content">
        <div class="left">
            <img src="./asset/img2.png" class="people p-animtion" alt="people">
            <img src="./asset/img1.png" class="sphere s-animtion" alt="sphere">
        </div>
        <div class="right">

            <div class="form-wrappepr">
                <h1>Eusrc登录页面</h1>
                <form method="post" action="login.php">
                <input type="text" class="inputs user" name="username" placeholder="username">
                <input type="password" class="inputs pwd" name="userpwd" placeholder="Password">
                <button>登录</button>
                </form>
                <div class="other-login">


                </div>
            </div>

        </div>
    </div>
</body>
<script>
    document.querySelector(".people").addEventListener('animationend', function () {
        this.classList.remove('p-animtion');
        this.classList.add('p-other-animtion')
    });
    document.querySelector(".sphere").addEventListener('animationend', function () {
        this.classList.remove('s-animtion');
        this.classList.add('s-other-animtion')
    });	
</script>

</html>