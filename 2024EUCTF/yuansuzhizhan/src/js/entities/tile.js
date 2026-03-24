/*==============================================================================

瓦片类

==============================================================================*/

// 定义瓦片构造函数
g.Ti = function( opt ) {
	g.merge( this, opt ); // 合并选项到瓦片对象
	this.init(); // 初始化瓦片
};

// 瓦片的初始化方法
g.Ti.prototype.init = function() {
	this.guid = g.guid++; // 生成唯一的瓦片ID
	// 创建瓦片的DOM元素并设置其类
	this.dom = g.cE( this.state.dom.state, this.classes );
	// 设置DOM元素的样式
	g.css( this.dom, {
		'transform': 'translate(' + this.col * g.size + 'px , ' + this.row * g.size + 'px )', // 设置位置
		'width': g.size + 'px', // 设置宽度
		'height': g.size + 'px', // 设置高度
		'zIndex': g.rows - this.row // 设置层级
	});
	// 为瓦片添加事件监听
	g.on( this.dom, 'mouseenter', this.onMouseenter, this ); // 鼠标进入事件
	g.on( this.dom, 'click', this.onClick, this ); // 点击事件
};

// 鼠标进入事件处理
g.Ti.prototype.onMouseenter = function() {
	if( !this.isPath ) { // 如果不是路径瓦片
		g.audio.play( 'ui-tap' ); // 播放点击音效
	}
};

// 点击事件处理
g.Ti.prototype.onClick = function( e ) {
	if( !this.state.isBuildMenuOpen ) { // 如果建造菜单未打开
		if( !this.isPath ) { // 如果不是路径瓦片
			this.state.showBuildMenu( this ); // 显示建造菜单
			this.state.lastClickedTile = this; // 更新最后点击的瓦片
		}
	}
};
