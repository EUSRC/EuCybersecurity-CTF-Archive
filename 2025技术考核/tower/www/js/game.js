/**
 * 游戏主类
 * 负责管理游戏状态、更新和渲染
 */

const BOSS_SECRET = "BOSSTOKEN_9f8a1c0e_dont_guess_me";
class Game {
    /**
     * 创建游戏实例
     * @param {HTMLCanvasElement} canvas - 游戏画布
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 设置画布大小
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.isGameOver = false;
        // 是否已经显示过 Flag（防止重复触发）
        this.flagShown = false;
        
        // 游戏资源
        this.gold = 100;
        this.lives = 20;
        
        // 游戏对象
        this.map = null;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.explosions = [];
        
        // 敌人生成器
        this.enemySpawner = null;
        
        // 当前选中的塔类型
        this.selectedTowerType = null;
        
        // 当前选中的塔（用于升级）
        this.selectedTower = null;
        
        // 游戏时间和帧率控制
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        
        // 波次信息
        this.waveNumber = 0;
        this.waveInProgress = false;
        
        // 塔操作
        this.towerActions = null;
        
        // 升级和拆除的预览状态
        this.upgradePreview = false;
        this.demolishPreview = false;
        
        // 加载可建造地图标
        this.buildableMarkerImg = new Image();
        this.buildableMarkerImg.src = 'assets/image/buildable_marker.jpeg'; // 使用正确的相对路径
        this.buildableMarkerImg.onload = () => {
            console.log('可建造地图标加载完成');
        };
        this.buildableMarkerImg.onerror = (e) => {
            console.error('可建造地图标加载失败', e);
        };
        
        // 是否显示可建造地图标
        this.showBuildableMarkers = true;
        
        // 预加载敌人图片
        this.enemyImages = [
            'assets/image/Ordinary-enemy.png',
            'assets/image/Fast-enemy.png',
            'assets/image/Armored-enemy.png',
            'assets/image/Special-enemy.png'
        ];
        
        // 记录已加载的图片数量
        this.loadedImagesCount = 0;
        
        // 预加载所有敌人图片
        this.preloadEnemyImages();
        
        // 当前选中的敌人
        this.selectedEnemy = null;
        
        // 初始化游戏
        this.init();
        
        // 将游戏实例存储在全局变量中，以便其他类访问
        window.gameInstance = this;
    }
    
    /**
     * 预加载敌人图片
     */
    preloadEnemyImages() {
        console.log('开始预加载敌人图片...');
        this.enemyImages.forEach(imagePath => {
            const img = new Image();
            img.src = imagePath;
            img.onload = () => {
                this.loadedImagesCount++;
                console.log(`敌人图片加载成功: ${imagePath} (${this.loadedImagesCount}/${this.enemyImages.length})`);
            };
            img.onerror = (e) => {
                console.error(`敌人图片加载失败: ${imagePath}`, e);
            };
        });
    }
    
    /**
     * 初始化游戏
     */
    init() {
        console.log('初始化游戏...');
        
        // 创建地图
        this.map = new GameMap(20, 15, 40); // 20x15格子，每格40像素
        
        // 创建敌人生成器
        this.enemySpawner = new EnemySpawner(this.map.getPathPixels());
        
        // 预加载塔图片
        this.preloadTowerImages();
        
        // 绑定事件监听器
        this.setupEventListeners();
        
        // 更新UI
        this.updateUI();
        
        // 将当前实例保存为全局变量，方便调试
        window.gameInstance = this;

        //调试专用，正式环境记得删除
        /*a2lsbEJvc3MoKeWHveaVsOebtOaOpeiwg+eUqOWPr+S7peS9v0Jvc3Pov5vlhaXomZrlvLHnirbmgIHvvIEKQ2FsbGluZyB0aGUga2lsbEJvc3MoKSBmdW5jdGlvbiBkaXJlY3RseSBjYW4gcHV0IHRoZSBCb3NzIGludG8gYSB3ZWFrZW5lZCBzdGF0ZSE=*/
        
        window.killBoss = function () {
    const boss = gameInstance.enemies.find(e => e.isBoss);
    if (boss) {
        boss.health = 1;
        gameInstance.showNotification(
            "Boss进入虚弱状态",
            gameInstance.canvas.width / 2,
            80, 
            '#00e676'
        );
    } else {
        gameInstance.showNotification(
            "Boss 还未出现！",
            gameInstance.canvas.width / 2,
            80,
            '#ff5252'
        );
    }
};

};
    
    /**
     * 清除所有选中状态
     */
    clearSelections() {
        this.selectedEnemy = null;
        this.selectedTower = null;
        this.towerActions = null;
        
        // 隐藏信息面板
        document.getElementById('enemy-info').classList.add('hidden');
        document.getElementById('tower-detail-info').classList.add('hidden');
    }
    
