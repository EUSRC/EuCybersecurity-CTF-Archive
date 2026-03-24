/**
 * 防御塔基类
 * 所有防御塔类型都继承自这个基类
 */
class Tower {
    /**
     * 创建防御塔
     * @param {number} x - 塔的x坐标
     * @param {number} y - 塔的y坐标
     * @param {number} range - 塔的攻击范围
     * @param {number} damage - 塔的攻击伤害
     * @param {number} fireRate - 塔的攻击速度（每秒攻击次数）
     * @param {number} cost - 塔的建造成本
     */
    constructor(x, y, range, damage, fireRate, cost) {
        this.x = x;
        this.y = y;
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.cost = cost;
        this.level = 1;
        this.maxLevel = 3;
        this.target = null;
        this.timeSinceLastShot = 0;
        this.projectiles = [];
        this.size = 30; // 塔的大小
        
        // 添加图片属性
        this.image = null;
        this.imageLoaded = false;
    }
    
    /**
     * 加载防御塔图片
     * @param {string} imagePath - 图片路径
     */
    loadImage(imagePath) {
        this.image = new Image();
        this.image.src = imagePath;
        this.image.onload = () => {
            this.imageLoaded = true;
            console.log(`塔的图片加载成功: ${imagePath}`);
        };
        this.image.onerror = (e) => {
            console.error(`塔的图片加载失败: ${imagePath}`, e);
        };
    }
    
    /**
     * 更新防御塔状态
     * @param {number} deltaTime - 帧间隔时间（秒）
     * @param {Array} enemies - 敌人数组
     * @param {Array} projectiles - 游戏中的所有投射物数组
     */
    update(deltaTime, enemies, projectiles) {
        // 更新已发射的投射物
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            const removed = projectile.update(deltaTime);
            
            if (removed) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // 寻找目标
        this.findTarget(enemies);
        
        // 如果有目标，尝试攻击
        if (this.target) {
            this.timeSinceLastShot += deltaTime;
            
            // 检查是否可以发射
            if (this.timeSinceLastShot >= 1 / this.fireRate) {
                this.shoot(projectiles);
                this.timeSinceLastShot = 0;
            }
            
            // 检查目标是否仍在范围内
            const distance = Utils.distance(this.x, this.y, this.target.x, this.target.y);
            if (distance > this.range || this.target.isDead || this.target.reachedEnd || (this.target.untargetableRemaining && this.target.untargetableRemaining > 0)) {
                this.target = null;
            }
        }
    }
    
    /**
     * 寻找攻击目标
     * @param {Array} enemies - 敌人数组
     */
    findTarget(enemies) {
        // 如果已有目标且目标仍然有效，则继续攻击当前目标
        if (this.target && !this.target.isDead && !this.target.reachedEnd) {
            const distance = Utils.distance(this.x, this.y, this.target.x, this.target.y);
            if (distance <= this.range) {
                return;
            }
        }
        
        // 寻找范围内的新目标
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        for (const enemy of enemies) {
            if (!enemy.isDead && !enemy.reachedEnd && !(enemy.untargetableRemaining && enemy.untargetableRemaining > 0)) {
                const distance = Utils.distance(this.x, this.y, enemy.x, enemy.y);
                
                if (distance <= this.range && distance < closestDistance) {
                    closestEnemy = enemy;
                    closestDistance = distance;
                }
            }
        }
        
        this.target = closestEnemy;
    }
    
    /**
     * 发射攻击
     * @param {Array} projectiles - 游戏中的所有投射物数组
     */
    shoot(projectiles) {
        // 在子类中实现具体的射击逻辑
    }
    
    /**
     * 升级防御塔
     * @returns {number} - 升级成本，如果已达到最高等级则返回-1
     */
    upgrade() {
        if (this.level >= this.maxLevel) {
            return -1;
        }
        
        this.level++;
        
        // 升级属性（每级提升20%）
        this.range *= 1.2;
        this.damage *= 1.2;
        this.fireRate *= 1.2;
        
        // 升级成本为初始成本的80%
        const upgradeCost = Math.floor(this.cost * 0.8);
        return upgradeCost;
    }
    
