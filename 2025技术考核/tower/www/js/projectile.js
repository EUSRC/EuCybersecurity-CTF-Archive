/**
 * 投射物基类
 * 所有投射物类型都继承自这个基类
 */
class Projectile {
    /**
     * 创建投射物
     * @param {number} x - 投射物起始x坐标
     * @param {number} y - 投射物起始y坐标
     * @param {number} angle - 投射物角度
     * @param {number} damage - 投射物伤害
     * @param {Object} target - 目标敌人
     */
    constructor(x, y, angle, damage, target) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.damage = damage;
        this.target = target;
        this.speed = 300; // 默认速度
        this.radius = 5; // 默认半径
        this.hit = false; // 是否已击中目标
        this.color = '#ffffff'; // 默认颜色，子类会覆盖
        this.trailEffect = []; // 尾迹效果
    }
    
    /**
     * 更新投射物状态
     * @param {number} deltaTime - 帧间隔时间（秒）
     * @returns {boolean} - 如果投射物已击中目标或超出边界则返回true
     */
    update(deltaTime) {
        // 如果已击中目标，返回true表示可以移除
        if (this.hit) {
            return true;
        }
        
        // 更新投射物尾迹
        this.updateTrail(deltaTime);
        
        // 检查投射物是否已击中目标
        if (this.checkHit()) {
            this.onHit();
            return true;
        }
        
        // 如果目标已经死亡或到达终点，投射物消失
        if (this.target.isDead || this.target.reachedEnd) {
            return true;
        }
        
        // 计算投射物朝向目标的方向
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        this.angle = Math.atan2(dy, dx);
        
        // 更新投射物位置
        this.x += Math.cos(this.angle) * this.speed * deltaTime;
        this.y += Math.sin(this.angle) * this.speed * deltaTime;
        
        return false;
    }
    
    /**
     * 更新投射物尾迹效果
     * @param {number} deltaTime - 帧间隔时间（秒）
     */
    updateTrail(deltaTime) {
        // 添加新的尾迹粒子
        this.trailEffect.push({
            x: this.x,
            y: this.y,
            radius: this.radius * 0.8,
            alpha: 0.7,
            life: 0.5 // 生命周期（秒）
        });
        
        // 更新并移除过期的尾迹粒子
        for (let i = this.trailEffect.length - 1; i >= 0; i--) {
            const particle = this.trailEffect[i];
            particle.alpha -= deltaTime / particle.life;
            particle.radius *= 0.95;
            
            if (particle.alpha <= 0) {
                this.trailEffect.splice(i, 1);
            }
        }
    }
    
    /**
     * 检查投射物是否击中目标
     * @returns {boolean} - 如果击中目标则返回true
     */
    checkHit() {
        // 计算投射物与目标的距离
        const distance = Utils.distance(this.x, this.y, this.target.x, this.target.y);
        
        // 如果距离小于目标半径，则视为击中
        return distance <= this.target.radius;
    }
    
    /**
     * 投射物击中目标时的回调
     * 在子类中实现具体逻辑
     */
    onHit() {
        this.hit = true;
        // 对目标造成伤害
        this.target.takeDamage(this.damage);
    }
    
    /**
     * 绘制投射物
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    draw(ctx) {
        // 绘制尾迹效果
        for (const particle of this.trailEffect) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
            ctx.fill();
        }
        
        // 绘制投射物主体
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // 添加光晕效果
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

/**
 * 箭矢类
 */
class Arrow extends Projectile {
    constructor(x, y, angle, damage, target) {
        super(x, y, angle, damage, target);
        this.speed = 400; // 箭矢速度较快
        this.radius = 3; // 箭矢半径较小
        this.length = 12; // 箭矢长度
        this.color = '#3498db'; // 蓝色
    }
    
    /**
     * 绘制箭矢
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    draw(ctx) {
        // 绘制尾迹效果
        for (const particle of this.trailEffect) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52, 152, 219, ${particle.alpha * 0.5})`;
            ctx.fill();
        }
        
        // 绘制箭矢（旋转到朝向目标的角度）
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // 绘制箭杆
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.length, 0);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制箭头
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-3, 3);
        ctx.lineTo(-3, -3);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.restore();
    }
}

/**
 * 炮弹类
 */
class Cannonball extends Projectile {
    constructor(x, y, angle, damage, target, splashRadius) {
        super(x, y, angle, damage, target);
        this.speed = 250; // 炮弹速度较慢
        this.radius = 6; // 炮弹半径较大
        this.color = '#f39c12'; // 橙色
        this.splashRadius = splashRadius || 50; // 溅射半径
    }
    
