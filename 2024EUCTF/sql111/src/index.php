<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login/login</title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="./index.css">
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var signUpButton = document.querySelector('.signUp');
            var signInButton = document.querySelector('.signIn');
            var signInForm = document.querySelector('.sign-in-container');
            var signUpForm = document.querySelector('.sign-up-container');
            var container = document.querySelector('.container');

            signUpButton.addEventListener('click', function() {
                signInForm.style.transform = "translateX(0)";
                signUpForm.style.transform = "translateX(100%)";
            });

            signInButton.addEventListener('click', function() {
                signInForm.style.transform = "translateX(-100%)";
                signUpForm.style.transform = "translateX(0)";
            });

            var forms = document.querySelectorAll('form');
            forms.forEach(function(form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var formData = new FormData(form);
                    fetch('login.php', {
                        method: 'POST',
                        body: formData
                    }).then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            window.location.href = 'flag.php';
                        } else if (data.error) {
                            document.getElementById('login-error').textContent = data.error + ' ' + data.db_error;
                        }
                    }).catch(error => {
                        console.error('Error:', error);
                    });
                });
            });
        });
    </script>
</head>

<body>
    <!-- login/register container -->
    <div class="container">
        <!-- register -->
        <div class="form-container sign-up-container">
            <div class="form">
                <h2>EU后台管理系统</h2>
                <form action="login.php" method="post">
                    <input type="text" name="username" id="username" placeholder="Username..." required>
                    <input type="password" name="password" id="password" placeholder="Password..." required>
                    <button type="submit" class="signUp">登陆</button>
                </form>
            </div>
        </div>
        <!-- login -->
        <div class="form-container sign-in-container">
            <div class="form">
                <h2>EU后台管理系统</h2>
                <form action="login.php" method="post">
                    <input type="text" name="username" id="username" placeholder="Username..." required>
                    <input type="password" name="password" id="password" placeholder="Password..." required>
                    <button type="submit" class="signIn">登陆</button>
                </form>
            </div>
        </div>
        <!-- overlay container -->
        <div class="overlay_container">
            <div class="overlay">
                <!-- overlay left -->
                <div class="overlay_panel overlay_left_container">
                    <h2>好吧你还是点了我</h2>
                    <p>没有用，继续登录吧</p>
                    <button id="sign-in">回去</button>
                </div>
                <!-- overlay right -->
                <div class="overlay_panel overlay_right_container">
                    <h2>你好！</h2>
                    <p>请输入账号密码登陆吧</p>
                    <button id="sign-up">不要点我！</button>
                </div>
            </div>
        </div>
    </div>
    <div id="login-error" class="error-message"></div>
    <script src="./index.js"></script>
</body>

</html>