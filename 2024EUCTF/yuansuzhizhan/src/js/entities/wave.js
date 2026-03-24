/*==============================================================================

波次类

==============================================================================*/

// 定义波次构造函数
g.W = function( opt ) {
	g.merge( this, opt ); // 合并选项到波次对象
	this.init(); // 初始化波次
};

// 波次的初始化方法
g.W.prototype.init = function() {
	this.guid = g.guid++; // 生成唯一的波次ID
	this.tick = 0; // 当前计时器
	this.tickMax = 50 - this.num; // 计时器的最大值，基于当前波次中的敌人数量
	this.enemies = new g.Group(); // 敌人组
	this.counts = { // 敌人数量统计
		e: 0, // 敌人类型e的数量
		w: 0, // 敌人类型w的数量
		a: 0, // 敌人类型a的数量
		f: 0  // 敌人类型f的数量
	};
};

// 每帧更新波次的状态
g.W.prototype.step = function() {
	if( this.state.isPlaying ) { // 如果游戏正在进行
		if( this.tick >= this.tickMax && this.enemies.length ) { // 如果计时器达到最大值且还有敌人可供激活
			this.tick = 0; // 重置计时器
			var enemy = this.enemies.shift(); // 从敌人组中取出一个敌人
			enemy.activate(); // 激活敌人
			this.state.enemies.push( enemy ); // 将敌人添加到游戏状态中的敌人列表
		} else {
			this.tick++; // 增加计时器
		}
	}
};
