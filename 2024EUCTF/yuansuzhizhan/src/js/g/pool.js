/*==============================================================================

对象池类（Pool）

==============================================================================*/

// 定义对象池构造函数
g.Pool = function( base, preallocateAmount ) {
	this.base = base; // 基础对象构造函数
	this.preallocateAmount = preallocateAmount || 0; // 预分配的对象数量
	this.alive = []; // 存活对象的数组
	this.dead = []; // 死亡对象的数组
	this.length = 0; // 存活对象的数量
	this.deadLength = 0; // 死亡对象的数量
	if( this.preallocateAmount ) {
		this.preallocate(); // 如果指定预分配数量，则进行预分配
	}
};

// 预分配对象
g.Pool.prototype.preallocate = function() {
	for( var i = 0; i < this.preallocateAmount; i++ ) {
		this.dead.push( new this.base() ); // 创建新对象并推入死亡数组
		this.deadLength++; // 死亡对象数量增加
	}
};

// 创建新对象
g.Pool.prototype.create = function( opt ) {
	if( this.deadLength ) { // 如果有死亡对象可用
		var obj = this.dead.pop(); // 从死亡数组中取出一个对象
		obj.init( opt ); // 初始化对象
		this.alive.push( obj ); // 将对象推入存活数组
		this.deadLength--; // 死亡对象数量减少
		this.length++; // 存活对象数量增加
	} else { // 如果没有死亡对象
		var newItem =  new this.base(); // 创建新的对象
		newItem.init( opt ); // 初始化对象
		this.alive.push( newItem ); // 将对象推入存活数组
		this.length++; // 存活对象数量增加
	}
};

// 释放对象
g.Pool.prototype.release = function( obj ) {
	var i = this.alive.indexOf( obj ); // 查找对象在存活数组中的索引
	if( i > -1 ) {
		this.dead.push( this.alive.splice( i, 1 )[ 0 ] ); // 从存活数组中移除对象并推入死亡数组
		this.length--; // 存活对象数量减少
		this.deadLength++; // 死亡对象数量增加
	}
};

// 清空对象池
g.Pool.prototype.empty = function() {
	this.alive.length = 0; // 清空存活数组
	this.dead.length = 0; // 清空死亡数组
	this.length = 0; // 存活对象数量重置为0
	this.deadLength = 0; // 死亡对象数量重置为0
};

// 遍历存活对象
g.Pool.prototype.each = function( action, asc ) {
	var i = this.length;
	while( i-- ) {
		this.alive[ i ][ action ]( i ); // 对每个存活对象执行指定的操作
	}
};