    /**
     * 获取升级成本
     * @returns {number} - 升级成本，如果已达到最高等级则返回-1
     */
    getUpgradeCost() {
        if (this.level >= this.maxLevel) {
            return -1;
        }
        return Math.floor(this.cost * 0.8);
    }
    
    /**
     * 绘制防御塔
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    draw(ctx) {
        // 绘制塔的底座（带阴影效果）
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // 绘制塔的底座
        ctx.fillStyle = '#777777';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        
        // 重置阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // 绘制塔的主体（在子类中实现具体外观）
        this.drawTower(ctx);
        
        // 绘制等级指示器
        this.drawLevelIndicator(ctx);
        
        // 在调试模式下绘制攻击范围
        // 注意：范围圈的绘制现在由Game类中的render方法处理
        // 这里保留调试模式下的范围显示，以便开发调试
        if (window.DEBUG_MODE) {
            this.drawRange(ctx);
        }
        
        // 绘制投射物
        for (const projectile of this.projectiles) {
            projectile.draw(ctx);
        }
    }
    
    /**
     * 绘制防御塔主体
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    drawTower(ctx) {
        // 在子类中实现
    }
    
    /**
     * 绘制等级指示器
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    drawLevelIndicator(ctx) {
        const indicatorSize = 5;
        const spacing = 2;
        const totalWidth = this.level * indicatorSize + (this.level - 1) * spacing;
        let startX = this.x - totalWidth / 2;
        
        ctx.fillStyle = '#ffcc00';
        for (let i = 0; i < this.level; i++) {
            ctx.beginPath();
            ctx.arc(startX + indicatorSize / 2, this.y + this.size / 2 + 10, indicatorSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加轻微的光晕效果
            ctx.beginPath();
            ctx.arc(startX + indicatorSize / 2, this.y + this.size / 2 + 10, indicatorSize / 2 + 1, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 204, 0, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            startX += indicatorSize + spacing;
        }
    }
    
    /**
     * 绘制攻击范围
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     * @param {string} [color] - 范围圈的颜色，默认为白色
     */
    drawRange(ctx, color = 'rgba(255, 255, 255, 0.3)') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

/**
 * 箭塔类
 * 攻击速度快，伤害中等的防御塔
 */
class ArrowTower extends Tower {
    constructor(x, y) {
        super(x, y, 150, 20, 2, 50); // 范围150，伤害20，攻速2，成本50
        this.color = '#3498db'; // 蓝色
        this.loadImage('assets/image/ArrowTower.png'); // 加载箭塔图片
    }
    
    /**
     * 发射箭矢
     * @param {Array} projectiles - 游戏中的所有投射物数组
     */
    shoot(projectiles) {
        const angle = Utils.angle(this.x, this.y, this.target.x, this.target.y);
        const arrow = new Arrow(this.x, this.y, angle, this.damage, this.target);
        projectiles.push(arrow);
        this.projectiles.push(arrow);
        
        // 播放箭塔射击音效
        if (window.audioManager) {
            window.audioManager.play('arrowShoot');
        }
    }
    
    /**
     * 绘制箭塔
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    drawTower(ctx) {
        if (this.imageLoaded && this.image) {
            // 绘制图片
            const drawX = this.x - this.size / 2;
            const drawY = this.y - this.size / 2;
            ctx.drawImage(this.image, drawX, drawY, this.size, this.size);
            
            // 如果有目标，绘制炮管指向目标
            if (this.target) {
                const angle = Utils.angle(this.x, this.y, this.target.x, this.target.y);
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(angle);
                
                // 绘制简单的炮管指示器
                ctx.fillStyle = this.color;
                ctx.fillRect(0, -1, 10, 2);
                
                ctx.restore();
            }
        } else {
            // 备用绘制方法
            // 绘制箭塔基座
            ctx.fillStyle = '#5d92b0';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 3 + 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制箭塔主体
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加高光
            ctx.beginPath();
            ctx.arc(this.x - this.size/8, this.y - this.size/8, this.size/8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
            
            // 绘制箭塔炮管（朝向目标方向）
            if (this.target) {
                const angle = Utils.angle(this.x, this.y, this.target.x, this.target.y);
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(angle);
                
                // 绘制炮管底座
                ctx.fillStyle = '#666666';
                ctx.fillRect(-2, -4, 4, 8);
                
                // 绘制炮管
                ctx.fillStyle = this.color;
                ctx.fillRect(0, -2, this.size / 2, 4);
                
                ctx.restore();
            } else {
                // 没有目标时，炮管朝右
                ctx.fillStyle = '#666666';
                ctx.fillRect(this.x - 2, this.y - 4, 4, 8);
                
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y - 2, this.size / 2, 4);
            }
        }
    }
}

/**
 * 炮塔类
 * 攻击速度慢，伤害高，有溅射效果的防御塔
 */
class CannonTower extends Tower {
    constructor(x, y) {
        super(x, y, 100, 50, 0.8, 100); // 范围100，伤害50，攻速0.8，成本100
        this.color = '#FFFF00'; // 黄色
        this.splashRadius = 50; // 溅射半径
        this.loadImage('assets/image/CannonTower.png'); // 加载炮塔图片
    }
    
