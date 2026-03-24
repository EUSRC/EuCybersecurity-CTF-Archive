let score = 0;
let missedMeteors = 0; // 记录错过的流星
let penaltyCount = 0; // 记录扣分次数
const maxPenalties = 2; // 最大扣分次数

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasSize();

const edgeMargin = 50;

// 加载点击音效
const clickSound = new Audio('click.mp3');

let meteor; // 定义 meteor 对象

document.getElementById('start-btn').onclick = startGame;

// 在窗口大小调整时更新画布大小
window.addEventListener('resize', () => {
    setCanvasSize();
    resetMeteor(); // 重新设置流星位置
});

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    score = 0;
    missedMeteors = 0;
    penaltyCount = 0;
    meteor = createMeteor(); // 在开始游戏时初始化流星
    updateScoreDisplay();
    animate();
}

function createMeteor() {
    return {
        x: edgeMargin + Math.random() * (canvas.width - 2 * edgeMargin),
        y: -20,
        speedX: (Math.random() - 0.5) * 4,
        speedY: 2 + Math.random() * 5
    };
}

function drawMeteor() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars(150);

    meteor.x += meteor.speedX;
    meteor.y += meteor.speedY;

    // 创建光晕效果的渐变
    const gradient = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 20);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   // 中心白色
    gradient.addColorStop(0.4, 'rgba(255, 165, 0, 0.8)'); // 橙色
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');       // 外围渐隐

    // 绘制流星的主体
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();

    // 绘制流星尾巴
    const tailGradient = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - 50 * meteor.speedX, meteor.y - 50 * meteor.speedY);
    tailGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    tailGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.moveTo(meteor.x, meteor.y);
    ctx.lineTo(meteor.x - 50 * meteor.speedX, meteor.y - 50 * meteor.speedY);
    ctx.strokeStyle = tailGradient;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.closePath();

    if (meteor.y > canvas.height || meteor.x < 0 || meteor.x > canvas.width) {
        missedMeteors++;
        resetMeteor();
    }

    if (missedMeteors >= 3) {
        score = Math.max(0, score - 10);
        missedMeteors = 0;
        penaltyCount++;
        checkGameOver();
    }
}

function checkGameOver() {
    if (penaltyCount >= maxPenalties) {
        alert('你没能抓住流星，也没能留住......');
        document.getElementById('start-screen').style.display = 'block';
        document.getElementById('game-area').style.display = 'none';
    }
}

function drawStars(number) {
    for (let i = 0; i < number; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.random() + ')';
        ctx.fill();
        ctx.closePath();
    }
}

function resetMeteor() {
    meteor = createMeteor(); // 重置流星
}

function updateScoreDisplay() {
    document.getElementById('score').innerText = score;
    if (score >= 1000) {
        revealFlag();
    }
}

function revealFlag() {
    fetch('flag.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(flag => {
            alert(`你许愿的是它吧：${flag}`);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

canvas.onclick = (event) => {
    const dx = event.offsetX - meteor.x;
    const dy = event.offsetY - meteor.y;
    if (Math.sqrt(dx * dx + dy * dy) < 20) {
        score += 10;
        missedMeteors = 0;
        updateScoreDisplay();
        resetMeteor();
        clickSound.play(); // 播放点击音效
    }
};

function animate() {
    drawMeteor();
    updateScoreDisplay(); // 每一帧更新分数显示
    if (penaltyCount < maxPenalties) {
        requestAnimationFrame(animate);
    }
}
