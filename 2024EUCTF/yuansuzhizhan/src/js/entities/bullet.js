/*==============================================================================

子弹类

==============================================================================*/

// 定义子弹构造函数
g.B = function() {
	this.dom = g.cE( g.qS( '.s-play' ), 'bullet' ); // 创建子弹的DOM元素
};

// 子弹的初始化方法
g.B.prototype.init = function( opt ) {
	g.merge( this, opt ); // 合并选项到子弹对象
	this.guid = g.guid++;  // 生成唯一的子弹ID
	this.size = 6;         // 子弹大小
	this.radius = this.size / 2; // 子弹半径
	this.x -= this.radius; // 实际的x坐标
	this.y -= this.radius; // 实际的y坐标
	this.cx = 0;          // 中心x坐标
	this.cy = 0;          // 中心y坐标
	this.rx = 0;          // 渲染x坐标
	this.ry = 0;          // 渲染y坐标
	this.vx = 0;          // x方向速度
	this.vy = 0;          // y方向速度
	this.dx = 0;          // 到目标的x距离
	this.dy = 0;          // 到目标的y距离
	this.dist = 0;        // 到目标的距离
	this.angle = 0;       // 到目标的角度
	this.accel = 0.1;     // 加速度
	this.speed = 0;       // 速度
	this.updateCoords();   // 更新坐标
	g.removeClass( this.dom, 'type-e type-w type-a type-f' ); // 移除旧的类型类
	g.addClass( this.dom, 'type-' + this.type ); // 添加新的类型类
	g.css( this.dom, {
		'width': this.size + 'px',
		'height': this.size + 'px',
		'transform': 'translate3d(-999px, -999px, 0)' // 设置初始位置
	});
};

// 子弹的每帧更新方法
g.B.prototype.step = function() {
	if( this.state.isPlaying ) {
		var target = this.state.enemies.getByPropVal( 'guid', this.target ); // 获取目标敌人
		if( target ) {
			this.dx = target.cx - this.cx; // 计算目标的x距离
			this.dy = target.cy - this.cy; // 计算目标的y距离
			this.dist = Math.sqrt( this.dx * this.dx + this.dy * this.dy ); // 计算距离
			this.angle = Math.atan2( this.dy, this.dx ); // 计算角度
			this.vx = Math.cos( this.angle ) * this.speed; // 计算x方向速度
			this.vy = Math.sin( this.angle ) * this.speed; // 计算y方向速度
			this.speed += this.accel; // 增加速度

			if( Math.abs( this.dist ) > this.speed ) {
				this.x += this.vx; // 更新x坐标
				this.y += this.vy; // 更新y坐标
			} else {
				var dmg = this.dmg; // 获取基础伤害
				if( target.type == this.counters ) {
					dmg *= 1.5; // 如果目标被克制，伤害增加
				}
				g.audio.play( 'hit-' + this.type ); // 播放击中音效
				target.receiveDamage( dmg, this.slow ); // 目标接收伤害
				this.destroy(); // 销毁子弹
			}
		} else {
			this.destroy(); // 如果目标不存在，销毁子弹
		}
	}

	this.updateCoords(); // 更新坐标
};

// 绘制子弹
g.B.prototype.draw = function() {
	g.css( this.dom, 'transform', 'translate3d(' + this.rx + 'px , ' + this.ry + 'px, 0) rotate(' + ( this.angle + Math.PI / 4 ) + 'rad)' ); // 更新DOM样式
};

// 销毁子弹
g.B.prototype.destroy = function() {
	g.css( this.dom, 'transform', 'translate3d(-999px , -999px, 0)'); // 将子弹移出视图
	this.state.bullets.release( this ); // 释放子弹对象
};

// 更新子弹的坐标
g.B.prototype.updateCoords = function() {
	this.cx = this.x + this.size / 2; // 更新中心x坐标
	this.cy = this.y + this.size / 2; // 更新中心y坐标
	this.rx = this.x; // 更新渲染x坐标
	this.ry = this.y; // 更新渲染y坐标
};
