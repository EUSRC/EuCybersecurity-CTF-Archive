<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>大会员 - Milimili</title>
    <link rel="stylesheet" href="assets/style.css">
    <style>
        .vip-container {
            text-align: center;
            padding: 100px 20px;
        }

        .vip-card {
            background: linear-gradient(135deg, #fce38a, #f38181);
            color: white;
            display: inline-block;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(243, 129, 129, 0.4);
        }

        .vip-title {
            font-size: 36px;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .vip-price {
            font-size: 48px;
            margin-bottom: 30px;
        }

        .btn-buy {
            background: white;
            color: #ff6b6b;
            padding: 15px 40px;
            font-size: 20px;
            border-radius: 50px;
            border: none;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .btn-buy:hover {
            transform: scale(1.05);
        }
    </style>
</head>

<body>
    <header class="milimili-header">
        <div class="header-left">
            <a href="index.php" class="logo">Milimili</a>
        </div>
    </header>

    <div class="vip-container">
        <div class="vip-card">
            <div class="vip-title">成为 Milimili 大会员</div>
            <div class="vip-price">¥ 23333333 / 年</div>
            <p>尊享 4K 画质、专属挂件、身份标识</p>
            <br>
            <button class="btn-buy" onclick="alert('支付失败：余额不足 (你是黑客，自己想办法)')">立即开通</button>
        </div>
    </div>
</body>

</html>