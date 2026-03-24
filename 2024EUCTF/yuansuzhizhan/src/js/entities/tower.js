/*==============================================================================

塔类

==============================================================================*/

// 定义塔构造函数
g.To = function( opt ) {
	g.merge( this, opt ); // 合并选项到塔对象
	this.init(); // 初始化塔
};

// 塔的初始化方法
g.To.prototype.init = function() {
	this.guid = g.guid++; // 生成唯一的塔ID
	this.data = g.data.towers[ this.type ]; // 获取塔的数据
	this.lvl = 0; // 塔的等级
	this.counters = this.data.counters; // 塔的克制类型
	this.spent = this.data.stats[ 0 ].cst; // 初始花费

	this.cx = this.col * g.size + g.size / 2; // 塔的中心x坐标
	this.cy = this.row * g.size + g.size / 2; // 塔的中心y坐标
	
	this.turretRotation = 0; // 塔的炮台旋转角度

	this.setupDom(); // 设置DOM元素
	this.setupEvents(); // 设置事件监听
	this.setStats(); // 设置塔的属性
};

// 每帧更新塔的状态
g.To.prototype.step = function() {
	var angle = this.state.globalTurretRotation; // 默认旋转角度
	if( this.target ) { // 如果有目标
		var dx = this.target.cx - this.cx, // 目标的x距离
			dy = this.target.cy - this.cy, // 目标的y距离
			dist = Math.sqrt( dx * dx + dy * dy ); // 计算距离
		angle = Math.atan2( dy, dx ) + Math.PI * 0.75; // 计算炮台的旋转角度
	}
	this.turretRotation = angle; // 更新炮台旋转角度

	if( this.state.isPlaying ) { // 如果游戏正在进行
		this.fire(); // 发射子弹

		if( this.bulletTick < this.rte ) { // 如果子弹计时未到发射速率
			this.bulletTick++; // 增加计时
		}
	}
};

// 绘制塔
g.To.prototype.draw = function() {
	g.css( this.dom.slab, 'transform', 'rotate(' + this.state.globalSlabRotation + 'rad)' ); // 旋转塔基
	g.css( this.dom.turret, 'transform', 'rotate(' + this.turretRotation + 'rad)' ); // 旋转炮台
	if( this.target ) { // 如果有目标
		g.addClass( this.dom.wrap, 'targeting' ); // 添加目标状态类
		g.css( this.dom.core, 'transform', 'scale(' + (0.25 + Math.sin( this.state.tick * 0.75 ) * 0.05) + ')' ); // 更新核心缩放
	} else {
		g.css( this.dom.core, 'transform', 'scale(' + this.state.globalCoreScale + ')' ); // 设置核心缩放
		g.removeClass( this.dom.wrap, 'targeting' ); // 移除目标状态类
	}
};

// 设置塔的属性
g.To.prototype.setStats = function() {
	var stats = this.data.stats[ this.lvl ]; // 获取当前等级的属性
	this.dmg = stats.dmg; // 伤害
	this.rng = stats.rng; // 射程
	this.rte = stats.rte; // 发射速率

	this.bulletTick = this.rte; // 重置子弹计时

	// 更新射程指示器的样式
	g.css( this.dom.range, {
		'width': this.rng * 2 + 'px',
		'height': this.rng * 2 + 'px'
	});
};

// 升级塔
g.To.prototype.upgrade = function() {
	this.lvl++; // 升级
	this.spent += this.data.stats[ this.lvl ].cst; // 增加花费
	this.setStats(); // 更新属性
	g.removeClass( this.dom.wrap, 't-lvl-0 t-lvl-1 t-lvl-2' ); // 移除旧等级类
	g.addClass( this.dom.wrap, 't-lvl-' + this.lvl ); // 添加新等级类
};

// 回收塔
g.To.prototype.reclaim = function() {
	this.state.setFragments( Math.ceil( this.spent * 0.75 ) ); // 设置回收的积分
	this.state.towers.remove( this ); // 从塔列表中移除
	this.state.dom.state.removeChild( this.dom.wrap ); // 移除DOM元素
};