    /**
     * 发射炮弹
     * @param {Array} projectiles - 游戏中的所有投射物数组
     */
    shoot(projectiles) {
        const angle = Utils.angle(this.x, this.y, this.target.x, this.target.y);
        const cannonball = new Cannonball(this.x, this.y, angle, this.damage, this.target, this.splashRadius);
        projectiles.push(cannonball);
        this.projectiles.push(cannonball);
        
        // 播放炮塔射击音效
        if (window.audioManager) {
            window.audioManager.play('cannonShoot');
        }
    }
    
    /**
     * 升级炮塔
     * 除了基本属性外，还提升溅射半径
     */
    upgrade() {
        const cost = super.upgrade();
        if (cost > 0) {
            this.splashRadius *= 1.2;
        }
        return cost;
    }
    
    /**
     * 绘制炮塔
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    drawTower(ctx) {
        if (this.imageLoaded && this.image) {
            // 绘制图片
            const drawX = this.x - this.size / 2;
            const drawY = this.y - this.size / 2;
            ctx.drawImage(this.image, drawX, drawY, this.size, this.size);
            
            // 如果有目标，绘制炮管指向目标
            if (this.target) {
                const angle = Utils.angle(this.x, this.y, this.target.x, this.target.y);
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(angle);
                
                // 绘制简单的炮管指示器
                ctx.fillStyle = this.color;
                ctx.fillRect(0, -2, 12, 4);
                
                ctx.restore();
            }
        } else {
            // 备用绘制方法
            // 绘制炮塔基座
            ctx.fillStyle = '#b29f6d'; 
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2.5 + 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制炮塔主体
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加高光
            ctx.beginPath();
            ctx.arc(this.x - this.size/10, this.y - this.size/10, this.size/6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
            
            // 绘制炮塔炮管
            if (this.target) {
                const angle = Utils.angle(this.x, this.y, this.target.x, this.target.y);
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(angle);
                
                // 绘制炮管底座
                ctx.fillStyle = '#555555';
                ctx.fillRect(-3, -5, 6, 10);
                
                // 绘制炮管
                ctx.fillStyle = this.color;
                ctx.fillRect(0, -4, this.size / 1.5, 8);
                
                // 绘制炮口
                ctx.fillStyle = '#444444';
                ctx.fillRect(this.size / 1.5 - 2, -5, 4, 10);
                
                ctx.restore();
            } else {
                // 没有目标时，炮管朝右
                ctx.fillStyle = '#555555';
                ctx.fillRect(this.x - 3, this.y - 5, 6, 10);
                
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y - 4, this.size / 1.5, 8);
                
                ctx.fillStyle = '#444444';
                ctx.fillRect(this.x + this.size / 1.5 - 2, this.y - 5, 4, 10);
            }
        }
    }
}

/**
 * 魔法塔类
 * 攻击速度中等，伤害中等，可以减速敌人的防御塔
 */
class MagicTower extends Tower {
    constructor(x, y) {
        super(x, y, 100, 30, 1.5, 150); // 范围100，伤害30，攻速1.5，成本150
        this.color = '#9b59b6'; // 紫色
        this.slowFactor = 0.7; // 减速因子（敌人速度变为原来的70%）
        this.slowDuration = 2; // 减速持续时间（秒）
        this.loadImage('assets/image/MagicTower.png'); // 加载魔法塔图片
    }
    
