/*==============================================================================

游戏

==============================================================================*/

g.init = function() {
	// 为唯一标识符初始化
	g.guid = 0;

	// 游戏尺寸设置
	g.size = 40; // 每个格子的大小
	g.width = 800; // 游戏宽度
	g.height = 600; // 游戏高度
	g.cols = g.width / g.size; // 列数
	g.rows = g.height / g.size; // 行数

	// 设置游戏元素
	g.dom = g.qS('.g'); // 获取游戏元素的 DOM
	g.css(g.dom, {
		'width': g.width + 'px', // 设置元素宽度
		'height': g.height + 'px' // 设置元素高度
	});

	// 事件绑定
	g.on(window, 'load', g.onLoad); // 当窗口加载完成时调用 g.onLoad
	g.on(g.dom, 'click', g.onClick); // 当游戏区域被点击时调用 g.onClick

	// 初始化游戏状态
	g.play = new StatePlay(); // 创建游戏状态实例
	g.play.init(); // 初始化游戏状态
	g.step(); // 开始游戏循环
};

// 游戏循环
g.step = function() {
	requestAnimationFrame(g.step); // 请求下一个动画帧
	g.play.step(); // 更新游戏状态
	g.play.draw(); // 绘制游戏元素
};

// 窗口加载完成事件处理
g.onLoad = function() {
	g.addClass(g.dom, 'loaded'); // 为游戏元素添加 'loaded' 类
};

// 游戏区域点击事件处理
g.onClick = function(e) {
	e.stopPropagation(); // 阻止事件冒泡
};

// 初始化游戏
g.init();