// 获取目标敌人
g.To.prototype.getTarget = function() {
	var enemies = this.state.enemies,
		enemiesInRange = []; // 在射程内的敌人
	// 如果地图上有敌人
	if( enemies.length ) {
		// 循环遍历敌人，获取在射程内的敌人
		enemies.each( function( enemy, i, collection ) {
			var dist = g.distance( this.cx, this.cy, enemy.cx, enemy.cy ); // 计算与敌人的距离
			if( this.rng + enemy.radius > dist ) { // 如果在射程内
				enemiesInRange.push( enemy ); // 添加到射程内的敌人列表
			}
		}, 1, this );
		// 如果有敌人在射程内
		if( enemiesInRange.length ) {
			if( this.type =='w' ) { // 水塔类型
				// 随机选择一个目标
				this.target = enemiesInRange[ Math.floor( g.rand( 0, enemiesInRange.length ) ) ];
			} else {
				// 按照敌人行进的距离排序
				enemiesInRange.sort(function( a, b ) {
					return a.distanceTraveled - b.distanceTraveled;
				});
				this.target = enemiesInRange.pop(); // 选择距离最远的敌人作为目标
			}
		} else {
			this.target = null; // 如果没有敌人，则目标为null
		}
	} else {
		this.target = null; // 如果没有敌人，则目标为null
	}
};

// 发射子弹
g.To.prototype.fire = function() {
	// 如果可以按照当前发射速率发射子弹
	if( this.bulletTick >= this.rte ) {
		this.getTarget(); // 获取目标
		// 如果这个塔有目标敌人
		if( this.target ) {
			g.audio.play( 'fire-' + this.type ); // 播放发射音效
			this.bulletTick = 0; // 重置子弹计时
			var slow = 0; // 减速值
			if( this.type == 'w' ) { // 如果是水塔
				slow = 20 + this.lvl * 20; // 计算减速值
			}
			// 创建子弹
			this.state.bullets.create({
				state: this.state,
				type: this.type,
				counters: this.counters,
				dmg: this.dmg,
				target: this.target.guid,
				x: this.cx, // 塔的中心x坐标
				y: this.cy, // 塔的中心y坐标
				slow: slow // 减速值
			});
		}
	}
};

// 设置塔的DOM元素
g.To.prototype.setupDom = function() {
	this.dom = {};
	this.dom.wrap   = g.cE( this.state.dom.state, 't-wrap t-lvl-' + this.lvl + ' t-type-' + this.type ); // 创建塔的包装元素
	this.dom.tower  = g.cE( this.dom.wrap, 't-tower' ); // 创建塔元素
	this.dom.slab   = g.cE( this.dom.tower, 't-slab' ); // 创建基座元素
	this.dom.turret = g.cE( this.dom.tower, 't-turret' ); // 创建炮台元素
	this.dom.base   = g.cE( this.dom.tower, 't-base' ); // 创建基底元素
	this.dom.core   = g.cE( this.dom.tower, 't-core' ); // 创建核心元素
	this.dom.range  = g.cE( this.dom.tower, 't-range' ); // 创建射程指示器
	g.cE( this.dom.wrap, 't-lvl-bar t-lvl-bar-0' ); // 创建等级条
	g.cE( this.dom.wrap, 't-lvl-bar t-lvl-bar-1' ); // 创建等级条
	g.cE( this.dom.wrap, 't-lvl-bar t-lvl-bar-2' ); // 创建等级条
	g.css( this.dom.wrap, 'transform', 'translate3d(' + this.col * g.size + 'px , ' + this.row * g.size + 'px, 0 )' ); // 设置位置
};

// 设置塔的事件监听
g.To.prototype.setupEvents = function() {
	g.on( this.dom.wrap, 'click', this.onClick, this ); // 添加点击事件
};

// 点击事件处理
g.To.prototype.onClick = function() {
	if( !this.state.isTowerMenuOpen ) { // 如果塔菜单未打开
		this.state.showTowerMenu( this ); // 显示塔菜单
		this.state.lastClickedTowerId = this.guid; // 记录最后点击的塔ID
		this.state.updateTowerMenuAvailability(); // 更新塔菜单的可用性
		g.addClass( this.dom.wrap, 'selected' ); // 添加选中类
	}
};