    /**
     * 发射魔法弹
     * @param {Array} projectiles - 游戏中的所有投射物数组
     */
    shoot(projectiles) {
        const angle = Utils.angle(this.x, this.y, this.target.x, this.target.y);
        const magicOrb = new MagicOrb(this.x, this.y, angle, this.damage, this.target, this.slowFactor, this.slowDuration);
        projectiles.push(magicOrb);
        this.projectiles.push(magicOrb);
        
        // 播放魔法塔射击音效
        if (window.audioManager) {
            window.audioManager.play('magicShoot');
        }
    }
    
    /**
     * 升级魔法塔
     * 除了基本属性外，还提升减速效果和持续时间
     */
    upgrade() {
        const cost = super.upgrade();
        if (cost > 0) {
            this.slowFactor -= 0.1; // 减速效果增强（每级减少10%）
            this.slowDuration += 0.5; // 减速时间增加（每级增加0.5秒）
        }
        return cost;
    }
    
    /**
     * 绘制魔法塔
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    drawTower(ctx) {
        if (this.imageLoaded && this.image) {
            // 绘制图片
            const drawX = this.x - this.size / 2;
            const drawY = this.y - this.size / 2;
            ctx.drawImage(this.image, drawX, drawY, this.size, this.size);
            
            // 绘制魔法光环效果
            const time = Date.now() / 1000;
            const pulseFactor = (Math.sin(time * 3) + 1) / 2 * 0.3 + 0.7; // 0.7-1.0之间脉动
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 3 * pulseFactor, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(155, 89, 182, 0.2)';
            ctx.fill();
        } else {
            // 备用绘制方法
            // 绘制魔法光环效果
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(155, 89, 182, 0.2)';
            ctx.fill();
            
            // 绘制魔法塔主体（六边形）
            ctx.fillStyle = this.color;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = i * Math.PI / 3;
                const x = this.x + Math.cos(angle) * this.size / 3;
                const y = this.y + Math.sin(angle) * this.size / 3;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.fill();
            
            // 绘制魔法水晶
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.7;
            ctx.fill();
            
            // 添加闪光效果
            const time = Date.now() / 1000;
            const pulseFactor = (Math.sin(time * 3) + 1) / 2 * 0.3 + 0.7; // 0.7-1.0之间脉动
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 4 * pulseFactor, 0, Math.PI * 2);
            ctx.fillStyle = '#e0b0ff'; // 浅紫色光芒
            ctx.globalAlpha = 0.6;
            ctx.fill();
            
            ctx.globalAlpha = 1.0;
            
            // 绘制能量轨迹（装饰性）
            for (let i = 0; i < 3; i++) {
                const angle = time * (i + 1) % (Math.PI * 2);
                const orbitRadius = this.size / 2;
                const particleX = this.x + Math.cos(angle) * orbitRadius;
                const particleY = this.y + Math.sin(angle) * orbitRadius;
                
                ctx.beginPath();
                ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#e0b0ff';
                ctx.globalAlpha = 0.8;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }
    }
}

/**
 * 异火塔类
 * 伤害较低，但能释放以自己为中心的破浪来减速敌人
 */
class StrangefireTower extends Tower {
    constructor(x, y) {
        super(x, y, 120, 15, 1.0, 125); // 范围120，伤害15，攻速1.0，成本125
        this.color = '#ff6d00'; // 橙色
        this.slowFactor = 0.8; // 初始减速因子（敌人速度变为原来的80%）
        this.slowDuration = 3; // 减速持续时间（秒）
        this.waveRadius = 30; // 初始波浪半径
        this.waveSpeed = 100; // 波浪扩散速度
        this.waveEffectTime = 0; // 波浪效果计时器
        this.waveActive = false; // 波浪是否激活
        this.waveCurrentRadius = 0; // 当前波浪半径
        this.loadImage('assets/image/StrangefireTower.png'); // 加载异火塔图片
    }
    
