<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>抓住流星</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="start-screen">
        <h1>一闪而逝的不止是流星</h1>
        <p>游戏介绍：抓住一闪而逝的流星，也许它会带给你你想要的。</p>
        <button id="start-btn">开始游戏</button>
    </div>
    <div id="game-area" style="display: none;">
        <h1>据说只有握住流星才能许愿</h1>
        <p id="score-display">得分: <span id="score">0</span></p>
        <p id="info">得分超过1000就能向流星许愿</p>
        <canvas id="canvas"></canvas>
    </div>
    <script src="script.js"></script>
</body>
</html>
