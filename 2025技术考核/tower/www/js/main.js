/**
 * 游戏入口文件
 * 负责初始化游戏并启动
 */

// 调试模式开关
window.DEBUG_MODE = false;
(function() {
    const rawLog = console.log;
    console.log = function(...args) {
        if (window.DEBUG_MODE) rawLog.apply(console, args);
    };
})();

// 当DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 获取游戏画布和界面元素
    const canvas = document.getElementById('game-canvas');
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    const playGameButton = document.getElementById('play-game');
    
    // 音频相关元素
    const soundVolumeSlider = document.getElementById('sound-volume');
    const musicVolumeSlider = document.getElementById('music-volume');
    const muteCheckbox = document.getElementById('mute-sounds');
    
    // 游戏实例
    let game = null;
    
    // 初始化游戏
    function initGame() {
        // 创建游戏实例
        game = new Game(canvas);
        
        // 播放背景音乐
        if (window.audioManager) {
            window.audioManager.playBackgroundMusic();
        }
        
        // 添加键盘事件监听
        document.addEventListener('keydown', (e) => {
            // 按D键切换调试模式
            if (e.key === 'd' || e.key === 'D') {
                window.DEBUG_MODE = !window.DEBUG_MODE;
                console.log(`调试模式: ${window.DEBUG_MODE ? '开启' : '关闭'}`);
            }
            
            // 按空格键开始下一波敌人
            if (e.key === ' ' && !game.waveInProgress && !game.isGameOver) {
                game.startNextWave();
                // 播放波次开始音效
                if (window.audioManager) {
                    window.audioManager.play('waveStart');
                }
            }
            
            // 按U键升级选中的塔
            if ((e.key === 'u' || e.key === 'U') && game.selectedTower) {
                game.upgradeTower();
                
            }
            
            // 按ESC键取消选择
            if (e.key === 'Escape') {
                game.selectedTowerType = null;
                game.selectedTower = null;
                
                // 取消选中塔类型按钮
                const towerOptions = document.querySelectorAll('.tower-option');
                towerOptions.forEach(opt => opt.classList.remove('selected'));
            }
            
            // 按M键切换背景音乐
            if (e.key === 'm' || e.key === 'M') {
                if (window.audioManager) {
                    if (window.audioManager.isMusicPlaying) {
                        window.audioManager.pauseBackgroundMusic();
                    } else {
                        window.audioManager.resumeBackgroundMusic();
                    }
                }
            }
        });
        
        // 添加鼠标移动事件监听（用于显示塔的预览）
        canvas.addEventListener('mousemove', (e) => {
            // 游戏实例会在渲染时使用鼠标位置
            window.event = e;
        });
        
        // 添加右键点击事件（用于取消选择）
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            game.selectedTowerType = null;
            game.selectedTower = null;
            
            // 取消选中塔类型按钮
            const towerOptions = document.querySelectorAll('.tower-option');
            towerOptions.forEach(opt => opt.classList.remove('selected'));
        });
        
        // 监听开始波次按钮
        const startWaveButton = document.getElementById('start-wave');
        if (startWaveButton) {
            startWaveButton.addEventListener('click', () => {
                if (!game.waveInProgress && !game.isGameOver) {
                    game.startNextWave();
                    // 播放波次开始音效
                    if (window.audioManager) {
                        window.audioManager.play('waveStart');
                    }
                }
            });
        }
        
        // 监听背景音乐控制按钮
        const toggleMusicButton = document.getElementById('toggle-music');
        const musicIcon = document.getElementById('music-icon');
        if (toggleMusicButton) {
            toggleMusicButton.addEventListener('click', () => {
                if (window.audioManager) {
                    if (window.audioManager.isMusicPlaying) {
                        window.audioManager.pauseBackgroundMusic();
                        musicIcon.textContent = '🔇'; // 静音图标
                    } else {
                        window.audioManager.resumeBackgroundMusic();
                        musicIcon.textContent = '🔊'; // 有声图标
                    }
                }
            });
        }
        
        // 监听塔选择按钮，添加音效
        const towerOptions = document.querySelectorAll('.tower-option');
        towerOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 播放按钮点击音效
                
            });
        });
        
        // 添加升级按钮点击事件
        document.addEventListener('click', (e) => {
            if (e.target.id === 'upgrade-tower' && game.selectedTower) {
                game.upgradeTower();
                // 播放升级音效
                if (window.audioManager) {
                    window.audioManager.play('upgradeTower');
                }
            }
        });
        
        // 启动游戏
        game.start();
        
        console.log('游戏初始化完成');
    }
    
    // 开始游戏按钮点击事件
    if (playGameButton) {
        playGameButton.addEventListener('click', () => {
            // 播放按钮点击音效
            
            // 隐藏开始界面，显示游戏界面
            startScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            
            // 初始化游戏
            initGame();
        });
    }
});