    /**
     * 预加载塔图片
     */
    preloadTowerImages() {
        console.log('开始预加载塔图片...');
        
        // 塔图片路径
        const towerImages = [
            'assets/image/ArrowTower.png',
            'assets/image/CannonTower.png',
            'assets/image/MagicTower.png',
            'assets/image/StrangefireTower.png'
        ];
        
        // 修改右侧面板中的塔图标
        const updateTowerIcons = () => {
            // 获取所有塔选项
            const towerOptions = document.querySelectorAll('.tower-option');
            
            // 为每个塔选项更新图标
            towerOptions.forEach(option => {
                const towerType = option.getAttribute('data-tower');
                const iconElement = option.querySelector('.tower-icon');
                const img = document.createElement('img');
                
                // 根据塔类型设置图片路径
                switch (towerType) {
                    case 'arrow':
                        img.src = 'assets/image/ArrowTower.png';
                        break;
                    case 'cannon':
                        img.src = 'assets/image/CannonTower.png';
                        break;
                    case 'magic':
                        img.src = 'assets/image/MagicTower.png';
                        break;
                    case 'strangefire':
                        img.src = 'assets/image/StrangefireTower.png';
                        break;
                }
                
                // 设置图片样式
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                
                // 清空原有内容并添加图片
                iconElement.innerHTML = '';
                iconElement.appendChild(img);
            });
        };
        
        // 预加载所有图片
        let loadedCount = 0;
        towerImages.forEach(imagePath => {
            const img = new Image();
            img.src = imagePath;
            img.onload = () => {
                loadedCount++;
                console.log(`塔图片加载成功: ${imagePath} (${loadedCount}/${towerImages.length})`);
                if (loadedCount === towerImages.length) {
                    // 所有图片加载完成后，更新塔图标
                    updateTowerIcons();
                }
            };
            img.onerror = (e) => {
                console.error(`塔图片加载失败: ${imagePath}`, e);
            };
        });
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        console.log('设置事件监听器...');
        
        // 塔选择按钮点击事件
        const towerButtons = document.querySelectorAll('.tower-option');
        towerButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 获取塔类型和成本
                const towerType = button.getAttribute('data-tower');
                const cost = parseInt(button.getAttribute('data-cost'));
                
                // 如果金币不足，显示提示并返回
                if (this.gold < cost) {
                    this.showNotification('金币不足！', this.canvas.width / 2, 100, '#ff5252');
                    return;
                }
                
                // 选择该类型的塔
                towerButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                
                console.log(`选择了${towerType}塔`);
                
                // 设置当前选择的塔类型
                this.selectedTowerType = towerType;
                this.selectedTower = null;
                this.towerActionMode = 'build';
                
                // 更新预览
                this.previewX = -100;
                this.previewY = -100;
                this.previewTowerType = towerType;
                
                // 如果有拆除确认框，隐藏它
                if (this.demolishConfirmElement) {
                    this.demolishConfirmElement.style.display = 'none';
                }
                
                // 如果有升级确认框，隐藏它
                if (this.upgradeConfirmElement) {
                    this.upgradeConfirmElement.style.display = 'none';
                }
            });
        });
        
        // 开始波按钮点击事件
        const startWaveButton = document.getElementById('start-wave');
        startWaveButton.addEventListener('click', () => {
            this.startNextWave();
        });
        
        // 重新开始按钮点击事件
        const restartButton = document.getElementById('restart-game');
        restartButton.addEventListener('click', () => {
            this.restart();
        });
        
        // 画布点击事件
        this.canvas.addEventListener('click', (event) => {
            // 计算点击位置相对于canvas的坐标
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // 首先检查是否点击了塔的操作按钮（升级或拆除）
            if (this.towerActions && this.handleTowerAction(x, y)) {
                console.log('点击了塔的操作按钮');
                return; // 如果处理了塔的操作，不进行其他处理
            }
            
            // 尝试点击敌人
            const clickedEnemy = this.getEnemyAt(x, y);
            if (clickedEnemy) {
                console.log('点击了敌人');
                this.selectEnemy(clickedEnemy);
                // 清除当前的塔操作UI
                this.towerActions = null;
                this.upgradePreview = false;
                this.demolishPreview = false;
                return; // 如果点击了敌人，不执行其他点击逻辑
            }
            
            // 处理点击塔的逻辑已存在，只需修改获取的塔位置后，添加新的显示方法调用
            const clickedTower = this.getTowerAt(x, y);
            if (clickedTower) {
                console.log('点击了塔');
                this.selectedEnemy = null; // 清除已选择的敌人
                this.selectedTower = clickedTower;
                this.towerActionMode = 'info';
                this.showTowerInfo(clickedTower);
                this.showTowerDetailInfo(clickedTower);
                return;
            }
            
            // 如果没有点击敌人或塔，清除选中状态
            this.clearSelections();
            
            // 继续处理其他点击逻辑...
            this.handleCanvasClick(x, y);
        });
        
        // 画布鼠标移动事件（用于塔预览）
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // 如果当前有选择的塔类型，显示预览
            if (this.selectedTowerType) {
                // 计算当前鼠标位置对应的地图格子
                const gridX = Math.floor(x / this.map.tileSize);
                const gridY = Math.floor(y / this.map.tileSize);
                
                // 更新预览位置
                this.previewX = gridX * this.map.tileSize + this.map.tileSize / 2;
                this.previewY = gridY * this.map.tileSize + this.map.tileSize / 2;
            }
        });
        
        // 键盘事件
        document.addEventListener('keydown', (event) => {
            // 按ESC键取消选择
            if (event.key === 'Escape') {
                this.selectedTowerType = null;
                this.towerActionMode = null;
                this.selectedTower = null;
                
                // 移除塔选择按钮的选中状态
                const towerButtons = document.querySelectorAll('.tower-option');
                towerButtons.forEach(btn => btn.classList.remove('selected'));
                
                // 隐藏确认框
                if (this.demolishConfirmElement) {
                    this.demolishConfirmElement.style.display = 'none';
                }
                if (this.upgradeConfirmElement) {
                    this.upgradeConfirmElement.style.display = 'none';
                }
            }
            
            // 按B键显示/隐藏可建造区域标记
            if (event.key === 'b' || event.key === 'B') {
                this.showBuildableMarkers = !this.showBuildableMarkers;
            }
        });
    }
    
    /**
     * 获取指定位置的塔
     * @param {number} x - 位置的x坐标
     * @param {number} y - 位置的y坐标
     * @returns {Tower|null} - 位置上的塔，如果没有则返回null
     */
    getTowerAt(x, y) {
        for (const tower of this.towers) {
            const distance = Utils.distance(x, y, tower.x, tower.y);
            if (distance <= tower.size / 2) {
                return tower;
            }
        }
        return null;
    }
    
    /**
     * 显示塔的信息（用于升级或拆除）
     * @param {Tower} tower - 要显示信息的塔
     */
    showTowerInfo(tower) {
        // 保存当前选中的塔
        this.selectedTower = tower;
        
        // 重置预览状态
        this.upgradePreview = false;
        this.demolishPreview = false;
        
        console.log(`选中塔: 等级 ${tower.level}, 伤害 ${tower.damage}, 范围 ${tower.range}`);
        
        // 检查是否可以升级
        const upgradeCost = tower.getUpgradeCost();
        const canUpgrade = upgradeCost > 0 && this.gold >= upgradeCost;
        
        // 在下一帧渲染时，将绘制这些按钮
        this.towerActions = {
            tower: tower,
            upgrade: {
                x: tower.x + 30,
                y: tower.y,
                radius: 15,
                cost: upgradeCost,
                available: canUpgrade,
                action: 'upgrade'
            },
            demolish: {
                x: tower.x - 30,
                y: tower.y,
                radius: 15,
                refund: Math.floor(tower.cost * 0.6), // 拆除返还60%的建造费用
                action: 'demolish'
            }
        };
    }
    
    /**
     * 处理塔的操作（升级或拆除）
     * @param {number} x - 点击位置的x坐标
     * @param {number} y - 点击位置的y坐标
     * @returns {boolean} - 如果处理了操作则返回true
     */
    handleTowerAction(x, y) {
        if (!this.towerActions) return false;
        
        // 检查是否点击了升级按钮
        const upgradeBtn = this.towerActions.upgrade;
        const upgradeDistance = Utils.distance(x, y, upgradeBtn.x, upgradeBtn.y);
        if (upgradeDistance <= upgradeBtn.radius) {
            if (this.upgradePreview) {
                // 第二次点击
                if (upgradeBtn.available) {
                    // 条件满足，执行升级
                    console.log('确认升级塔');
                    this.upgradeTower();
                } else {
                    // 条件不满足，但已经在预览状态，提示用户
                    console.log('无法升级塔：金币不足或已达最高等级');
                    
                    // 检查是否是因为金币不足
                    if (this.selectedTower) {
                        const upgradeCost = this.selectedTower.getUpgradeCost();
                        if (upgradeCost > 0 && this.gold < upgradeCost) {
                            // 显示金币不足的提示
                            this.showNotification('金币不足，无法升级', this.selectedTower.x, this.selectedTower.y, '#FF0000');
                        } else if (this.selectedTower.level >= this.selectedTower.maxLevel) {
                            // 显示已达最高等级的提示
                            this.showNotification('已达最高等级', this.selectedTower.x, this.selectedTower.y, '#FFFF00');
                        }
                    }
                }
                // 无论如何，清除预览状态
                this.upgradePreview = false;
                this.demolishPreview = false;
                this.towerActions = null; // 清除操作界面
            } else {
                // 第一次点击，显示预览（无论是否可用都显示预览）
                console.log(upgradeBtn.available ? '预览升级塔效果' : '金币不足或已达最高等级，预览升级效果');
                this.upgradePreview = true;
                this.demolishPreview = false;
                
                // 如果不可用，检查是否是因为金币不足
                if (!upgradeBtn.available && this.selectedTower) {
                    const upgradeCost = this.selectedTower.getUpgradeCost();
                    if (upgradeCost > 0 && this.gold < upgradeCost) {
                        // 显示金币不足的提示
                        this.showNotification('金币不足', this.selectedTower.x, this.selectedTower.y - 40, '#FF0000');
                    }
                }
            }
            return true;
        }
        
        // 检查是否点击了拆除按钮
        const demolishBtn = this.towerActions.demolish;
        const demolishDistance = Utils.distance(x, y, demolishBtn.x, demolishBtn.y);
        if (demolishDistance <= demolishBtn.radius) {
            if (this.demolishPreview) {
                // 第二次点击，执行拆除
                console.log('确认拆除塔，获得退款：', demolishBtn.refund);
                this.demolishTower(this.towerActions.tower, demolishBtn.refund);
                this.upgradePreview = false;
                this.demolishPreview = false;
                this.towerActions = null; // 清除操作界面
            } else {
                // 第一次点击，显示预览
                console.log('预览拆除塔效果');
                this.demolishPreview = true;
                this.upgradePreview = false;
            }
            return true;
        }
        
        // 如果点击的是其他区域，清除操作界面和预览状态
        this.upgradePreview = false;
        this.demolishPreview = false;
        this.towerActions = null;
        return false;
    }
    
    /**
     * 拆除塔
     * @param {Tower} tower - 要拆除的塔
     * @param {number} refund - 退款金额
     */
    demolishTower(tower, refund) {
        // 从塔数组中移除塔
        const index = this.towers.indexOf(tower);
        if (index !== -1) {
            this.towers.splice(index, 1);
            // 退款
            this.gold += refund;
            console.log(`塔已拆除，获得退款: ${refund}金币，当前金币: ${this.gold}`);
            // 更新UI
            this.updateUI();
        }
    }
    
    /**
     * 处理画布点击事件
     * @param {number} x - 点击位置的x坐标
     * @param {number} y - 点击位置的y坐标
     */
    handleCanvasClick(x, y) {
        // 首先检查是否点击了塔的操作按钮
        if (this.handleTowerAction(x, y)) {
            return; // 如果处理了塔的操作，不进行其他处理
        }
        
        // 获取点击的格子坐标
        const gridX = Math.floor(x / this.map.tileSize);
        const gridY = Math.floor(y / this.map.tileSize);
        
        // 检查是否点击了现有的塔（用于升级）
        const clickedTower = this.getTowerAt(x, y);
        
        if (clickedTower) {
            // 选中塔进行升级或拆除
            this.selectedTowerType = null;
            
            // 取消选中塔类型按钮
            const towerOptions = document.querySelectorAll('.tower-option');
            towerOptions.forEach(opt => opt.classList.remove('selected'));
            
            // 显示塔信息和操作按钮
            this.showTowerInfo(clickedTower);
            this.showTowerDetailInfo(clickedTower);
        } else if (this.selectedTowerType) {
            // 尝试在点击位置建造选中类型的塔
            this.buildTower(this.selectedTowerType, gridX, gridY);
        } else {
            // 如果没有选中塔也没有选中塔类型，清除所有选中状态
            this.selectedTower = null;
            this.towerActions = null;
            this.upgradePreview = false;
            this.demolishPreview = false;
        }
    }
    
    /**
     * 建造防御塔
     * @param {string} towerType - 塔的类型
     * @param {number} gridX - 地图格子的x坐标
     * @param {number} gridY - 地图格子的y坐标
     * @returns {boolean} - 如果建造成功则返回true
     */
    buildTower(towerType, gridX, gridY) {
        // 检查指定位置是否可以放置防御塔
        if (!this.map.canPlaceTower(gridX, gridY)) {
            this.showNotification('不能在此处建造塔！', this.canvas.width / 2, 100, '#ff5252');
            return false;
        }
        
        // 检查该位置是否已经有塔
        const tileCenter = {
            x: gridX * this.map.tileSize + this.map.tileSize / 2,
            y: gridY * this.map.tileSize + this.map.tileSize / 2
        };
        
        for (const tower of this.towers) {
            if (tower.x === tileCenter.x && tower.y === tileCenter.y) {
                // 如果已经存在塔，询问是否升级或拆除
                this.selectedTower = tower;
                this.showTowerInfo(tower);
                return false;
            }
        }
        
        // 根据类型创建不同的塔
        let tower;
        let cost = 0;
        
        switch (towerType) {
            case 'arrow':
                tower = new ArrowTower(tileCenter.x, tileCenter.y);
                cost = 50;
                break;
            case 'cannon':
                tower = new CannonTower(tileCenter.x, tileCenter.y);
                cost = 100;
                break;
            case 'magic':
                tower = new MagicTower(tileCenter.x, tileCenter.y);
                cost = 150;
                break;
            case 'strangefire':
                tower = new StrangefireTower(tileCenter.x, tileCenter.y);
                cost = 125;
                break;
            default:
                this.showNotification('无效的塔类型！', this.canvas.width / 2, 100, '#ff5252');
                return false;
        }
        
        // 检查金币是否足够
        if (this.gold < cost) {
            this.showNotification('金币不足！', this.canvas.width / 2, 100, '#ff5252');
            return false;
        }
        
        // 扣除金币并添加塔
        this.gold -= cost;
        this.towers.push(tower);
        
        // 播放建造塔音效
        if (window.audioManager) {
            window.audioManager.play('buildTower');
        }
        
        // 重置选择状态
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.towerActionMode = null;
        
        // 更新UI
        this.updateUI();
        
        // 显示建造成功消息
        this.showNotification(`建造${towerType}塔成功！`, this.canvas.width / 2, 100, '#4caf50');
        
        return true;
    }
    
    /**
     * 升级选中的塔
     */
    upgradeTower() {
        if (!this.selectedTower) return;
        
        const upgradeCost = this.selectedTower.getUpgradeCost();
        
        // 检查是否可以升级
        if (upgradeCost <= 0) {
            console.log('塔已达到最高等级');
            return;
        }
        
        // 检查金币是否足够
        if (this.gold < upgradeCost) {
            console.log('金币不足');
            return;
        }
        
        // 扣除金币并升级塔
        this.gold -= upgradeCost;
        this.selectedTower.upgrade();
        
        // 播放升级塔音效
        if (window.audioManager) {
            window.audioManager.play('upgradeTower');
        }
        
        // 更新UI
        this.updateUI();
        this.showTowerInfo(this.selectedTower);
    }
    
    /**
     * 开始下一波敌人
     */
    startNextWave() {
        // 如果当前有波次正在进行中，不允许开始新的波次
        if (this.waveInProgress) {
            console.log('无法开始新的波次：当前波次正在进行中');
            return;
        }
        
        console.log('开始新的波次，场上敌人数量:', this.enemies.length);
        
        // 检查地图路径
        const pathPixels = this.map.getPathPixels();
        console.log('地图路径点数量:', pathPixels.length);
        if (pathPixels.length === 0) {
            console.error('错误：地图路径为空！');
            return;
        }
        
        // 注意：不要在这里调用 this.map.resetMap()，这会导致路径变化
        
        // 更新敌人生成器的路径（确保使用当前地图的路径）
        this.enemySpawner.path = pathPixels;
        console.log('已更新敌人生成器路径，路径点数量:', this.enemySpawner.path.length);
        
        // 开始新的一波敌人
        this.enemySpawner.startWave();
        this.waveNumber = this.enemySpawner.waveNumber;
        this.waveInProgress = true;
        console.log('波次已开始，波次编号:', this.waveNumber, '将生成敌人数量:', this.enemySpawner.enemiesInWave);
        
        // 输出第一个敌人的生成时间
        console.log('第一个敌人将在下一帧生成，计时器状态:', this.enemySpawner.timeSinceLastSpawn, '/', this.enemySpawner.spawnInterval);
        
        // 更新UI
        this.updateUI();
    }
    
    /**
     * 添加爆炸效果
     * @param {number} x - 爆炸中心的x坐标
     * @param {number} y - 爆炸中心的y坐标
     * @param {number} radius - 爆炸半径
     */
    addExplosion(x, y, radius) {
        this.explosions.push({
            x: x,
            y: y,
            radius: radius,
            currentRadius: 0,
            maxRadius: radius,
            duration: 0.3, // 爆炸持续时间（秒）
            elapsed: 0 // 已经过时间
        });
    }
    
    /**
     * 打印当前敌人数量（用于调试）
     */
    logEnemiesCount() {
        console.log(`当前场上敌人数量: ${this.enemies.length}`);
    }
    
    /**
     * 更新游戏状态
     * @param {number} timestamp - 当前时间戳
     */
    update(timestamp) {
        // 计算帧间隔时间
        if (!this.lastFrameTime) {
            this.lastFrameTime = timestamp;
        }
        
        this.deltaTime = (timestamp - this.lastFrameTime) / 1000; // 转换为秒
        this.lastFrameTime = timestamp;
        
        // 限制deltaTime，防止卡顿时物理计算出问题
        if (this.deltaTime > 0.1) this.deltaTime = 0.1;
        
        // 如果游戏暂停或结束，不更新游戏逻辑
        if (this.isPaused || this.isGameOver) return;
        
        // 更新通知信息
        if (this.notifications && this.notifications.length > 0) {
            for (let i = this.notifications.length - 1; i >= 0; i--) {
                const notification = this.notifications[i];
                notification.elapsed += this.deltaTime;
                
                // 更新透明度
                notification.alpha = 1.0 - (notification.elapsed / notification.lifetime);
                
                // 向上移动通知
                notification.y -= 30 * this.deltaTime;
                
                // 移除过期的通知
                if (notification.elapsed >= notification.lifetime) {
                    this.notifications.splice(i, 1);
                }
            }
        }
        
        // 重要：先检查场上是否已经没有敌人了
        if (this.waveInProgress && this.enemies.length === 0) {
            // 检查敌人生成器是否已经完成当前波次
            if (this.enemySpawner.enemiesInWave <= 0) {
                // 确保状态一致：场上没有敌人且没有待生成的敌人，则波次结束
                this.waveInProgress = false;
                console.log('波次结束检测：场上没有敌人且没有待生成的敌人，波次结束');
                this.logEnemiesCount();
                
                // 在这里不要重置地图！否则会导致路径变化，影响下一波敌人生成
                // 错误示例：this.map.resetMap();
                
                // 输出地图路径信息，确认路径未变化
                const pathPixels = this.map.getPathPixels();
                console.log('波次结束后的地图路径点数量:', pathPixels.length);
            }
        }
        
        // 更新敌人生成器
        if (this.waveInProgress) {
            const waveCompleted = this.enemySpawner.update(this.deltaTime, this.enemies);
            
            // 如果当前波次的敌人已全部生成，且场上没有敌人，则波次结束
            if (waveCompleted && this.enemies.length === 0) {
                this.waveInProgress = false;
                console.log('波次结束，可以开始下一波');
                this.logEnemiesCount();
                
                // 在这里不要重置地图！否则会导致路径变化，影响下一波敌人生成
                // 错误示例：this.map.resetMap();
                
                // 输出地图路径信息，确认路径未变化
                const pathPixels = this.map.getPathPixels();
                console.log('波次结束后的地图路径点数量:', pathPixels.length);
            }
        }
        
        // 更新敌人
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const removed = enemy.update(this.deltaTime);
            
            // 如果当前选中的敌人还存在，更新其信息
            if (this.selectedEnemy === enemy && !removed) {
                this.showEnemyInfo(enemy);
            }
            
            // 如果选中的敌人被移除，清除选中状态
            if (this.selectedEnemy === enemy && removed) {
                this.clearSelections();
            }
            
            if (removed) {
                // 如果敌人到达终点
                if (enemy.reachedEnd) {
                    this.lives -= enemy.lifeDamage;
                    console.log(`敌人到达终点，扣除${enemy.lifeDamage}点生命值，剩余生命值: ${this.lives}`);
                    
                    // 检查游戏是否结束，只有在生命值降到0或以下时才结束游戏
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                } else if (enemy.isDead) {
                    // 如果敌人被击杀，获得金币
                    this.gold += enemy.reward;
                    console.log(`敌人被击杀，获得金币: ${enemy.reward}，当前金币: ${this.gold}`);
                    
                    // 播放敌人死亡音效
                    if (window.audioManager) {
                        window.audioManager.play('enemyDeath');
                    }

                    // 击杀 Boss 敌人时触发 Flag
                    try {
                        if ((typeof BossEnemy !== 'undefined' && enemy instanceof BossEnemy) || enemy.isBoss) {
                            this.showFlag();
                        }
                    } catch (e) {
                        // 兼容没有定义 BossEnemy 构造函数但打了 isBoss 标记的情况
                        if (enemy.isBoss) {
                            this.showFlag();
                        }
                    }
                }
                
                // 移除敌人
                this.enemies.splice(i, 1);
                console.log('敌人已移除');
                this.logEnemiesCount();
                
                // 检查是否所有敌人都已清空，且没有新的敌人要生成
                if (this.enemies.length === 0 && this.waveInProgress && this.enemySpawner.enemiesInWave <= 0) {
                    this.waveInProgress = false;
                    console.log('最后一个敌人被移除，波次结束');
                }
                
                // 更新UI
                this.updateUI();
            }
        }
        
        // 更新防御塔
        for (const tower of this.towers) {
            tower.update(this.deltaTime, this.enemies, this.projectiles);
        }
        
        // 更新投射物
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            const removed = projectile.update(this.deltaTime);
            
            if (removed) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // 更新爆炸效果
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.elapsed += this.deltaTime;
            
            // 更新爆炸半径
            const progress = explosion.elapsed / explosion.duration;
            explosion.currentRadius = explosion.maxRadius * Math.sin(progress * Math.PI);
            
            // 移除完成的爆炸
            if (explosion.elapsed >= explosion.duration) {
                this.explosions.splice(i, 1);
            }
        }
    }
    
    /**
     * 渲染游戏
     */
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制地图
        this.map.draw(this.ctx);
        
        // 绘制可建造地图标
        this.drawBuildableMarkers();
        
        // 绘制选中的敌人指示器
        if (this.selectedEnemy && !this.selectedEnemy.isDead && !this.selectedEnemy.reachedEnd) {
            this.ctx.beginPath();
            this.ctx.arc(this.selectedEnemy.x, this.selectedEnemy.y, this.selectedEnemy.radius + 5, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // 添加选中指示箭头
            this.ctx.beginPath();
            this.ctx.moveTo(this.selectedEnemy.x, this.selectedEnemy.y - this.selectedEnemy.radius - 15);
            this.ctx.lineTo(this.selectedEnemy.x - 5, this.selectedEnemy.y - this.selectedEnemy.radius - 8);
            this.ctx.lineTo(this.selectedEnemy.x + 5, this.selectedEnemy.y - this.selectedEnemy.radius - 8);
            this.ctx.closePath();
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
            this.ctx.fill();
        }
        
        // 绘制敌人
        for (const enemy of this.enemies) {
            if (!enemy.isDead && !enemy.reachedEnd) {
                enemy.draw(this.ctx);
            }
        }
        
        // 绘制投射物
        for (const projectile of this.projectiles) {
            projectile.draw(this.ctx);
        }
        
        // 绘制防御塔
        for (const tower of this.towers) {
            tower.draw(this.ctx);
            
            // 如果选中了塔，在其周围绘制范围圈
            if (tower === this.selectedTower) {
                let rangeColor;
                let rangeFillColor;
                
                if (tower instanceof ArrowTower) {
                    rangeColor = 'rgba(52, 152, 219, 0.8)'; // 蓝色，箭塔
                    rangeFillColor = 'rgba(52, 152, 219, 0.1)';
                } else if (tower instanceof CannonTower) {
                    rangeColor = 'rgba(243, 156, 18, 0.8)'; // 橙色，炮塔
                    rangeFillColor = 'rgba(243, 156, 18, 0.1)';
                } else if (tower instanceof MagicTower) {
                    rangeColor = 'rgba(155, 89, 182, 0.8)'; // 紫色，魔法塔
                    rangeFillColor = 'rgba(155, 89, 182, 0.1)';
                } else if (tower instanceof StrangefireTower) {
                    rangeColor = 'rgba(255, 109, 0, 0.8)'; // 橙红色，异火塔
                    rangeFillColor = 'rgba(255, 109, 0, 0.1)';
                } else {
                    rangeColor = 'rgba(255, 255, 255, 0.5)';
                    rangeFillColor = 'rgba(255, 255, 255, 0.1)';
                }
                
                // 绘制选中指示器
                this.ctx.beginPath();
                this.ctx.arc(tower.x, tower.y, tower.size / 2 + 5, 0, Math.PI * 2);
                this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // 绘制范围圈
                this.ctx.beginPath();
                this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
                this.ctx.fillStyle = rangeFillColor;
                this.ctx.fill();
                this.ctx.strokeStyle = rangeColor;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // 如果正在预览升级
                if (this.upgradePreview && tower && this.selectedTower) {
                    let upgradedRange;
                    
                    // 根据不同的塔类型创建临时塔
                    let tempTower;
                    if (tower instanceof ArrowTower) {
                        tempTower = new ArrowTower(tower.x, tower.y);
                    } else if (tower instanceof CannonTower) {
                        tempTower = new CannonTower(tower.x, tower.y);
                    } else if (tower instanceof MagicTower) {
                        tempTower = new MagicTower(tower.x, tower.y);
                    } else if (tower instanceof StrangefireTower) {
                        tempTower = new StrangefireTower(tower.x, tower.y);
                    }
                    
                    // 设置临时塔的等级与当前塔相同
                    if (tempTower) {
                        tempTower.level = tower.level;
                        tempTower.range = tower.range;
                        tempTower.damage = tower.damage;
                        tempTower.fireRate = tower.fireRate;
                        
                        // 如果是异火塔，还需复制特有属性
                        if (tempTower instanceof StrangefireTower && tower instanceof StrangefireTower) {
                            tempTower.slowFactor = tower.slowFactor;
                            tempTower.slowDuration = tower.slowDuration;
                            tempTower.waveRadius = tower.waveRadius;
                        }
                        
                        // 模拟升级
                        tempTower.upgrade();
                        upgradedRange = tempTower.range;
                    } else {
                        // 如果无法创建临时塔，使用默认1.2倍范围
                        upgradedRange = tower.range * 1.2;
                    }
                    
                    this.ctx.beginPath();
                    this.ctx.arc(tower.x, tower.y, upgradedRange, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                    this.ctx.fill();
                }
                
                // 如果正在预览拆除
                if (this.demolishPreview && tower && this.selectedTower) {
                    this.ctx.beginPath();
                    this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                    this.ctx.fill();
                }
            }
        }
        
        // 绘制爆炸效果
        for (const explosion of this.explosions) {
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.currentRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 160, 80, ${1 - explosion.elapsed / explosion.duration})`; // 更温暖的橙色
            this.ctx.fill();
            
            // 添加外发光效果
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.currentRadius * 1.2, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 160, 80, ${(1 - explosion.elapsed / explosion.duration) * 0.5})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        // 绘制塔的操作按钮
        if (this.towerActions) {
            // 绘制升级按钮
            const upgradeBtn = this.towerActions.upgrade;
            this.ctx.beginPath();
            this.ctx.arc(upgradeBtn.x, upgradeBtn.y, upgradeBtn.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = upgradeBtn.available ? '#81c784' : '#bdbdbd'; // 更柔和的绿色/灰色
            this.ctx.fill();
            
            // 添加按钮光效
            if (upgradeBtn.available) {
                this.ctx.beginPath();
                this.ctx.arc(upgradeBtn.x, upgradeBtn.y, upgradeBtn.radius - 2, 0, Math.PI * 2);
                this.ctx.fillStyle = '#a5d6a7'; // 更亮的绿色内环
                this.ctx.fill();
            }
            
            // 绘制升级箭头
            this.ctx.beginPath();
            this.ctx.moveTo(upgradeBtn.x, upgradeBtn.y - 8);
            this.ctx.lineTo(upgradeBtn.x - 5, upgradeBtn.y - 3);
            this.ctx.lineTo(upgradeBtn.x + 5, upgradeBtn.y - 3);
            this.ctx.closePath();
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.moveTo(upgradeBtn.x, upgradeBtn.y + 8);
            this.ctx.lineTo(upgradeBtn.x, upgradeBtn.y - 3);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.stroke();
            
            // 绘制升级费用
            if (upgradeBtn.cost > 0) {
                this.ctx.font = 'bold 10px Arial';
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(upgradeBtn.cost, upgradeBtn.x, upgradeBtn.y + 15);
            }
            
            // 绘制拆除按钮
            const demolishBtn = this.towerActions.demolish;
            this.ctx.beginPath();
            this.ctx.arc(demolishBtn.x, demolishBtn.y, demolishBtn.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ef9a9a'; // 更柔和的红色
            this.ctx.fill();
            
            // 添加按钮光效
            this.ctx.beginPath();
            this.ctx.arc(demolishBtn.x, demolishBtn.y, demolishBtn.radius - 2, 0, Math.PI * 2);
            this.ctx.fillStyle = '#f4c2c2'; // 更亮的红色内环
            this.ctx.fill();
            
            // 绘制X符号
            this.ctx.beginPath();
            this.ctx.moveTo(demolishBtn.x - 5, demolishBtn.y - 5);
            this.ctx.lineTo(demolishBtn.x + 5, demolishBtn.y + 5);
            this.ctx.moveTo(demolishBtn.x + 5, demolishBtn.y - 5);
            this.ctx.lineTo(demolishBtn.x - 5, demolishBtn.y + 5);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.stroke();
            
            // 绘制退款金额
            this.ctx.font = 'bold 10px Arial';
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(demolishBtn.refund, demolishBtn.x, demolishBtn.y + 15);
        }
        
        // 如果有选中的塔类型，绘制预览
        if (this.selectedTowerType && !this.isGameOver) {
            this.drawTowerPreview();
        }
        
        // 渲染通知
        if (this.notifications && this.notifications.length > 0) {
            for (const notification of this.notifications) {
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                
                // 添加文字描边效果提高可读性
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.lineWidth = 3;
                this.ctx.globalAlpha = notification.alpha * 0.5;
                this.ctx.strokeText(notification.text, notification.x, notification.y);
                
                // 绘制文字
                this.ctx.fillStyle = notification.color;
                this.ctx.globalAlpha = notification.alpha;
                this.ctx.fillText(notification.text, notification.x, notification.y);
            }
            this.ctx.globalAlpha = 1.0;
        }
        
        // 如果游戏结束，绘制游戏结束覆盖层
        if (this.isGameOver) {
            this.drawGameOverOverlay();
        }
    }
    
    /**
     * 绘制塔预览
     */
    drawTowerPreview() {
        // 当鼠标悬停在地图上且有选择的塔类型时，绘制塔预览
        if (this.selectedTowerType && this.previewX >= 0 && this.previewY >= 0) {
            const gridX = Math.floor(this.previewX / this.map.tileSize);
            const gridY = Math.floor(this.previewY / this.map.tileSize);
            
            // 检查是否可以在此位置放置塔
            const canPlace = this.map.canPlaceTower(gridX, gridY) && !this.getTowerAt(this.previewX, this.previewY);
            
            // 计算塔的预览位置（格子中心）
            const towerX = gridX * this.map.tileSize + this.map.tileSize / 2;
            const towerY = gridY * this.map.tileSize + this.map.tileSize / 2;
            
            // 设置塔的大小和范围（根据类型）
            let range = 0;
            const towerSize = 30;
            let color = canPlace ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
            
            switch (this.selectedTowerType) {
                case 'arrow':
                    range = 150;
                    color = canPlace ? 'rgba(52, 152, 219, 0.3)' : 'rgba(255, 0, 0, 0.3)';
                    break;
                case 'cannon':
                    range = 100;
                    color = canPlace ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 0, 0, 0.3)';
                    break;
                case 'magic':
                    range = 100;
                    color = canPlace ? 'rgba(155, 89, 182, 0.3)' : 'rgba(255, 0, 0, 0.3)';
                    break;
                case 'strangefire':
                    range = 120;
                    color = canPlace ? 'rgba(255, 109, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
                    break;
            }
            
            // 绘制塔的范围圈
            this.ctx.beginPath();
            this.ctx.arc(towerX, towerY, range, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            
            // 绘制塔的预览（简化版）
            this.ctx.beginPath();
            this.ctx.rect(towerX - towerSize / 2, towerY - towerSize / 2, towerSize, towerSize);
            this.ctx.fillStyle = canPlace ? color.replace('0.3', '0.6') : 'rgba(255, 0, 0, 0.6)';
            this.ctx.fill();
            
            // 在塔预览上方显示提示文本
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            
            if (canPlace) {
                this.ctx.fillText(`点击建造${this.getTowerTypeName(this.selectedTowerType)}`, towerX, towerY - towerSize / 2 - 10);
            } else {
                this.ctx.fillText('无法在此处建造', towerX, towerY - towerSize / 2 - 10);
            }
        }
    }
    
    /**
     * 获取塔类型的中文名称
     * @param {string} towerType - 塔类型
     * @returns {string} - 塔类型的中文名称
     */
    getTowerTypeName(towerType) {
        switch (towerType) {
            case 'arrow':
                return '箭塔';
            case 'cannon':
                return '炮塔';
            case 'magic':
                return '魔法塔';
            case 'strangefire':
                return '异火塔';
            default:
                return '未知塔';
        }
    }
    
    /**
     * 绘制可建造地图标
     */
    drawBuildableMarkers() {
        // 只有当显示标记选项开启时才绘制
        if (!this.showBuildableMarkers) return;
        
        // 遍历地图上的每个格子
        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                // 检查是否是可建造区域
                if (this.map.getTile(x, y) === this.map.TILE_TYPES.BUILDABLE) {
                    const pixelX = x * this.map.tileSize + this.map.tileSize / 2;
                    const pixelY = y * this.map.tileSize + this.map.tileSize / 2;
                    
                    // 检查该位置是否已有塔
                    let hasTower = false;
                    for (const tower of this.towers) {
                        const distance = Utils.distance(pixelX, pixelY, tower.x, tower.y);
                        if (distance < this.map.tileSize / 2) {
                            hasTower = true;
                            break;
                        }
                    }
                    
                    // 如果没有塔，绘制标记
                    if (!hasTower) {
                        const iconSize = this.map.tileSize * 0.6; // 标记大小为格子的60%
                        
                        // 绘制带有边框的标记
                        this.ctx.save();
                        // 如果没有选择塔类型，降低不透明度使图标更不显眼
                        this.ctx.globalAlpha = this.selectedTowerType ? 0.8 : 0.5;
                        
                        // 绘制图标
                        this.ctx.drawImage(
                            this.buildableMarkerImg,
                            pixelX - iconSize / 2,
                            pixelY - iconSize / 2,
                            iconSize,
                            iconSize
                        );
                        
                        this.ctx.restore();
                    }
                }
            }
        }
    }
    
    /**
     * 更新UI界面
     */
    updateUI() {
        // 更新金币显示
        const goldElement = document.querySelector('#gold span');
        if (goldElement) {
            goldElement.textContent = this.gold;
        }
        
        // 更新生命值显示
        const livesElement = document.querySelector('#lives span');
        if (livesElement) {
            livesElement.textContent = this.lives;
        }
        
        // 更新波次显示
        const waveElement = document.querySelector('#wave span');
        if (waveElement) {
            waveElement.textContent = this.waveNumber;
        }
        
        // 样式美化
        document.querySelectorAll('.resource-counter').forEach(element => {
            element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.2)';
            element.style.fontWeight = 'bold';
        });
        
        // 更新开始波次按钮状态
        const startWaveButton = document.getElementById('start-wave');
        if (startWaveButton) {
            // 如果有波次正在进行或游戏已结束，禁用按钮
            startWaveButton.disabled = this.waveInProgress || this.isGameOver || this.enemies.length > 0;
            
            // 美化按钮
            startWaveButton.style.transition = 'all 0.3s ease';
            if (startWaveButton.disabled) {
                startWaveButton.style.opacity = '0.7';
                startWaveButton.style.cursor = 'not-allowed';
                startWaveButton.classList.remove('pulsate');
            } else {
                startWaveButton.style.opacity = '1';
                startWaveButton.style.cursor = 'pointer';
                // 添加脉动效果
                startWaveButton.classList.add('pulsate');
            }
        }
        
        // 更新塔选择按钮状态
        const towerOptions = document.querySelectorAll('.tower-option');
        towerOptions.forEach(option => {
            const towerCost = parseInt(option.getAttribute('data-cost'));
            const towerType = option.getAttribute('data-tower');
            
            // 清除所有状态
            option.classList.remove('disabled');
            option.classList.remove('selected');
            
            // 如果是选中的塔类型，添加选中状态
            if (this.selectedTowerType === towerType) {
                option.classList.add('selected');
            }
            
            // 如果金币不足或游戏结束，添加禁用状态
            if (this.gold < towerCost || this.isGameOver) {
                option.classList.add('disabled');
            }
        });
        
        // 如果是游戏结束状态，更新游戏结束UI
        if (this.isGameOver) {
            const gameOverElement = document.getElementById('game-over');
            const finalWaveElement = document.getElementById('final-wave');
            
            if (gameOverElement && finalWaveElement) {
                finalWaveElement.textContent = this.waveNumber;
                gameOverElement.classList.remove('hidden');
            }
        }
    }
    
    /**
     * 游戏结束
     */
    gameOver() {
        this.isGameOver = true;
        
        // 播放游戏结束音效
        if (window.audioManager) {
            window.audioManager.play('gameOver');
            
            // 暂停背景音乐
            window.audioManager.pauseBackgroundMusic();
        }
        
        // 显示游戏结束界面
        const gameOverElement = document.getElementById('game-over');
        gameOverElement.classList.remove('hidden');
        
        // 显示最终波次
        document.getElementById('final-wave').textContent = this.waveNumber;
        
        console.log('游戏结束，坚持了 ' + this.waveNumber + ' 波');
    }
    
    /**
     * 重新开始游戏
     */
    restart() {
        console.log('重新开始游戏');
        
        // 重置游戏状态
        this.isRunning = true;
        this.isPaused = false;
        this.isGameOver = false;
        this.flagShown = false;
        
        // 重新播放背景音乐
        if (window.audioManager) {
            window.audioManager.playBackgroundMusic();
        }
        
        this.gold = 100;
        this.lives = 20;
        
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.explosions = [];
        
        this.waveNumber = 0;
        this.waveInProgress = false;
        
        // 重新初始化地图和敌人生成器
        console.log('重新生成地图和路径');
        // 重新生成随机路径
        this.map.generateRandomPath();
        
        // 获取新的路径
        const pathPixels = this.map.getPathPixels();
        console.log('新地图路径点数量:', pathPixels.length);
        
        // 创建新的敌人生成器
        this.enemySpawner = new EnemySpawner(pathPixels);
        console.log('已创建新的敌人生成器');
        
        // 隐藏游戏结束界面
        const gameOverElement = document.getElementById('game-over');
        gameOverElement.classList.add('hidden');
        
        // 更新UI
        this.updateUI();
    }
    
    /**
     * 游戏主循环
     * @param {number} timestamp - 当前时间戳
     */
    gameLoop(timestamp) {
        // 更新游戏状态
        this.update(timestamp);
        
        // 渲染游戏
        this.render();
        
        // 继续下一帧
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    /**
     * 开始游戏
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastFrameTime = 0;
        
        // 开始游戏循环
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    /**
     * 暂停游戏
     */
    pause() {
        this.isPaused = !this.isPaused;
        
        // 处理背景音乐
        if (window.audioManager) {
            if (this.isPaused) {
                // 如果游戏暂停，暂停背景音乐
                window.audioManager.pauseBackgroundMusic();
            } else {
                // 如果游戏恢复，继续播放背景音乐
                window.audioManager.resumeBackgroundMusic();
            }
        }
    }
    
    /**
     * 显示提示信息
     * @param {string} text - 提示文本
     * @param {number} x - 显示位置的x坐标
     * @param {number} y - 显示位置的y坐标
     * @param {string} color - 文本颜色
     */

    /**
     * 显示 CTF Flag（在击杀 Boss 敌人时触发）
     */
showFlag() {
    if (this.flagShown) return;
    this.flagShown = true;

    const raw = BOSS_SECRET + ":boss_dead";
    const token = btoa(raw);

    fetch("getflag.php?token=" + encodeURIComponent(token))
        .then(res => res.text())
        .then(flag => {
            // 弹窗显示 flag
            alert("恭喜你！Boss 已被击败！\n\nFLAG:\n" + flag);

            // 如果你还想在画面上同步显示一份，可以保留这一段（可选）
            // this.showNotification(
            //     "FLAG: " + flag,
            //     this.canvas.width / 2,
            //     80,
            //     "#00e676"
            // );
        })
        .catch(err => {
            console.error("获取 flag 失败:", err);
            alert("获取 flag 失败，请检查控制台。");
            // 或者保留原来的提示方式：
            // this.showNotification(
            //     "获取 flag 失败",
            //     this.canvas.width / 2,
            //     80,
            //     "#ff5050"
            // );
        });
}



    showNotification(text, x, y, color = '#FFFFFF') {
        if (!this.notifications) {
            this.notifications = [];
        }
        
        const notification = {
            text: text,
            x: x,
            y: y,
            color: color,
            alpha: 1.0,
            lifespan: 2.0, // 通知显示时间(秒)
            elapsed: 0,
            velocity: { x: 0, y: -30 } // 通知上升速度
        };
        
        this.notifications.push(notification);
        
        // 更新通知系统
        if (!this._notificationUpdateBound) {
            this._notificationUpdateBound = true;
            
            // 添加通知更新逻辑到游戏循环
            const originalUpdate = this.update.bind(this);
            this.update = (timestamp) => {
                originalUpdate(timestamp);
                this.updateNotifications(this.deltaTime);
            };
        }
    }
    
    /**
     * 更新通知状态
     * @param {number} deltaTime - 帧间隔时间（秒）
     */
    updateNotifications(deltaTime) {
        if (!this.notifications || this.notifications.length === 0) {
            return;
        }
        
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            const notification = this.notifications[i];
            notification.elapsed += deltaTime;
            
            // 更新位置
            notification.x += notification.velocity.x * deltaTime;
            notification.y += notification.velocity.y * deltaTime;
            
            // 更新透明度
            if (notification.elapsed > notification.lifespan * 0.7) {
                // 在生命周期的后30%时间开始淡出
                notification.alpha = 1.0 - (notification.elapsed - notification.lifespan * 0.7) / (notification.lifespan * 0.3);
            }
            
            // 移除过期通知
            if (notification.elapsed >= notification.lifespan) {
                this.notifications.splice(i, 1);
            }
        }
    }
    
    /**
     * 绘制游戏结束覆盖层
     */
    drawGameOverOverlay() {
        // 绘制半透明背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制游戏结束文本
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#ef9a9a'; // 柔和的红色
        this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        // 绘制波次存活信息
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`存活了 ${this.waveNumber} 波`, this.canvas.width / 2, this.canvas.height / 2 + 30);
        
        // 提示点击重新开始
        this.ctx.font = '18px Arial';
        this.ctx.fillStyle = '#bbdefb'; // 柔和的蓝色
        this.ctx.fillText('点击 [重新开始] 按钮再来一局', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }
    
    /**
     * 检查指定位置是否有敌人
     * @param {number} x - 点击的x坐标
     * @param {number} y - 点击的y坐标
     * @returns {Enemy|null} - 如果点击的位置有敌人，则返回该敌人；否则返回null
     */
    getEnemyAt(x, y) {
        for (const enemy of this.enemies) {
            if (!enemy.isDead && !enemy.reachedEnd) {
                const distance = Utils.distance(x, y, enemy.x, enemy.y);
                if (distance <= enemy.radius) {
                    return enemy;
                }
            }
        }
        return null;
    }
    
    /**
     * 选择敌人并显示其信息
     * @param {Enemy} enemy - 要选择的敌人
     */
    selectEnemy(enemy) {
        this.selectedEnemy = enemy;
        this.selectedTower = null; // 清除已选择的塔
        this.towerActionMode = null;
        this.towerActions = null; // 清除塔操作UI
        this.upgradePreview = false;
        this.demolishPreview = false;
        
        // 显示敌人信息
        this.showEnemyInfo(enemy);
    }
    
    /**
     * 显示敌人的信息
     * @param {Enemy} enemy - 要显示信息的敌人
     */
    showEnemyInfo(enemy) {
        // 获取敌人信息面板
        const enemyInfoPanel = document.getElementById('enemy-info');
        
        // 设置敌人基本信息
        document.getElementById('enemy-health').textContent = `${Math.ceil(enemy.health)}/${enemy.maxHealth}`;
        document.getElementById('enemy-speed').textContent = enemy.speed;
        document.getElementById('enemy-reward').textContent = enemy.reward;
        document.getElementById('enemy-life-damage').textContent = enemy.lifeDamage;
        
        // 设置敌人抗性信息
        const physResElement = document.getElementById('enemy-phys-res');
        const magicResElement = document.getElementById('enemy-magic-res');
        const exploResElement = document.getElementById('enemy-explo-res');
        
        // 清除之前的抗性等级样式
        physResElement.className = '';
        magicResElement.className = '';
        exploResElement.className = '';
        
        // 设置新的抗性等级和样式
        physResElement.textContent = enemy.physicalResistance;
        physResElement.classList.add(`resistance-${enemy.physicalResistance}`);
        
        magicResElement.textContent = enemy.magicResistance;
        magicResElement.classList.add(`resistance-${enemy.magicResistance}`);
        
        exploResElement.textContent = enemy.explosionResistance;
        exploResElement.classList.add(`resistance-${enemy.explosionResistance}`);
        
        // 显示敌人信息面板，隐藏塔信息面板
        enemyInfoPanel.classList.remove('hidden');
        document.getElementById('tower-detail-info').classList.add('hidden');
    }
    
    /**
     * 显示塔的详细信息
     * @param {Tower} tower - 要显示信息的塔
     */
    showTowerDetailInfo(tower) {
        // 获取塔信息面板
        const towerInfoPanel = document.getElementById('tower-detail-info');
        
        // 获取塔的类型
        let towerType;
        if (tower instanceof ArrowTower) {
            towerType = '箭塔';
        } else if (tower instanceof CannonTower) {
            towerType = '炮塔';
        } else if (tower instanceof MagicTower) {
            towerType = '魔法塔';
        } else if (tower instanceof StrangefireTower) {
            towerType = '异火塔';
        } else {
            towerType = '未知塔';
        }
        
        // 设置塔的基本信息
        document.getElementById('tower-type').textContent = towerType;
        document.getElementById('tower-level-info').textContent = tower.level;
        document.getElementById('tower-damage-info').textContent = Math.round(tower.damage);
        document.getElementById('tower-range-info').textContent = Math.round(tower.range);
        document.getElementById('tower-rate-info').textContent = tower.fireRate.toFixed(1);
        
        // 获取特殊属性容器
        const specialInfoContainer = document.getElementById('tower-special-info');
        const specialAttributesContainer = document.getElementById('special-attributes');
        
        // 清空特殊属性容器
        specialAttributesContainer.innerHTML = '';
        
        // 根据塔类型添加特殊属性
        let hasSpecialAttributes = false;
        
        if (tower instanceof CannonTower) {
            hasSpecialAttributes = true;
            const splashInfo = document.createElement('div');
            splashInfo.className = 'info-row';
            splashInfo.innerHTML = `溅射半径: <span>${Math.round(tower.splashRadius)}</span>`;
            specialAttributesContainer.appendChild(splashInfo);
        }
        else if (tower instanceof MagicTower) {
            hasSpecialAttributes = true;
            const slowFactorInfo = document.createElement('div');
            slowFactorInfo.className = 'info-row';
            slowFactorInfo.innerHTML = `减速系数: <span>${Math.round((1 - tower.slowFactor) * 100)}%</span>`;
            specialAttributesContainer.appendChild(slowFactorInfo);
            
            const slowDurationInfo = document.createElement('div');
            slowDurationInfo.className = 'info-row';
            slowDurationInfo.innerHTML = `减速持续: <span>${tower.slowDuration.toFixed(1)}秒</span>`;
            specialAttributesContainer.appendChild(slowDurationInfo);
        }
        else if (tower instanceof StrangefireTower) {
            hasSpecialAttributes = true;
            const slowFactorInfo = document.createElement('div');
            slowFactorInfo.className = 'info-row';
            slowFactorInfo.innerHTML = `减速系数: <span>${Math.round((1 - tower.slowFactor) * 100)}%</span>`;
            specialAttributesContainer.appendChild(slowFactorInfo);
            
            const slowDurationInfo = document.createElement('div');
            slowDurationInfo.className = 'info-row';
            slowDurationInfo.innerHTML = `减速持续: <span>${tower.slowDuration.toFixed(1)}秒</span>`;
            specialAttributesContainer.appendChild(slowDurationInfo);
            
            const waveRadiusInfo = document.createElement('div');
            waveRadiusInfo.className = 'info-row';
            waveRadiusInfo.innerHTML = `波浪范围: <span>${Math.round(tower.waveRadius)}</span>`;
            specialAttributesContainer.appendChild(waveRadiusInfo);
        }
        
        // 显示或隐藏特殊属性区域
        if (hasSpecialAttributes) {
            specialInfoContainer.classList.remove('hidden');
        } else {
            specialInfoContainer.classList.add('hidden');
        }
        
        // 显示塔信息面板，隐藏敌人信息面板
        towerInfoPanel.classList.remove('hidden');
        document.getElementById('enemy-info').classList.add('hidden');
    }
}