    /**
     * 炮弹击中目标时的回调
     * 实现溅射伤害效果
     */
    onHit() {
        this.hit = true;
        
        // 对目标造成直接伤害
        this.target.takeDamage(this.damage);
        
        // 获取游戏实例
        const game = window.gameInstance;
        
        // 添加爆炸效果
        if (game) {
            game.addExplosion(this.x, this.y, this.splashRadius);
        }
        
        // 对范围内的敌人造成溅射伤害
        if (game && game.enemies) {
            for (const enemy of game.enemies) {
                if (!enemy.isDead && !enemy.reachedEnd && enemy !== this.target) {
                    const distance = Utils.distance(this.x, this.y, enemy.x, enemy.y);
                    
                    // 如果敌人在溅射范围内
                    if (distance <= this.splashRadius) {
                        // 伤害随距离衰减
                        const damageRatio = 1 - distance / this.splashRadius;
                        const splashDamage = this.damage * damageRatio * 0.5; // 溅射伤害为原伤害的50%，并随距离衰减
                        enemy.takeDamage(splashDamage);
                    }
                }
            }
        }
    }
    
    /**
     * 绘制炮弹
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    draw(ctx) {
        // 绘制尾迹效果（烟雾）
        for (const particle of this.trailEffect) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 200, 200, ${particle.alpha * 0.3})`;
            ctx.fill();
        }
        
        // 绘制炮弹主体
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // 添加炮弹光晕效果
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 150, 0, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 绘制炮弹内部纹理
        ctx.beginPath();
        ctx.arc(this.x - this.radius / 3, this.y - this.radius / 3, this.radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
        ctx.fill();
    }
}

/**
 * 魔法球类
 */
class MagicOrb extends Projectile {
    constructor(x, y, angle, damage, target, slowFactor, slowDuration) {
        super(x, y, angle, damage, target);
        this.speed = 300; // 魔法球速度适中
        this.radius = 5; // 魔法球半径适中
        this.color = '#9b59b6'; // 紫色
        this.slowFactor = slowFactor || 0.7; // 减速因子
        this.slowDuration = slowDuration || 2; // 减速持续时间（秒）
        this.pulseSize = 0; // 脉冲效果尺寸
        this.pulseSpeed = 5; // 脉冲速度
    }
    
    /**
     * 更新魔法球状态
     * @param {number} deltaTime - 帧间隔时间（秒）
     * @returns {boolean} - 如果魔法球已击中目标或超出边界则返回true
     */
    update(deltaTime) {
        // 更新脉冲效果
        this.pulseSize = (this.pulseSize + this.pulseSpeed * deltaTime) % 10;
        
        // 调用基类的update方法
        return super.update(deltaTime);
    }
    
    /**
     * 魔法球击中目标时的回调
     * 实现减速效果
     */
    onHit() {
        this.hit = true;
        
        // 对目标造成伤害
        if (this.target && !this.target.isDead && !this.target.reachedEnd) {
            this.target.takeDamage(this.damage);
            
            // 对目标施加减速效果
            this.target.slowFactor = Math.min(this.target.slowFactor || 1, this.slowFactor);
            this.target.slowDuration = this.slowDuration;
            this.target.isSlowed = true;
        }
    }
    
    /**
     * 绘制魔法球
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    draw(ctx) {
        // 绘制尾迹效果（魔法粒子）
        for (const particle of this.trailEffect) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(155, 89, 182, ${particle.alpha * 0.6})`;
            ctx.fill();
        }
        
        // 绘制脉冲效果
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + this.pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(155, 89, 182, ${0.6 - this.pulseSize / 15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 绘制魔法球主体
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // 添加魔法球内部细节
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        // 添加魔法光芒效果
        const time = Date.now() / 1000;
        const glowSize = this.radius * 1.5 + Math.sin(time * 5) * this.radius * 0.2;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(142, 68, 173, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
} 