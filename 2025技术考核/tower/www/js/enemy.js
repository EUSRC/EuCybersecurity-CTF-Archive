/**
 * 敌人基类
 * 所有敌人类型都继承自这个基类
 */
class Enemy {
    /**
     * 创建敌人实例
     * @param {Array} path - 敌人行走的路径点数组
     * @param {number} speed - 敌人的移动速度
     * @param {number} health - 敌人的初始生命值
     * @param {number} reward - 消灭敌人获得的金币奖励
     */
    constructor(path, speed, health, reward) {
        // 添加路径检查
        if (!path || !Array.isArray(path) || path.length === 0) {
            console.error('错误：无效的敌人路径！', path);
            throw new Error('无效的敌人路径！');
        }
        
        console.log(`创建敌人，路径点数量: ${path.length}`);
        
        this.path = path;
        this.speed = speed;
        this.maxHealth = health;
        this.health = health;
        this.reward = reward;
        this.currentPathIndex = 0;
        
        // 设置敌人初始位置（路径起点）
        this.x = path[0].x;
        this.y = path[0].y;
        
        console.log(`敌人初始位置设置为：x=${this.x}, y=${this.y}`);
        
        // 敌人大小
        this.radius = 15;
        
        // 敌人是否到达终点
        this.reachedEnd = false;
        
        // 敌人是否死亡
        this.isDead = false;

        // 短暂“不可被选中”计时（用于Boss受伤后让小怪吸引火力；不等于无敌，仍可被已锁定的投射物命中）
        this.untargetableRemaining = 0;
        
        // 添加图片属性
        this.image = null;
        this.imageLoaded = false;
        this.imageSize = this.radius * 2; // 图片显示大小

        // 抗性（默认 I 级）
        this.physicalResistance = 'I';
        this.magicResistance = 'I';
        this.explosionResistance = 'I';
        
        // 敌人到达终点时扣除的玩家生命值
        this.lifeDamage = 1;
    }
    
    /**
     * 加载敌人图片
     * @param {string} imagePath - 图片路径
     */
    loadImage(imagePath) {
        this.image = new Image();
        this.image.src = imagePath;
        this.image.onload = () => {
            this.imageLoaded = true;
            console.log(`敌人图片加载成功: ${imagePath}`);
        };
        this.image.onerror = (e) => {
            console.error(`敌人图片加载失败: ${imagePath}`, e);
        };
    }
    
    /**
     * 更新敌人状态
     * @param {number} deltaTime - 帧间隔时间（秒）
     * @returns {boolean} - 如果敌人到达终点或死亡则返回true
     */
    update(deltaTime) {
        // 如果敌人已经到达终点或死亡，不再更新
        if (this.reachedEnd || this.isDead) {
            return true;
        }
        

        // 短暂“不可被选中”倒计时
        if (this.untargetableRemaining > 0) {
            this.untargetableRemaining -= deltaTime;
            if (this.untargetableRemaining < 0) this.untargetableRemaining = 0;
        }

        // 处理减速效果
        let currentSpeed = this.speed;
        
        if (this.isSlowed && this.slowFactor && this.slowDuration > 0) {
            currentSpeed = this.speed * this.slowFactor;
            this.slowDuration -= deltaTime;
            if (this.slowDuration <= 0) {
                this.isSlowed = false;
                this.slowFactor = 1.0;
                this.slowDuration = 0;
            }
        }
        
        // 获取当前目标点
        const targetPoint = this.path[this.currentPathIndex];
        
        // 计算敌人到目标点的距离
        const dx = targetPoint.x - this.x;
        const dy = targetPoint.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果敌人已经到达当前目标点
        if (distance < currentSpeed * deltaTime) {
            this.x = targetPoint.x;
            this.y = targetPoint.y;
            
            this.currentPathIndex++;
            
            // 如果已经到达路径终点
            if (this.currentPathIndex >= this.path.length) {
                this.reachedEnd = true;
                return true;
            }
        } else {
            const vx = dx / distance;
            const vy = dy / distance;
            this.x += vx * currentSpeed * deltaTime;
            this.y += vy * currentSpeed * deltaTime;
        }
        
        return false;
    }
    
    /**
     * 敌人受到伤害
     * @param {number} damage - 伤害值
     * @returns {boolean} - 如果敌人死亡则返回true
     */
    takeDamage(damage) {
        this.health -= damage;
        
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            return true;
        }
        
