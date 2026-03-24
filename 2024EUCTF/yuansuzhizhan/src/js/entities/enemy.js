/*==============================================================================

敌人类

==============================================================================*/

// 定义敌人构造函数
g.E = function( opt ) {
	g.merge( this, opt ); // 合并选项到敌人对象
	this.init(); // 初始化敌人
};

// 敌人的初始化方法
g.E.prototype.init = function() {
	this.guid = g.guid++; // 生成唯一的敌人ID
	this.size = 14; // 敌人的初始大小
	this.dom = {}; // 存储DOM元素
	// 创建敌人的DOM元素，并添加类型类
	this.dom.enemy = g.cE( null, 'enemy type-' + this.type );
	if( this.isBoss ) { // 如果是Boss
		g.addClass( this.dom.enemy, 'boss' ); // 添加Boss类
		this.size = 20; // Boss的大小
	}
	this.dom.hl = g.cE( this.dom.enemy, 'hl' ); // 创建高亮元素
	this.dom.hp = g.cE( this.dom.enemy, 'hp' ); // 创建生命值元素
	this.hpTotal = 70; // 敌人的总生命值
	
	this.value = 100; // 敌人被消灭后给予的积分
	this.wp = 1; // 当前路径点索引
	this.angleFlag = 1; // 角度标志
	this.radius = this.size * 0.75; // 敌人半径
	// 计算敌人的初始位置
	this.x = g.data.map[ 0 ][ 0 ] * g.size; // 实际x坐标
	this.y = g.data.map[ 0 ][ 1 ] * g.size; // 实际y坐标
	this.cx = 0; // 中心x坐标
	this.cy = 0; // 中心y坐标
	this.rx = 0; // 渲染x坐标
	this.ry = 0; // 渲染y坐标
	this.vx = 0; // x方向速度
	this.vy = 0; // y方向速度
	this.dx = 0; // 到路径点的x距离
	this.dy = 0; // 到路径点的y距离
	this.dist = 0; // 到路径点的距离
	this.angle = 0; // 到路径点的角度
	this.rotation = 0; // 旋转角度
	this.speed = 1; // 敌人的速度
	this.distanceTraveled = 0; // 已行进的距离
	this.tick = 0; // 总tick数
	this.slowTick = 0; // 减速计数器
	this.updateCoords(); // 更新坐标
	// 设置DOM样式
	g.css( this.dom.enemy, {
		'width': this.size + 'px',
		'height': this.size + 'px',
		'transform': 'translate3d(' + this.rx + 'px , ' + this.ry + 'px, 0)'
	});

	// 应用波次增益
	// 生命值
	this.hpTotal += this.wave * 25;

	// 速度
	this.speed += this.wave * 0.05;

	// 积分
	this.value += this.wave;

	// 应用Boss增益
	if( this.isBoss ) {
		this.hpTotal *= 20; // Boss的生命值
		this.value *= 3; // Boss的积分
		this.speed *= 0.5; // Boss的速度
	}

	this.hp = this.hpTotal; // 当前生命值
};

// 每帧更新敌人的状态
g.E.prototype.step = function() {
	if( this.state.isPlaying ) {
		// 应用减速效果
		var speed = this.speed;
		if( this.slowTick ) {
			speed *= 0.5; // 减速一半
			this.slowTick--;
			g.addClass( this.dom.enemy, 'slow' ); // 添加减速类
		} else {
			g.removeClass( this.dom.enemy, 'slow' ); // 移除减速类
		}

		var wp = g.data.map[ this.wp ]; // 获取当前路径点
		this.dx = ( wp[ 0 ] * g.size ) - this.x; // 计算到路径点的x距离
		this.dy = ( wp[ 1 ] * g.size ) - this.y; // 计算到路径点的y距离
		this.dist = Math.sqrt( this.dx * this.dx + this.dy * this.dy ); // 计算距离
		if( this.angleFlag ) {
			this.angle = Math.atan2( this.dy, this.dx ); // 计算角度
			this.angleFlag = 0; // 重置角度标志
		}
		this.vx = Math.cos( this.angle ) * speed; // 计算x方向速度
		this.vy = Math.sin( this.angle ) * speed; // 计算y方向速度

		// 计算正确的旋转方向
		var dx = this.dx,
			dy = this.dy;
		dx /= this.dist ? this.dist : 1.0; 
		dy /= this.dist ? this.dist : 1.0;
		var dirx = Math.cos(this.rotation),
		diry = Math.sin(this.rotation);
		dirx += (dx - dirx) * 0.125; // 更新x方向
		diry += (dy - diry) * 0.125; // 更新y方向
		this.rotation = Math.atan2( diry, dirx ); // 计算新的旋转角度

		if( Math.abs( this.dist ) > speed ) {
			this.x += this.vx; // 更新x坐标
			this.y += this.vy; // 更新y坐标
			this.distanceTraveled += ( Math.abs( this.vx ) + Math.abs( this.vy ) ); // 累计已行进的距离
		} else {
			this.x = wp[ 0 ] * g.size; // 到达路径点，设置坐标
			this.y = wp[ 1 ] * g.size;
			if( this.wp + 1 >= g.data.map.length ) { // 如果到达最后一个路径点
				this.destroy(); // 销毁敌人
				this.state.removeLife(); // 移除玩家生命
			} else {
				this.wp++; // 移动到下一个路径点
				this.angleFlag = 1; // 重置角度标志
			}
		}

		if( this.hitTick > 0 ) {
			this.hitTick--; // 减少击中计时
		} else {
			g.removeClass( this.dom.enemy, 'hit' ); // 移除被击中类
		}
		this.tick++; // 增加tick计数
	}

	this.updateCoords(); // 更新坐标
};

// 绘制敌人
g.E.prototype.draw = function() {
	g.css( this.dom.enemy, 'transform', 'translate3d(' + this.rx + 'px , ' + this.ry + 'px, 0) rotate(' + ( this.rotation + Math.PI / 4 - Math.PI ) + 'rad)' ); // 更新DOM样式
};

// 处理敌人收到的伤害
g.E.prototype.receiveDamage = function( dmg, slow ) {
	if( slow ) {
		this.slowTick += slow; // 增加减速计数
	}
	this.hp -= dmg; // 减少生命值
	this.hitTick = 5; // 设置击中计时
	g.addClass( this.dom.enemy, 'hit' ); // 添加被击中类
	// 更新生命值条
	g.css( this.dom.hp, {
		'height': ( this.hp / this.hpTotal ) * 300 + '%',
		'width': ( this.hp / this.hpTotal ) * 300 + '%'
	});
	if( this.hp <= 0 ) { // 如果生命值小于等于0
		if( this.isBoss ) {
			g.audio.play( 'boss' ); // 播放Boss击败音效
		}
		this.state.setFragments( this.value ); // 设置掉落的积分
		this.destroy(); // 销毁敌人
	}
};

// 激活敌人
g.E.prototype.activate = function() {
	this.state.dom.state.appendChild( this.dom.enemy ); // 将敌人DOM元素添加到状态中
};

// 销毁敌人
g.E.prototype.destroy = function() {
	this.state.enemies.remove( this ); // 从敌人列表中移除
	this.state.dom.state.removeChild( this.dom.enemy ); // 移除DOM元素
};

// 更新敌人的坐标
g.E.prototype.updateCoords = function() {
	this.cx = this.x + g.size / 2; // 更新中心x坐标
	this.cy = this.y + g.size / 2; // 更新中心y坐标
	this.rx = this.cx - this.size / 2; // 更新渲染x坐标
	this.ry = this.cy - this.size / 2; // 更新渲染y坐标
};