    /**
     * 更新异火塔状态
     * @param {number} deltaTime - 帧间隔时间（秒）
     * @param {Array} enemies - 敌人数组
     * @param {Array} projectiles - 游戏中的所有投射物数组
     */
    update(deltaTime, enemies, projectiles) {
        // 调用基类更新方法
        super.update(deltaTime, enemies, projectiles);
        
        // 更新波浪效果
        if (this.waveActive) {
            this.waveEffectTime += deltaTime;
            this.waveCurrentRadius = this.waveSpeed * this.waveEffectTime;
            
            // 对范围内的敌人应用减速效果
            for (const enemy of enemies) {
                if (!enemy.isDead && !enemy.reachedEnd && !(enemy.untargetableRemaining && enemy.untargetableRemaining > 0)) {
                    const distance = Utils.distance(this.x, this.y, enemy.x, enemy.y);
                    
                    // 如果敌人在波浪范围内，且波浪正在扩散中
                    if (distance <= this.waveCurrentRadius && 
                        distance >= this.waveCurrentRadius - 20) {
                        // 应用减速效果
                        enemy.slowFactor = Math.min(enemy.slowFactor || 1, this.slowFactor);
                        enemy.slowDuration = this.slowDuration;
                        enemy.isSlowed = true;
                    }
                }
            }
            
            // 当波浪扩散到最大范围时，结束效果
            if (this.waveCurrentRadius >= this.range) {
                this.waveActive = false;
                this.waveEffectTime = 0;
            }
        }
    }
    
    /**
     * 发射攻击
     * @param {Array} projectiles - 游戏中的所有投射物数组
     */
    shoot(projectiles) {
        // 不发射投射物，而是激活波浪效果
        this.waveActive = true;
        this.waveEffectTime = 0;
        this.waveCurrentRadius = 0;
        
        // 如果有目标，对目标造成伤害
        if (this.target) {
            this.target.takeDamage(this.damage);
        }
        
        // 播放异火塔波动音效
        if (window.audioManager) {
            window.audioManager.play('strangefire');
        }
    }
    
    /**
     * 升级异火塔
     * 主要提升减速效果，次要提升伤害和范围
     */
    upgrade() {
        const cost = super.upgrade();
        if (cost > 0) {
            // 每级提升减速效果10%，但最高不超过60%
            this.slowFactor = Math.max(0.4, this.slowFactor - 0.1);
            this.slowDuration += 0.5; // 增加减速持续时间
            this.waveRadius += 10; // 增加波浪半径
        }
        return cost;
    }
    
    /**
     * 绘制异火塔
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    drawTower(ctx) {
        if (this.imageLoaded && this.image) {
            // 绘制图片
            const drawX = this.x - this.size / 2;
            const drawY = this.y - this.size / 2;
            ctx.drawImage(this.image, drawX, drawY, this.size, this.size);
            
            // 如果波浪效果激活，绘制波浪
            if (this.waveActive) {
                this.drawWaveEffect(ctx);
            }
        } else {
            // 备用绘制方法
            // 绘制异火塔基座
            ctx.fillStyle = '#b25538';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2.5 + 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制异火塔主体
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加火焰效果
            const time = Date.now() / 1000;
            
            // 绘制内部火焰
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 + time % (Math.PI * 2);
                const flameX = this.x + Math.cos(angle) * this.size / 5;
                const flameY = this.y + Math.sin(angle) * this.size / 5;
                const flameSize = (Math.sin(time * 3 + i) + 1) * 3 + 2;
                
                ctx.beginPath();
                ctx.arc(flameX, flameY, flameSize, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 150, 0, 0.7)';
                ctx.fill();
            }
            
            // 如果波浪效果激活，绘制波浪
            if (this.waveActive) {
                this.drawWaveEffect(ctx);
            }
        }
    }
    
    /**
     * 绘制波浪效果
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    drawWaveEffect(ctx) {
        // 保存当前绘图状态
        ctx.save();
        
        // 根据波浪扩散程度设置透明度
        const opacity = 1 - (this.waveCurrentRadius / this.range);
        
        // 绘制波浪圆环
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.waveCurrentRadius, 0, Math.PI * 2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = `rgba(255, 109, 0, ${opacity * 0.8})`;
        ctx.stroke();
        
        // 绘制内部波浪效果
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.waveCurrentRadius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(255, 235, 59, ${opacity * 0.6})`;
        ctx.stroke();
        
        // 恢复绘图状态
        ctx.restore();
    }
}