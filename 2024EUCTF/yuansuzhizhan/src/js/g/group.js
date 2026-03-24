/*==============================================================================

组类（Group）

==============================================================================*/

// 定义组构造函数
g.Group = function() {
	this.collection = []; // 存储组中元素的数组
	this.length = 0; // 组中元素的数量
};

// 向组中添加元素
g.Group.prototype.push = function( item ) {
	this.length++; // 增加组的长度
	return this.collection.push( item ); // 将元素添加到数组末尾
};

// 从组中移除最后一个元素
g.Group.prototype.pop = function() {
	this.length--; // 减少组的长度
	return this.collection.pop(); // 移除并返回数组的最后一个元素
};

// 在组的开头添加元素
g.Group.prototype.unshift = function( item ) {
	this.length++; // 增加组的长度
	return this.collection.unshift( item ); // 将元素添加到数组开头
};

// 从组中移除第一个元素
g.Group.prototype.shift = function() {
	this.length--; // 减少组的长度
	return this.collection.shift(); // 移除并返回数组的第一个元素
};

// 获取指定索引处的元素
g.Group.prototype.getAt = function( index ) {
	return this.collection[ index ]; // 返回指定索引的元素
};

// 根据属性值查找元素
g.Group.prototype.getByPropVal = function( prop, val ) {
	var foundItem = null; // 用于存放找到的元素
	this.each( function( item, i, collection ) {
		if( item[ prop ] == val ) {
			foundItem = item; // 找到匹配的元素
			return; // 结束循环
		}
	}, 0, this );
	return foundItem; // 返回找到的元素
};

// 移除指定索引处的元素
g.Group.prototype.removeAt = function( index ) {
	if( index < this.length ) {
		this.collection.splice( index, 1 ); // 移除指定索引的元素
		this.length--; // 减少组的长度
	}
};

// 移除指定的元素
g.Group.prototype.remove = function( item ) {
	var index = this.collection.indexOf( item ); // 获取元素的索引
	if( index > -1 ) {
		this.collection.splice( index, 1 ); // 移除该元素
		this.length--; // 减少组的长度
	}
};

// 清空组
g.Group.prototype.empty = function() {
	this.collection.length = 0; // 清空数组
	this.length = 0; // 重置长度
};

// 遍历组中的每个元素
g.Group.prototype.each = function( action, asc, context ) {
	var length = this.length,
		isString = g.isString( action ), // 判断 action 是否为字符串
		ctx = context || window, // 获取上下文
		i;
	if( asc ) { // 正序遍历
		for( i = 0; i < length; i++ ) {
			if( isString ) {
				this.collection[ i ][ action ]( i ); // 字符串方法调用
			} else {
				action.bind( ctx, this.collection[ i ], i, this.collection )(); // 其他方法调用
			}
		}
	} else { // 逆序遍历
		i = length;
		while( i-- ) {
			if( isString ) {
				this.collection[ i ][ action ]( i ); // 字符串方法调用
			} else {
				action.bind( ctx, this.collection[ i ], i, this.collection )(); // 其他方法调用
			}
		}
	}
};