        return false;
    }
    
    /**
     * 绘制敌人
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    draw(ctx) {
        // 阴影
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.save();
        
        // 减速特效
        if (this.isSlowed && this.slowDuration > 0) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(100, 150, 255, 0.2)';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(30, 144, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            const slowIntensity = Math.min(0.7, 1 - (this.slowFactor || 0.7));
            ctx.fillStyle = `rgba(100, 190, 255, ${slowIntensity})`;
        }
        
        // 图片或圆形
        if (this.imageLoaded && this.image) {
            const drawX = this.x - this.imageSize / 2;
            const drawY = this.y - this.imageSize / 2;
            ctx.drawImage(this.image, drawX, drawY, this.imageSize, this.imageSize);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color || '#ff0000';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.stroke();
            this.drawDetails(ctx);
        }
        
        ctx.restore();
        
        // 重置阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // 血条
        this.drawHealthBar(ctx);
        
        // 减速状态指示
        if (this.isSlowed && this.slowDuration > 0) {
            this.drawSlowedIndicator(ctx);
        }
    }
    
    /**
     * 绘制敌人细节（子类覆盖）
     */
    drawDetails(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
    }
    
    /**
     * 绘制生命条
     */
    drawHealthBar(ctx) {
        const healthBarWidth = this.radius * 2;
        const healthBarHeight = 5;
        const healthBarX = this.x - this.radius;
        const healthBarY = this.y - this.imageSize / 2 - 10;
        
        ctx.fillStyle = 'rgba(70, 70, 70, 0.8)';
        this.roundRect(ctx, healthBarX, healthBarY, healthBarWidth, healthBarHeight, 2, true, false);
        
        const healthPercentage = this.health / this.maxHealth;
        
        let healthColor;
        if (healthPercentage > 0.6) {
            healthColor = '#4CAF50';
        } else if (healthPercentage > 0.3) {
            healthColor = '#FFC107';
        } else {
            healthColor = '#F44336';
        }
        
        ctx.fillStyle = healthColor;
        this.roundRect(ctx, healthBarX, healthBarY, healthBarWidth * healthPercentage, healthBarHeight, 2, true, false);
    }
    
    /**
     * 圆角矩形
     */
    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    }
    
    /**
     * 绘制减速状态指示器
     */
    drawSlowedIndicator(ctx) {
        const indicatorY = this.y - this.radius - 15;
        
        ctx.save();
        ctx.translate(this.x, indicatorY);
        
        // 雪花中心
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(30, 144, 255, 0.9)';
        ctx.fill();
        
        // 六个分支
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            ctx.save();
            ctx.rotate(angle);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -7);
            ctx.strokeStyle = 'rgba(30, 144, 255, 0.9)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, -3);
            ctx.lineTo(2, -5);
            ctx.moveTo(0, -3);
            ctx.lineTo(-2, -5);
            ctx.stroke();
            
            ctx.restore();
        }
        
        ctx.restore();
        
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = 'rgba(30, 144, 255, 1)';
        ctx.textAlign = 'center';
        ctx.fillText(this.slowDuration.toFixed(1) + 's', this.x, indicatorY - 10);
    }
}

/**
 * 普通敌人
 */
class NormalEnemy extends Enemy {
    constructor(path) {
        super(path, 100, 100, 10);
        this.color = '#ef5350';
        this.loadImage('assets/image/Ordinary-enemy.png');
        this.imageSize = this.radius * 2.2;
        
        this.physicalResistance = 'I';
        this.magicResistance = 'I';
        this.explosionResistance = 'I';
        
        this.lifeDamage = 1;
    }
    
    drawDetails(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
        
        const crossSize = this.radius * 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x - crossSize, this.y);
        ctx.lineTo(this.x + crossSize, this.y);
        ctx.moveTo(this.x, this.y - crossSize);
        ctx.lineTo(this.x, this.y + crossSize);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

/**
 * 快速敌人
 */
class FastEnemy extends Enemy {
    constructor(path) {
        super(path, 200, 50, 15);
        this.color = '#66BB6A';
        this.radius = 12;
        this.animationTime = 0;
        this.loadImage('assets/image/Fast-enemy.png');
        this.imageSize = this.radius * 2.5;
        
        this.physicalResistance = 'II';
        this.magicResistance = 'I';
        this.explosionResistance = 'I';
        
        this.lifeDamage = 3;
    }
    
