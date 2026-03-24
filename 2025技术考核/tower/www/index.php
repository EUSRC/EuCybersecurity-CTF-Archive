<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>塔防游戏</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- 开始游戏界面 -->
    <div id="start-screen" class="full-screen">
        <div class="start-container">
            <h1 class="game-title">塔防游戏</h1>
            <button id="play-game" class="start-button">开始游戏</button>
            <div class="sound-settings">
                <div class="volume-control">
                    <span>音效音量:</span>
                    <input type="range" id="sound-volume" min="0" max="1" step="0.1" value="0.7">
                </div>
                <div class="volume-control">
                    <span>背景音量:</span>
                    <input type="range" id="music-volume" min="0" max="1" step="0.1" value="0.5">
                </div>
                <div class="sound-toggle">
                    <label>
                        <input type="checkbox" id="mute-sounds" checked>
                        <span>启用音效</span>
                    </label>
                </div>
            </div>
        </div>
    </div>

    <div id="game-container" class="hidden">
        <!-- 左侧面板 -->
        <div id="left-panel" class="side-panel">
            <div>
                <div id="resources">
                    <div id="gold" class="resource-counter">金币 <span>100</span></div>
                    <div id="lives" class="resource-counter">生命 <span>20</span></div>
                    <div id="wave" class="resource-counter">波次 <span>0</span></div>
                </div>

                <!-- 新增：敌人信息区域，默认隐藏 -->
                <div id="enemy-info" class="info-panel hidden">
                    <h3>敌人信息</h3>
                    <div class="info-content">
                        <div class="info-row">生命值: <span id="enemy-health">100/100</span></div>
                        <div class="info-row">速度: <span id="enemy-speed">100</span></div>
                        <div class="info-row">击杀奖励: <span id="enemy-reward">10</span></div>
                        <div class="info-row">到达终点扣除: <span id="enemy-life-damage">1</span> 点生命</div>
                        <h4>抗性等级</h4>
                        <div class="info-row">物理抗性: <span id="enemy-phys-res">I</span></div>
                        <div class="info-row">魔法抗性: <span id="enemy-magic-res">I</span></div>
                        <div class="info-row">爆炸抗性: <span id="enemy-explo-res">I</span></div>
                    </div>
                </div>

                <!-- 新增：塔信息区域，默认隐藏 -->
                <div id="tower-detail-info" class="info-panel hidden">
                    <h3>塔信息</h3>
                    <div class="info-content">
                        <div class="info-row">类型: <span id="tower-type">箭塔</span></div>
                        <div class="info-row">等级: <span id="tower-level-info">1</span></div>
                        <div class="info-row">伤害: <span id="tower-damage-info">20</span></div>
                        <div class="info-row">范围: <span id="tower-range-info">150</span></div>
                        <div class="info-row">攻速: <span id="tower-rate-info">2.0</span></div>
                        <div id="tower-special-info" class="hidden">
                            <h4>特殊属性</h4>
                            <div id="special-attributes"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 控制按钮容器 -->
            <div class="control-buttons">
                <!-- 音乐控制按钮 -->
                <button id="toggle-music" class="control-button">
                    <span id="music-icon">🔊</span> 背景音乐
                </button>
                
                <!-- 开始下一波按钮 -->
                <button id="start-wave" class="control-button">开始下一波</button>
            </div>
        </div>
        
        <!-- 游戏画布 -->
        <canvas id="game-canvas"></canvas>
        
        <!-- 右侧面板 -->
        <div id="right-panel" class="side-panel">
            <h3>防御塔</h3>
            <div id="tower-selection">
                <div class="tower-option" data-tower="arrow" data-cost="50">
                    <div class="tower-icon arrow-tower"></div>
                    <div class="tower-cost">50金币</div>
                </div>
                <div class="tower-option" data-tower="cannon" data-cost="100">
                    <div class="tower-icon cannon-tower"></div>
                    <div class="tower-cost">100金币</div>
                </div>
                <div class="tower-option" data-tower="magic" data-cost="150">
                    <div class="tower-icon magic-tower"></div>
                    <div class="tower-cost">150金币</div>
                </div>
                <div class="tower-option" data-tower="strangefire" data-cost="125">
                    <div class="tower-icon strangefire-tower"></div>
                    <div class="tower-cost">125金币</div>
                </div>
            </div>
            
            <div class="tower-info hidden">
                <h4>塔信息</h4>
                <div class="tower-stats">
                    <div class="stat">等级: <span id="tower-level">1</span></div>
                    <div class="stat">伤害: <span id="tower-damage">10</span></div>
                    <div class="stat">范围: <span id="tower-range">100</span></div>
                    <div class="stat">攻速: <span id="tower-rate">1.0</span></div>
                </div>
            </div>
        </div>
        
        <!-- 保留原UI但隐藏，以保持兼容性 -->
        <div id="game-ui" class="hidden">
        </div>
    </div>
    
    <div id="game-over" class="hidden">
        <h2>游戏结束</h2>
        <p>你坚持了 <span id="final-wave">0</span> 波</p>
        <button id="restart-game">重新开始</button>
    </div>

    <!-- 游戏脚本 -->
    <script src="js/utils.js"></script>
    <script src="js/map.js"></script>
    <script src="js/enemy.js"></script>
    <script src="js/tower.js"></script>
    <script src="js/projectile.js"></script>
    <script src="js/audio.js"></script>
    <script src="js/game.js"></script>
    <script src="js/main.js"></script>
</body>
</html>