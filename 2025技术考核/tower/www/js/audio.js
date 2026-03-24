/**
 * 音频管理器类
 * 负责管理游戏中的所有音效和背景音乐
 */
class AudioManager {
    /**
     * 创建音频管理器
     */
    constructor() {
        // 音效是否启用
        this.enabled = true;
        
        // 音效音量（0.0-1.0）
        this.soundVolume = 0.7;
        
        // 背景音乐音量（0.0-1.0）
        this.musicVolume = 0.5;
        
        // 存储所有音频对象
        this.sounds = {};
        
        // 背景音乐
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        
        // 加载所有音效
        this.loadSounds();
        
        // 加载背景音乐
        this.loadBackgroundMusic();
        
        // 监听音量控制和静音切换
        this.setupListeners();
        
        console.log('音频管理器初始化完成');
    }
    
    /**
     * 加载所有音效
     */
    loadSounds() {
        // 加载塔防音效
        this.loadSound('arrowShoot', 'assets/mp3/ArrowTower.mp3');
        this.loadSound('cannonShoot', 'assets/mp3/CannonTower.mp3');
        this.loadSound('magicShoot', 'assets/mp3/MagicTower.mp3');
        this.loadSound('strangefire', 'assets/mp3/StrangefireTower.mp3');
        
        // 加载游戏音效
        this.loadSound('enemyDeath', 'assets/mp3/EnemyDeath.mp3');
        this.loadSound('buildTower', 'assets/mp3/BuildTower.mp3');
        this.loadSound('waveStart', 'assets/mp3/WaveStart.mp3');
        this.loadSound('gameOver', 'assets/mp3/GameOver.mp3');
        this.loadSound('upgradeTower', 'assets/mp3/UpgradeTower.mp3');
    }
    
    /**
     * 加载背景音乐
     */
    loadBackgroundMusic() {
        try {
            this.backgroundMusic = new Audio('assets/bgm/background-bgm.mp3');
            this.backgroundMusic.volume = this.musicVolume;
            this.backgroundMusic.loop = true; // 设置循环播放
            
            // 添加加载错误处理
            this.backgroundMusic.onerror = (error) => {
                console.error('背景音乐加载失败:', error);
            };
            
            // 添加加载成功处理
            this.backgroundMusic.oncanplaythrough = () => {
                console.log('背景音乐加载成功');
            };
            
            console.log('背景音乐初始化完成');
        } catch (error) {
            console.error('加载背景音乐时发生错误:', error);
        }
    }
    
    /**
     * 播放背景音乐
     */
    playBackgroundMusic() {
        if (!this.enabled || !this.backgroundMusic) return;
        
        try {
            // 确保音乐从头开始播放
            this.backgroundMusic.currentTime = 0;
            
            // 播放音乐
            const playPromise = this.backgroundMusic.play();
            
            // 处理播放承诺，以避免在某些浏览器中的错误
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isMusicPlaying = true;
                    console.log('背景音乐开始播放');
                }).catch(error => {
                    console.error('播放背景音乐时发生错误:', error);
                });
            }
        } catch (error) {
            console.error('播放背景音乐时发生错误:', error);
        }
    }
    
    /**
     * 暂停背景音乐
     */
    pauseBackgroundMusic() {
        if (this.backgroundMusic && this.isMusicPlaying) {
            this.backgroundMusic.pause();
            this.isMusicPlaying = false;
            console.log('背景音乐已暂停');
        }
    }
    
    /**
     * 恢复播放背景音乐
     */
    resumeBackgroundMusic() {
        if (this.enabled && this.backgroundMusic && !this.isMusicPlaying) {
            const playPromise = this.backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isMusicPlaying = true;
                    console.log('背景音乐继续播放');
                }).catch(error => {
                    console.error('恢复背景音乐时发生错误:', error);
                });
            }
        }
    }
    
    /**
     * 加载单个音效
     * @param {string} name - 音效名称
     * @param {string} path - 音效文件路径
     */
    loadSound(name, path) {
        try {
            const sound = new Audio(path);
            sound.volume = this.soundVolume;
            this.sounds[name] = sound;
            
            // 添加加载错误处理
            sound.onerror = (error) => {
                console.error(`音效 ${name} 加载失败:`, error);
            };
            
            // 添加加载成功处理
            sound.oncanplaythrough = () => {
                console.log(`音效 ${name} 加载成功`);
            };
        } catch (error) {
            console.error(`加载音效 ${name} 时发生错误:`, error);
        }
    }
    
    /**
     * 设置音量控制和静音切换的事件监听
     */
    setupListeners() {
        // 获取音量控制滑块
        const soundVolumeSlider = document.getElementById('sound-volume');
        const musicVolumeSlider = document.getElementById('music-volume');
        const muteCheckbox = document.getElementById('mute-sounds');
        
        // 设置音效音量
        if (soundVolumeSlider) {
            soundVolumeSlider.value = this.soundVolume;
            soundVolumeSlider.addEventListener('input', (e) => {
                this.setSoundVolume(parseFloat(e.target.value));
            });
        }
        
        // 设置背景音乐音量
        if (musicVolumeSlider) {
            musicVolumeSlider.value = this.musicVolume;
            musicVolumeSlider.addEventListener('input', (e) => {
                this.setMusicVolume(parseFloat(e.target.value));
            });
        }
        
        // 设置静音切换
        if (muteCheckbox) {
            muteCheckbox.checked = this.enabled;
            muteCheckbox.addEventListener('change', (e) => {
                this.toggleSound(e.target.checked);
            });
        }
    }
    
    /**
     * 播放音效
     * @param {string} name - 音效名称
     */
    play(name) {
        // 如果音效被禁用，则不播放
        if (!this.enabled) return;
        
        const sound = this.sounds[name];
        if (sound) {
            try {
                // 创建克隆以允许同时播放多个相同音效
                const soundClone = sound.cloneNode(true);
                soundClone.volume = this.soundVolume;
                soundClone.play().catch(error => {
                    console.error(`播放音效 ${name} 时发生错误:`, error);
                });
            } catch (error) {
                console.error(`播放音效 ${name} 时发生错误:`, error);
            }
        } else {
            console.warn(`音效 ${name} 不存在`);
        }
    }
    
    /**
     * 设置音效音量
     * @param {number} volume - 音量值（0.0-1.0）
     */
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        
        // 更新所有已加载音效的音量
        for (const name in this.sounds) {
            this.sounds[name].volume = this.soundVolume;
        }
        
        console.log(`音效音量设置为: ${this.soundVolume}`);
    }
    
    /**
     * 设置背景音乐音量
     * @param {number} volume - 音量值（0.0-1.0）
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        // 更新背景音乐音量
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
        
        console.log(`背景音乐音量设置为: ${this.musicVolume}`);
    }
    
    /**
     * 切换音效开关
     * @param {boolean} enabled - 是否启用音效
     */
    toggleSound(enabled) {
        this.enabled = enabled;
        console.log(`音效已${this.enabled ? '启用' : '禁用'}`);
        
        // 如果禁用音效，暂停背景音乐
        if (!this.enabled && this.backgroundMusic) {
            this.pauseBackgroundMusic();
        } 
        // 如果启用音效，恢复背景音乐
        else if (this.enabled && this.backgroundMusic) {
            this.resumeBackgroundMusic();
        }
    }
}

// 创建全局音频管理器实例
window.audioManager = new AudioManager(); 