    drawDetails(ctx) {
        this.animationTime += 0.1;
        if (this.animationTime > Math.PI * 2) {
            this.animationTime = 0;
        }
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (this.currentPathIndex < this.path.length - 1) {
            const nextPoint = this.path[this.currentPathIndex + 1];
            const angle = Math.atan2(nextPoint.y - this.y, nextPoint.x - this.x);
            ctx.rotate(angle);
        }
        
        ctx.beginPath();
        ctx.moveTo(this.radius * 0.5, 0);
        ctx.lineTo(-this.radius * 0.3, -this.radius * 0.4);
        ctx.lineTo(-this.radius * 0.3, this.radius * 0.4);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        
        const speedLineLength = this.radius * 0.3;
        const speedLineCount = 3;
        const speedLineSpacing = this.radius * 0.4;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        
        for (let i = 1; i <= speedLineCount; i++) {
            const offset = -this.radius * 0.6 - speedLineSpacing * i +
                           (Math.sin(this.animationTime * 3) + 1) * 0.2 * this.radius;
            ctx.beginPath();
            ctx.moveTo(offset, -speedLineLength / 2);
            ctx.lineTo(offset, speedLineLength / 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

/**
 * 装甲敌人
 */
class ArmoredEnemy extends Enemy {
    constructor(path) {
        super(path, 60, 300, 25);
        this.color = '#42A5F5';
        this.radius = 18;
        this.loadImage('assets/image/Armored-enemy.png');
        this.imageSize = this.radius * 2.2;
        
        this.physicalResistance = 'III';
        this.magicResistance = 'I';
        this.explosionResistance = 'III';
        
        this.lifeDamage = 5;
    }
    
    // 装甲敌人受到的伤害减少 25%
    takeDamage(damage) {
        return super.takeDamage(damage * 0.75);
    }
    
    drawDetails(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        
        const armorPlateCount = 6;
        const armorRadius = this.radius * 0.85;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        for (let i = 0; i < armorPlateCount; i++) {
            const angle = (i / armorPlateCount) * Math.PI * 2;
            const plateWidth = this.radius * 0.3;
            const plateHeight = this.radius * 0.5;
            
            ctx.save();
            ctx.rotate(angle);
            
            ctx.beginPath();
            ctx.roundRect(-plateWidth / 2, -armorRadius - plateHeight / 2, plateWidth, plateHeight, 2);
            ctx.fillStyle = 'rgba(100, 180, 255, 0.9)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(30, 100, 180, 0.9)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.restore();
        }
        
        ctx.restore();
    }
}

/**
 * 特殊敌人（带回血）
 */
class SpecialEnemy extends Enemy {
    constructor(path) {
        super(path, 120, 150, 20);
        this.color = '#FF9800';
        this.radius = 16;
        this.loadImage('assets/image/Special-enemy.png');
        this.imageSize = this.radius * 2.2;
        this.regenerationRate = 3;
        this.lastRegenTime = 0;
        
        this.physicalResistance = 'II';
        this.magicResistance = 'III';
        this.explosionResistance = 'I';
        
        this.lifeDamage = 3;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        this.lastRegenTime += deltaTime;
        if (this.lastRegenTime >= 1) {
            this.lastRegenTime = 0;
            this.health = Math.min(this.health + this.regenerationRate, this.maxHealth);
        }
    }
    
    drawDetails(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const spikes = 5;
        const outerRadius = this.radius * 0.7;
        const innerRadius = this.radius * 0.4;
        
        ctx.beginPath();
        ctx.moveTo(0, -outerRadius);
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / spikes) * i;
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius;
            ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        
        ctx.restore();
    }
}

/**
 * Boss 敌人类
 * 血量极高，移动缓慢，伤害减免
 */
class BossEnemy extends Enemy {
    constructor(path) {
        // 速度 50，生命值 5000，击杀奖励 200 金币
        super(path, 50, 5000, 200);
        this.color = '#9C27B0';     // 紫色显眼一点
        this.radius = 24;           // 体型更大
        this.imageSize = this.radius * 2.6;

        // 若有 Boss 图片可改路径
        this.loadImage('assets/image/Armored-enemy.png');

        // 全系高抗性
        this.physicalResistance = 'III';
        this.magicResistance = 'III';
        this.explosionResistance = 'III';

        // 到终点直接扣大量血
        this.lifeDamage = 20;

        // 标记这是 Boss
        this.isBoss = true;

        // ===== 受伤触发：短暂“不可被选中” + 召唤护卫 =====
        // 注意：不可被选中 ≠ 无敌。已锁定的投射物仍会继续追踪并造成伤害。
        this.untargetableOnHurt = 0.35;      // 受伤后不可被选中的时长（建议 0.2~0.5）
        this.hurtProcCooldown = 1.0;         // 受伤触发的最小间隔，防止高射速导致无限刷兵
        this.hurtProcRemaining = 0;

        this.hurtSummonMin = 1;
        this.hurtSummonMax = 3;

        this.maxActiveMinions = 8;           // 场上最多同时存在的 Boss 护卫
        this.minionHealthMultiplier = 0.6;   // 护卫血量倍率
        this.minionRewardMultiplier = 0.3;   // 护卫金币倍率（防刷钱）
    }

    update(deltaTime) {
        const finished = super.update(deltaTime);
        if (finished) return true;

        // 受伤触发冷却倒计时
        if (this.hurtProcRemaining > 0) {
            this.hurtProcRemaining -= deltaTime;
            if (this.hurtProcRemaining < 0) this.hurtProcRemaining = 0;
        }

        return false;
    }

    // 统一减伤：只吃 60% 的伤害
    takeDamage(damage) {
        const died = super.takeDamage(damage * 0.6);

        // 死亡不触发召唤（避免死前一发爆兵影响通关手感）
        if (died) return true;

        // 受伤触发：短暂不可被选中 + 召唤护卫（带冷却）
        if (this.hurtProcRemaining <= 0) {
            this.hurtProcRemaining = this.hurtProcCooldown;

            // 让塔短时间更难重新锁定 Boss，从而把火力分散到护卫身上
            this.untargetableRemaining = Math.max(this.untargetableRemaining, this.untargetableOnHurt);

            const count = this.hurtSummonMin + Math.floor(Math.random() * (this.hurtSummonMax - this.hurtSummonMin + 1));
            this.trySummonMinions(count);
        }

        return false;
    }

    trySummonMinions(count) {
        const game = window.gameInstance;
        if (!game || !game.enemies) return;

        const enemies = game.enemies;
        const activeMinions = enemies.filter(e => e.isBossMinion && !e.isDead && !e.reachedEnd).length;

        if (activeMinions >= this.maxActiveMinions) return;

        const canSpawn = Math.max(0, this.maxActiveMinions - activeMinions);
        const spawnN = Math.min(count, canSpawn);

        for (let i = 0; i < spawnN; i++) {
            this.spawnMinion(enemies);
        }

        if (game.showNotification) {
            game.showNotification('Boss召唤护卫！', this.x, this.y - 40, '#ffeb3b');
        }
    }

    spawnMinion(enemiesArr) {
        const type = Math.random() < 0.65 ? FastEnemy : ArmoredEnemy;
        const m = new type(this.path);

        // 从 Boss 当前路段附近出现，而不是起点
        m.currentPathIndex = Math.max(0, Math.min(this.currentPathIndex, this.path.length - 1));
        m.x = this.x + (Math.random() * 20 - 10);
        m.y = this.y + (Math.random() * 20 - 10);

        // 标记：用于限制数量、奖励调低等
        m.isBossMinion = true;

        // 护卫数值：不拖太久但能分火力
        m.maxHealth = Math.max(1, Math.floor(m.maxHealth * this.minionHealthMultiplier));
        m.health = m.maxHealth;
        m.reward = Math.floor(m.reward * this.minionRewardMultiplier);

        enemiesArr.push(m);
    }

    drawDetails(ctx) {
        // 内圈
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();

        // 外圈尖刺
        ctx.save();
        ctx.translate(this.x, this.y);
        const spikes = 8;
        const outer = this.radius * 1.0;
        const inner = this.radius * 0.6;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outer : inner;
            const angle = (Math.PI / spikes) * i;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}


/**
 * 敌人生成器
 */
class EnemySpawner {
    constructor(path) {
        this.path = path;
        this.waveNumber = 0;
        this.enemiesInWave = 0;
        this.spawnInterval = 1.5;
        this.timeSinceLastSpawn = 0;
        this.waveInProgress = false;
        this.enemyTypes = [
            NormalEnemy,
            FastEnemy,
            ArmoredEnemy,
            SpecialEnemy
        ];
        // Boss 是否已经生成过
        this.bossSpawned = false;
    }
    
    /**
     * 开始新的一波敌人
     */
    startWave() {
        if (!this.path || this.path.length === 0) {
            console.error('错误：无法开始新的波次，敌人路径无效或为空！');
            return;
        }
        
        console.log(`开始新的波次（第${this.waveNumber + 1}波）`);
        
        this.waveNumber++;
        this.enemiesInWave = 5 + Math.floor(this.waveNumber * 1.5);
        this.spawnInterval = Math.max(0.5, 1.5 - this.waveNumber * 0.1);
        this.timeSinceLastSpawn = this.spawnInterval;
        this.waveInProgress = true;
        
        console.log(`波次初始化完成：第${this.waveNumber}波，将生成${this.enemiesInWave}个敌人，生成间隔=${this.spawnInterval.toFixed(2)}秒`);
        console.log(`敌人生成时间设置为：${this.timeSinceLastSpawn.toFixed(2)}秒（下一帧将立即生成第一个敌人）`);
    }
    
    /**
     * 更新生成器
     */
    update(deltaTime, enemies) {
        if (!this.waveInProgress) {
            console.log('敌人生成器未在工作状态');
            return true;
        }
        
        if (!this.path || this.path.length === 0) {
            console.error('错误：敌人路径无效或为空！无法生成敌人。');
            this.waveInProgress = false;
            return true;
        }
        
        if (this.enemiesInWave <= 0) {
            this.waveInProgress = false;
            console.log('所有敌人已生成完毕，波次完成');
            return true;
        }
        
        this.timeSinceLastSpawn += deltaTime;
        
        if (this.timeSinceLastSpawn >= this.spawnInterval && this.enemiesInWave > 0) {
            console.log(`准备生成新敌人，剩余敌人数量(生成前): ${this.enemiesInWave}`);
            
            this.spawnEnemy(enemies);
            this.timeSinceLastSpawn = 0;
            this.enemiesInWave--;
            
            if (this.enemiesInWave <= 0) {
                console.log('最后一个敌人已生成');
                this.waveInProgress = false;
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 生成一个敌人
     */
    spawnEnemy(enemies) {
        console.log(`开始生成敌人，当前波次: ${this.waveNumber}`);
        
        if (!this.path || this.path.length === 0) {
            console.error('错误：无法生成敌人，路径为空！');
            return;
        }
        
        let enemyType;
        const rand = Math.random();
        
        // Boss 逻辑：第 8 波及以后，并且这是本波最后一个要生成的敌人，且还没生成过 Boss
        if (!this.bossSpawned && this.waveNumber >= 8 && this.enemiesInWave === 1) {
            console.log('生成 BossEnemy！');
            enemyType = BossEnemy;
            this.bossSpawned = true;
        } else if (this.waveNumber < 3) {
            // 前 3 波主要是普通敌人
            enemyType = rand < 0.8 ? NormalEnemy : FastEnemy;
            console.log(`选择敌人类型: ${rand < 0.8 ? 'NormalEnemy' : 'FastEnemy'} (随机值: ${rand.toFixed(2)})`);
        } else if (this.waveNumber < 6) {
            // 3-6 波增加快速敌人比例
            if (rand < 0.6) {
                enemyType = NormalEnemy;
                console.log(`选择敌人类型: NormalEnemy (随机值: ${rand.toFixed(2)})`);
            } else if (rand < 0.9) {
                enemyType = FastEnemy;
                console.log(`选择敌人类型: FastEnemy (随机值: ${rand.toFixed(2)})`);
            } else {
                enemyType = ArmoredEnemy;
                console.log(`选择敌人类型: ArmoredEnemy (随机值: ${rand.toFixed(2)})`);
            }
        } else {
            // 6 波以后各种敌人都有（不含 Boss，因为 Boss 单独控制）
            if (rand < 0.4) {
                enemyType = NormalEnemy;
                console.log(`选择敌人类型: NormalEnemy (随机值: ${rand.toFixed(2)})`);
            } else if (rand < 0.7) {
                enemyType = FastEnemy;
                console.log(`选择敌人类型: FastEnemy (随机值: ${rand.toFixed(2)})`);
            } else {
                enemyType = ArmoredEnemy;
                console.log(`选择敌人类型: ArmoredEnemy (随机值: ${rand.toFixed(2)})`);
            }
        }
        
        try {
            console.log(`创建敌人，路径点数量: ${this.path.length}`);
            const enemy = new enemyType(this.path);
            console.log(`敌人初始位置: x=${enemy.x}, y=${enemy.y}`);
            enemies.push(enemy);
            console.log(`敌人已生成并添加到数组，当前敌人数量: ${enemies.length}`);
        } catch (error) {
            console.error('生成敌人时发生错误:', error);
        }
    }
}
