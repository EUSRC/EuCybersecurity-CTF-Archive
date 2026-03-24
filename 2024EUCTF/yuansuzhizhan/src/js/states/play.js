/*==============================================================================

游戏状态类（Play State）

==============================================================================*/

// 定义游戏状态构造函数
var StatePlay = function(){};

/*==============================================================================

初始化方法

==============================================================================*/

// 初始化游戏状态
StatePlay.prototype.init = function() {
	// 一般布尔值
	this.isPlaying = 0; // 当前是否在玩
	this.isBuildMenuOpen = 0; // 建造菜单是否打开
	this.isTowerMenuOpen = 0; // 塔菜单是否打开
	this.isBuildable = 0; // 是否可以建造

	// 状态变量
		// 一般状态
		this.won = 0; // 是否获胜
		this.tick = 0; // 当前时间戳
		this.hasPlayed = 0; // 是否已经开始游戏
		this.speed = 1; // 游戏速度
		// 波次状态
		this.wave = 0; // 当前波次
		this.waveNext = this.wave + 1; // 下一波次
		this.wavesTotal = g.data.waves.length; // 总波次
		// 生命值
		this.livesTotal = 20; // 总生命值
		this.lives = this.livesTotal; // 当前生命值
		// 资源碎片
		this.fragments = 1000; // 当前碎片数
		this.fragmentsDisplay = this.fragments; // 显示的碎片数
		this.fragmentsDisplayLast = 0; // 上一次显示的碎片数
		this.sendEarlyAmt = 0; // 提前发送的数量
		// 瓦片状态
		this.lastClickedTile = null; // 上次点击的瓦片
		// 全局绘制变量
		this.globalSlabRotation = 0; // 全局平板旋转
		this.globalTurretRotation = 0; // 全局炮台旋转
		this.globalCoreScale = 0.1; // 全局核心缩放
		// 塔状态
		this.lastClickedTowerId = null; // 上次点击的塔的ID
		this.towers = new g.Group(); // 塔的集合
		// 波次
		this.waves = new g.Group(); // 波次集合
		this.activeWaves = new g.Group(); // 活跃波次集合
		// 敌人
		this.enemies = new g.Group(); // 敌人集合
		// 子弹池
		this.bullets = new g.Pool( g.B, 20 ); // 创建一个子弹池，最大容量为20

	// 设置DOM
		this.dom = {};
		// 获取状态DOM元素
		this.dom.state = g.qS( '.s-play' );
		// 获取UI按钮DOM元素
		this.dom.button   = g.qS( '.b' );
		this.dom.play     = g.qS( '.b-play' );
		this.dom.x1       = g.qS( '.b-x1' );
		this.dom.x2       = g.qS( '.b-x2' );
		this.dom.x3       = g.qS( '.b-x3' );
		this.dom.send     = g.qS( '.b-send' );
		this.dom.sendText = g.qS( '.send' );
		// 获取UI显示DOM元素
		this.dom.lives     = g.qS( '.d-lives' );
		this.dom.fragments = g.qS( '.d-fragments' );
		this.dom.wave      = g.qS( '.d-wave' );
		this.dom.next      = g.qS( '.d-next' );
		this.dom.eWave     = g.qS( '.w-e' );
		this.dom.wWave     = g.qS( '.w-w' );
		this.dom.aWave     = g.qS( '.w-a' );
		this.dom.fWave     = g.qS( '.w-f' );
		// 获取建造菜单DOM元素
		this.dom.buildMenuWrap = g.qS( '.build-menu-wrap' );
		this.dom.buildMenu     = g.qS( '.build-menu' );
		this.dom.buildButton   = g.qS( '.build-button' );
		this.dom.buildDefault  = g.qS( '.build-d' );
		this.dom.buildEarth    = g.qS( '.build-e' );
		this.dom.buildWater    = g.qS( '.build-w' );
		this.dom.buildAir      = g.qS( '.build-a' );
		this.dom.buildFire     = g.qS( '.build-f' );
		this.dom.buildCost     = g.qS( '.build-cost' );
		this.dom.buildType     = g.qS( '.build-type' );
		this.dom.buildDmg      = g.qS( '.build-dmg' );
		this.dom.buildRng      = g.qS( '.build-rng' );
		this.dom.buildRte      = g.qS( '.build-rte' );
		// 获取塔菜单DOM元素
		this.dom.towerMenuWrap  = g.qS( '.tower-menu-wrap' );
		this.dom.towerMenu      = g.qS( '.tower-menu' );
		this.dom.towerButton    = g.qS( '.tower-button' );
		this.dom.towerHighlight = g.qS( '.tower-button.highlight' );
		this.dom.towerUpgrade   = g.qS( '.tower-button.upgrade' );
		this.dom.towerReclaim   = g.qS( '.tower-button.reclaim' );
		this.dom.towerCost      = g.qS( '.tower-cost' );
		this.dom.towerLabel     = g.qS( '.tower-label' );
		this.dom.towerDmg       = g.qS( '.tower-dmg' );
		this.dom.towerRng       = g.qS( '.tower-rng' );
		this.dom.towerRte       = g.qS( '.tower-rte' );
		this.dom.towerDmgNext   = g.qS( '.tower-dmg-next' );
		this.dom.towerRngNext   = g.qS( '.tower-rng-next' );
		this.dom.towerRteNext   = g.qS( '.tower-rte-next' );

	// 事件
		// 设置一般事件
		document.onselectstart = function(){ return false; }; // 禁止文本选择
		g.on( window, 'click', this.onWinClick, this ); // 点击事件
		// 设置UI按钮事件
		g.on( this.dom.play, 'click', this.onPlayClick, this );
		g.on( this.dom.x1, 'click', this.onX1Click, this );
		g.on( this.dom.x2, 'click', this.onX2Click, this );
		g.on( this.dom.x3, 'click', this.onX3Click, this );
		g.on( this.dom.send, 'click', this.onSendClick, this );
		for( var i = 0, length = this.dom.button.length; i < length; i++ ) {
			var button = this.dom.button[ i ];
			g.on( button, 'mouseenter', this.onButtonMouseenter, this ); // 鼠标进入事件
			g.on( button, 'click', this.onButtonClick, this ); // 点击事件
		}
		// 设置建造菜单事件
		g.on( this.dom.buildMenuWrap, 'click', this.onBuildMenuWrapClick, this );
		g.on( this.dom.buildMenu, 'click', this.onBuildMenuClick, this );
		for( var j = 0, lengthj = this.dom.buildButton.length; j < lengthj; j++ ) {
			var buildButton = this.dom.buildButton[ j ];
			g.on( buildButton, 'mouseenter', this.onBuildButtonMouseenter, this );
			g.on( buildButton, 'mouseleave', this.onBuildButtonMouseleave, this );
			g.on( buildButton, 'click', this.onBuildButtonClick, this );
		}
		// 设置塔菜单事件
		g.on( this.dom.towerMenuWrap, 'click', this.onTowerMenuWrapClick, this );
		g.on( this.dom.towerMenu, 'click', this.onTowerMenuClick, this );
		for( var k = 0, lengthk = this.dom.towerButton.length; k < lengthk; k++ ) {
			var towerButton = this.dom.towerButton[ k ];
			g.on( towerButton, 'mouseenter', this.onTowerButtonMouseenter, this );
			g.on( towerButton, 'mouseleave', this.onTowerButtonMouseleave, this );
			g.on( towerButton, 'click', this.onTowerButtonClick, this );
		}

	// 初始化
		this.updateLife(); // 更新生命值显示
		// 设置瓦片
		this.setupTiles();
		// 设置波次
		this.setupWaves();
		// 初始化一步
		this.isPlaying = 1; // 设置为正在播放
		this.step(); // 执行一步
		this.isPlaying = 0; // 设置为未播放
};

/*==============================================================================

游戏执行步骤

==============================================================================*/

// 每一步的执行
StatePlay.prototype.step = function() {
	// 更新碎片数
	this.updateFragments();

	for( var i = 0; i < this.speed; i++ ) {
		// 更新全局属性
		this.updateGlobals();
		// 更新塔
		this.towers.each( 'step' );
		// 更新敌人
		this.enemies.each( 'step' );
		// 更新子弹
		this.bullets.each( 'step' );
		// 更新波次
		this.updateWaves();
	}
	this.tick++; // 增加时间戳
};

/*==============================================================================

绘制

==============================================================================*/

// 绘制当前状态
StatePlay.prototype.draw = function() {
	// 绘制塔
	this.towers.each( 'draw' );
	// 绘制敌人
	this.enemies.each( 'draw' );
	// 绘制子弹
	this.bullets.each( 'draw' );
};

/*==============================================================================

一般事件处理

==============================================================================*/

// 点击游戏区域的事件处理
StatePlay.prototype.onWinClick = function() {
	// 如果点击了游戏外部区域
	// 且建造菜单打开，则隐藏建造菜单
	if( this.isBuildMenuOpen ) {
		g.audio.play( 'ui-l' ); // 播放音效
		this.hideBuildMenu();
	}
	// 如果塔菜单打开，则隐藏塔菜单
	if( this.isTowerMenuOpen ) {
		g.audio.play( 'ui-l' ); // 播放音效
		this.hideTowerMenu();
	}
};

/*==============================================================================

按钮事件处理

==============================================================================*/

// 鼠标进入按钮事件处理
StatePlay.prototype.onButtonMouseenter = function() {
	g.audio.play( 'ui-m' ); // 播放音效
};

// 按钮点击事件处理
StatePlay.prototype.onButtonClick = function() {
	g.audio.play( 'ui-h' ); // 播放音效
};

// 播放按钮点击事件处理
StatePlay.prototype.onPlayClick = function() {
	if( !this.hasPlayed ) {
		this.advanceWave(); // 推进到下一波
		this.hasPlayed = 1; // 设置已开始游戏
	}
	this.isPlaying = !this.isPlaying; // 切换播放状态
	if( this.isPlaying ) {
		g.addClass( g.dom, 'playing' ); // 添加播放类
	} else {
		g.removeClass( g.dom, 'playing' ); // 移除播放类
	}
};

// 设置游戏速度
StatePlay.prototype.onX1Click = function() {
	this.speed = 1; // 设置为速度1
	g.removeClass( g.dom, 'x1 x2 x3' );
	g.addClass( g.dom, 'x1' ); // 添加速度1类
};

StatePlay.prototype.onX2Click = function() {
	this.speed = 2; // 设置为速度2
	g.removeClass( g.dom, 'x1 x2 x3' );
	g.addClass( g.dom, 'x2' ); // 添加速度2类
};

StatePlay.prototype.onX3Click = function() {
	this.speed = 3; // 设置为速度3
	g.removeClass( g.dom, 'x1 x2 x3' );
	g.addClass( g.dom, 'x3' ); // 添加速度3类
};

// 发送按钮点击事件处理
StatePlay.prototype.onSendClick = function() {
	if( this.isPlaying ) {
		this.setFragments( this.sendEarlyAmt ); // 设置碎片数量
		this.advanceWave(); // 推进到下一波
	}
};

/*==============================================================================

地图/瓦片生成

==============================================================================*/

// 设置瓦片
StatePlay.prototype.setupTiles = function() {
	// 创建完整的瓦片网格，分为两个数组
	// 它们可以是基础瓦片或路径瓦片
	this.baseTiles = new g.Group(); // 基础瓦片集合
	this.pathTiles = new g.Group(); // 路径瓦片集合
	for( var x = 0; x < g.cols; x++ ) { // 遍历列
		for( var y = 0; y < g.rows; y++ ) { // 遍历行
			var isPath = this.isPath( x, y ), // 判断是否为路径
				classes = [ 'tile' ]; // 瓦片的类
			if( isPath ) {
				classes += ' path'; // 如果是路径，添加路径类
			}
			var tile = new g.Ti({ // 创建新瓦片
				state: this,
				col: x,
				row: y,
				isPath: isPath || 0,
				classes: classes,
				horizontal: x > g.cols / 2 ? 'e' : 'w', // 水平方向
				vertical: y > g.rows / 2 ? 's' : 'n' // 垂直方向
			});
			if( isPath ) {
				this.pathTiles.push( tile ); // 如果是路径，添加到路径集合
			} else {
				this.baseTiles.push( tile ); // 否则添加到基础瓦片集合
			}
		}
	}
};

// 判断某个瓦片是否为路径
StatePlay.prototype.isPath = function( x, y ) {
	// 根据地图路径数据
	// 确定某个瓦片是基础瓦片还是路径瓦片
	var mapLength = g.data.map.length;
	for( var i = 0; i < mapLength - 1; i++ ) {
		var p1 = g.data.map[ i ],
			p2 = g.data.map[ i + 1 ],
			minX = Math.min( p1[ 0 ], p2[ 0 ] ),
			minY = Math.min( p1[ 1 ], p2[ 1 ] ),
			maxX = Math.max( p1[ 0 ], p2[ 0 ] ),
			maxY = Math.max( p1[ 1 ], p2[ 1 ] );
		if( x >= minX && x <= maxX && y >= minY && y <= maxY ) { // 判断瓦片坐标是否在路径范围内
			return 1; // 是路径
		}
	}
};

/*==============================================================================

全局更新

==============================================================================*/

// 更新全局状态
StatePlay.prototype.updateGlobals = function() {
	this.globalSlabRotation -= 0.025; // 更新平板旋转
	this.globalTurretRotation += 0.025; // 更新炮台旋转
	this.globalCoreScale = 0.3 + Math.sin( this.tick / 30 ) * 0.15; // 更新核心缩放
};

/*==============================================================================

生命值管理

==============================================================================*/

// 移除生命值
StatePlay.prototype.removeLife = function() {
	g.audio.play( 'life' ); // 播放生命值减少的音效
	this.lives--; // 生命值减少
	this.updateLife(); // 更新生命值显示
	if( !this.lives ) {
		g.audio.play( 'gameover' ); // 播放游戏结束音效
		setTimeout( function() {
			alert( 'You lost.' ); // 提示游戏失败
			location.reload(); // 刷新页面
		}, 1000 );
	}
};

// 更新生命值显示
StatePlay.prototype.updateLife = function() {
	g.text( this.dom.lives, Math.max( 0, this.lives ) + ' / ' + this.livesTotal ); // 显示当前生命值和总生命值
};

/*==============================================================================

碎片/现金/支出/货币管理

==============================================================================*/

// 设置碎片数量
StatePlay.prototype.setFragments = function( amt ) {
	this.fragments += amt; // 更新碎片数量
	// 更新建造菜单的可用性
	this.updateBuildMenuAvailability();
	// 更新塔菜单的可用性
	this.updateTowerMenuAvailability();
	// 更新塔升级的可用性
	this.updateTowerUpgradeAvailability();
};

// 更新碎片显示
StatePlay.prototype.updateFragments = function() {
	this.fragmentsDisplay += ( this.fragments - this.fragmentsDisplay ) * 0.2; // 插值更新显示的碎片数量
	if( Math.round( this.fragmentsDisplay ) != Math.round( this.fragmentsDisplayLast ) ) {
		g.text( this.dom.fragments, g.formatCommas( this.fragmentsDisplay ) ); // 格式化并显示碎片数量
	}
	this.fragmentsDisplayLast = this.fragmentsDisplay; // 更新上一次显示的碎片数量
};

/*==============================================================================

波次管理

==============================================================================*/

// 设置波次
StatePlay.prototype.setupWaves = function() {
	// 遍历每个波次的数据
	for( var i = 0, ilength = g.data.waves.length; i < ilength; i++ ) {
		var wave = g.data.waves[ i ],
			newWave = new g.W({
				state: this,
				num: i
			});
		// 遍历该波次中的每组敌人
		for( var j = 0, jlength = wave.length; j < jlength; j++ ) {
			var set = wave[ j ].split( ' ' ),
				type = set[ 0 ],
				count = set[ 1 ],
				isBoss = set.length >= 3 ? 1 : 0; // 判断是否为Boss
			// 创建指定数量的敌人
			for( var k = 0; k < count; k++ ) {
				var enemy = new g.E({
					state: this,
					type: type,
					isBoss: isBoss,
					wave: i
				});
				newWave.enemies.push( enemy ); // 添加敌人到波次
				newWave.counts[type]++; // 更新该波次中敌人的数量
            }
        }
        this.waves.push(newWave); // 将新波次添加到波次集合
    }
};

// 更新波次状态
StatePlay.prototype.updateWaves = function() {
    // 更新提前发送的数量
    if (this.isPlaying) {
        if (this.waves.length) {
            this.sendEarlyAmt -= (50 + (10 * this.wave)) * 0.0003; // 随着波次增加，减少提前发送数量
            this.sendEarlyAmt = Math.max(0, this.sendEarlyAmt); // 确保不为负值
        } else {
            this.sendEarlyAmt = 0; // 如果没有波次，提前发送数量设为零
        }
        g.text(this.dom.sendText, Math.ceil(this.sendEarlyAmt)); // 显示提前发送数量
    }

    // 更新每个活跃波次
    this.activeWaves.each('step');

    // 如果活跃波次为空且还有波次，推进到下一波
    if (!this.activeWaves.length && this.waves.length && !this.enemies.length) {
        this.advanceWave();
    }

    // 检查活跃波次是否为空
    this.activeWaves.each(function(wave, i, collection) {
        if (!wave.enemies.length) {
            this.activeWaves.removeAt(i); // 移除没有敌人的波次
        }
    }, 0, this);

    // 检查胜利条件
    if (!this.activeWaves.length && !this.waves.length && !this.enemies.length && !this.won) {
        this.won = 1; // 设置为获胜状态
        var score = (this.lives * 100) + (this.fragments); // 计算分数
        setTimeout(function() {
            alert('You won! Based on lives and elemental fragments left, your score is: ' + g.formatCommas(score) + '你的flag是:' + flag); // 显示胜利结果-+-+-+-+PS:什么，你想在这里找flag？我就知道，不给！
            location.reload(); // 刷新页面
        }, 1000);
    }
};

// 推进到下一波
StatePlay.prototype.advanceWave = function() {
    // 处理波次转换
    if (this.hasPlayed) {
        if (this.waves.length) {
            this.activeWaves.push(this.waves.shift()); // 将下一波变为活跃波次
            g.text(this.dom.wave, (this.wave + 1) + ' / ' + this.wavesTotal); // 更新当前波次显示
            this.wave++; // 增加当前波次
            g.audio.play('wave'); // 播放波次音效
            if (this.wave < this.wavesTotal) {
                this.waveNext++;
                var waveNext = this.waves.getAt(0); // 获取下一波次的信息
                this.sendEarlyAmt = 50 + (10 * this.wave); // 设置新波次的提前发送数量
                g.text(this.dom.eWave, waveNext.counts.e); // 显示下一波次的敌人数量
                g.text(this.dom.wWave, waveNext.counts.w);
                g.text(this.dom.aWave, waveNext.counts.a);
                g.text(this.dom.fWave, waveNext.counts.f);
            } else {
                this.waveNext = null; // 如果没有更多波次，设置为null
                g.text(this.dom.eWave, '--'); // 隐藏下一波次敌人数量
                g.text(this.dom.wWave, '--');
                g.text(this.dom.aWave, '--');
                g.text(this.dom.fWave, '--');
                g.addClass(g.dom, 'no-more-waves'); // 添加无更多波次的类
            }
        }
    } else {
        var next = this.waves.getAt(0); // 获取下一波次信息
        g.text(this.dom.eWave, next.counts.e); // 更新显示
        g.text(this.dom.wWave, next.counts.w);
        g.text(this.dom.aWave, next.counts.a);
        g.text(this.dom.fWave, next.counts.f);
        g.text(this.dom.wave, this.wave + ' / ' + this.wavesTotal); // 更新波次显示
    }
};

/*==============================================================================

建造菜单管理

==============================================================================*/

// 显示建造菜单
StatePlay.prototype.showBuildMenu = function(tile) {
    g.audio.play('ui-open'); // 播放菜单打开音效
    this.isBuildMenuOpen = 1; // 设置菜单打开状态
    this.isBuildable = 1; // 设置可建造状态
    g.addClass(g.dom, 'build-menu-open'); // 添加打开菜单的类

    // 设置适当的定位以防止溢出
    g.removeClass(g.dom, 'pos-n pos-e pos-s pos-w');
    g.addClass(g.dom, 'pos-' + tile.horizontal + ' ' + 'pos-' + tile.vertical);

    // 确定适当的坐标
    var x = tile.col * g.size - 20,
        y = tile.row * g.size - 20;

    if (tile.horizontal == 'e') {
        x -= 200; // 根据方向调整坐标
    }

    // 设置菜单位置
    g.css(this.dom.buildMenu, 'transform', 'translateX(' + x + 'px) translateY(' + y + 'px)');

    // 重置默认框的动画
    g.resetAnim(this.dom.buildDefault);
};

// 隐藏建造菜单
StatePlay.prototype.hideBuildMenu = function() {
    this.isBuildMenuOpen = 0; // 设置菜单关闭状态
    g.removeClass(g.dom, 'build-menu-open'); // 移除打开菜单的类
};

// 更新建造菜单的文本
StatePlay.prototype.updateBuildMenuText = function(type) {
    // 根据类型获取塔的数据
    var data = g.data.towers[type];
    // 设置文本节点
    g.text(this.dom.buildCost, data.stats[0].cst); // 显示建造成本
    g.text(this.dom.buildType, data.title); // 显示塔的类型
    g.text(this.dom.buildDmg, data.dmg + ' ' + data.bonus); // 显示伤害
    g.text(this.dom.buildRng, data.rng); // 显示范围
    g.text(this.dom.buildRte, data.rte); // 显示射击速度
    // 重置类并添加适当的类型类
    g.removeClass(g.dom, 'hover-e hover-w hover-a hover-f');
    g.addClass(g.dom, 'hover-build-button hover-' + type); // 设置悬停样式
    g.removeClass(g.dom, 'dmg1 dmg2 dmg3 rng1 rng2 rng3 rte1 rte2 rte3'); // 清空旧的状态类

    // 默认设置为1或“低”
    var meterDmg = 1,
        meterRng = 1,
        meterRte = 1;

    // 根据描述关键词获取计量值
    if (data.dmg == 'Medium') {
        meterDmg = 2; // 中等伤害
    } else if (data.dmg == 'High') {
        meterDmg = 3; // 高伤害
    }
    if (data.rng == 'Medium') {
        meterRng = 2; // 中等范围
    } else if (data.rng == 'High') {
        meterRng = 3; // 高范围
    }
    if (data.rte == 'Medium') {
        meterRte = 2; // 中等射击速度
    } else if (data.rte == 'High') {
        meterRte = 3; // 高射击速度
    }

    // 根据计量值设置类
    g.addClass(g.dom, 'dmg' + meterDmg);
    g.addClass(g.dom, 'rng' + meterRng);
    g.addClass(g.dom, 'rte' + meterRte);
};

// 更新建造菜单的可用性
StatePlay.prototype.updateBuildMenuAvailability = function() {
    g.removeClass(g.dom, 'no-b-e no-b-w no-b-a no-b-f'); // 移除所有不可用类
    var classes = '';
    if (this.fragments < g.data.towers.e.stats[0].cst) {
        classes += 'no-b-e '; // 土塔不可用
    }
    if (this.fragments < g.data.towers.w.stats[0].cst) {
        classes += 'no-b-w '; // 水塔不可用
    }
    if (this.fragments < g.data.towers.a.stats[0].cst) {
        classes += 'no-b-a '; // 空气塔不可用
    }
    if (this.fragments < g.data.towers.f.stats[0].cst) {
        classes += 'no-b-f '; // 火塔不可用
    }

    g.addClass(g.dom, classes); // 根据可用性添加类
};

// 处理建造菜单外包点击事件
StatePlay.prototype.onBuildMenuWrapClick = function(e) {
    // 如果点击了外包裹，关闭建造菜单
    g.audio.play('ui-l'); // 播放音效
    this.hideBuildMenu();
};

// 处理建造菜单内部点击事件
StatePlay.prototype.onBuildMenuClick = function(e) {
    // 防止点击事件冒泡到其他瓦片或按钮
    e.stopPropagation();
};

// 处理建造按钮鼠标进入事件
StatePlay.prototype.onBuildButtonMouseenter = function(e) {
    // 根据悬停元素设置建造菜单文本
    var type = g.attr(e.target, 'data-type');
    if (type) {
        g.audio.play('ui-m'); // 播放音效
        this.updateBuildMenuText(type); // 更新菜单文本
    }
};

// 处理建造按钮鼠标离开事件
StatePlay.prototype.onBuildButtonMouseleave = function(e) {
    // 移除悬停类，使描述淡出
    g.removeClass(g.dom, 'hover-build-button');
};

// 处理建造按钮点击事件
StatePlay.prototype.onBuildButtonClick = function(e) {
    var type = g.attr(e.target, 'data-type'); // 获取塔的类型
    if (type) {
        var cost = g.data.towers[type].stats[0].cst; // 获取建造成本
        if (cost <= this.fragments && this.isBuildable) { // 检查是否足够碎片并且可以建造
            g.audio.play('ui-h'); // 播放音效
            this.setFragments(-cost); // 扣除碎片
            var tile = this.lastClickedTile; // 获取上次点击的瓦片
            var tower = new g.To({ // 创建新塔
                state: this,
                col: tile.col,
                row: tile.row,
                horizontal: tile.horizontal,
                vertical: tile.vertical,
                type: type
            });
            this.towers.push(tower); // 将塔添加到塔集合中
            this.isBuildable = 0; // 设置为不可建造
            this.hideBuildMenu(); // 隐藏建造菜单
            this.updateTowerUpgradeAvailability(); // 更新塔的升级可用性
        }
    }
};

/*==============================================================================

塔菜单管理

==============================================================================*/

// 显示塔菜单
StatePlay.prototype.showTowerMenu = function(tower) {
    g.audio.play('ui-open'); // 播放菜单打开音效
    this.isTowerMenuOpen = 1; // 设置菜单打开状态
    g.addClass(g.dom, 'tower-menu-open'); // 添加打开菜单的类

    // 设置适当的类
    g.removeClass(g.dom, 't-menu-e t-menu-w t-menu-a t-menu-f');
    g.addClass(g.dom, 't-menu-' + tower.type);

    // 设置适当的定位以防止溢出
    g.removeClass(g.dom, 'pos-n pos-e pos-s pos-w');
    g.addClass(g.dom, 'pos-' + tower.horizontal + ' ' + 'pos-' + tower.vertical);

    // 确定适当的坐标
    var x = tower.col * g.size - 20,
        y = tower.row * g.size - 20;

    if (tower.horizontal == 'e') {
        x -= 200; // 根据方向调整坐标
    }

    // 设置塔菜单位置
    g.css(this.dom.towerMenu, 'transform', 'translateX(' + x + 'px) translateY(' + y + 'px)');

    // 重置高亮框的动画
    g.resetAnim(this.dom.towerHighlight);
};

// 隐藏塔菜单
StatePlay.prototype.hideTowerMenu = function() {
    this.isTowerMenuOpen = 0; // 设置菜单关闭状态
    g.removeClass(g.dom, 'tower-menu-open'); // 移除打开菜单的类
    this.towers.each(function(tower) {
        g.removeClass(tower.dom.wrap, 'selected'); // 移除选中状态
    }, 1, this);
};

// 更新塔菜单的文本
StatePlay.prototype.updateTowerMenuText = function(button) {
    var tower = this.getLastClickedTower(); // 获取上次点击的塔
    if (tower) {
        var data = g.data.towers[tower.type]; // 获取塔的数据
        if (button == 'upgrade') { // 如果是升级按钮被悬停
            g.addClass(g.dom, 'hover-tower-button hover-tower-upgrade'); // 添加悬停类
            // 如果没有完全升级
            if (tower.lvl < 2) {
                g.text(this.dom.towerCost, data.stats[tower.lvl + 1].cst); // 显示升级成本
                g.text(this.dom.towerLabel, 'Upgrade to Level ' + (tower.lvl + 2)); // 显示升级信息
                g.text(this.dom.towerDmg, data.stats[tower.lvl].dmg); // 显示当前伤害
                g.text(this.dom.towerRng, data.stats[tower.lvl].rng); // 显示当前范围
                g.text(this.dom.towerRte, 60 - data.stats[tower.lvl].rte); // 显示当前射击速度
                g.text(this.dom.towerDmgNext, data.stats[tower.lvl + 1].dmg); // 显示下一级伤害
                g.text(this.dom.towerRngNext, data.stats[tower.lvl + 1].rng); // 显示下一级范围
                g.text(this.dom.towerRteNext, 60 - data.stats[tower.lvl + 1].rte); // 显示下一级射击速度
            } else {
                // 如果已经达到了最大等级
                g.text(this.dom.towerCost, 'Maxed'); // 显示最大等级
                g.text(this.dom.towerLabel, data.title + ' Level ' + (tower.lvl + 1)); // 显示当前塔的等级
                g.text(this.dom.towerDmg, data.stats[tower.lvl].dmg); // 显示当前伤害
                g.text(this.dom.towerRng, data.stats[tower.lvl].rng); // 显示当前范围
                g.text(this.dom.towerRte, 60 - data.stats[tower.lvl].rte); // 显示当前射击速度
                g.text(this.dom.towerDmgNext, 'Maxed'); // 下一级伤害为最大
                g.text(this.dom.towerRngNext, 'Maxed'); // 下一级范围为最大
                g.text(this.dom.towerRteNext, 'Maxed'); // 下一级射击速度为最大
            }
        } else if (button == 'reclaim') { // 如果是回收按钮被悬停
            g.addClass(g.dom, 'hover-tower-button hover-tower-reclaim'); // 添加悬停类
            g.text(this.dom.towerCost, '+' + Math.ceil(tower.spent * 0.75)); // 显示回收的碎片
            g.text(this.dom.towerLabel, 'Reclaim 75%'); // 显示回收信息
            g.text(this.dom.towerDmg, data.stats[tower.lvl].dmg); // 显示当前伤害
            g.text(this.dom.towerRng, data.stats[tower.lvl].rng); // 显示当前范围
            g.text(this.dom.towerRte, 60 - data.stats[tower.lvl].rte); // 显示当前射击速度
        }
    }
};

// 更新塔菜单的可用性
StatePlay.prototype.updateTowerMenuAvailability = function() {
    var lastClickedTower = this.getLastClickedTower(); // 获取上次点击的塔
    if (lastClickedTower) {
        g.removeClass(g.dom, 'no-upgrade maxed-upgrade'); // 移除不可升级类
        var lvl = lastClickedTower.lvl;
        if (lvl == 2) {
            g.addClass(g.dom, 'no-upgrade maxed-upgrade'); // 如果已经达到最大等级
        } else {
            if (this.fragments < g.data.towers[lastClickedTower.type].stats[lvl + 1].cst) {
                g.addClass(g.dom, 'no-upgrade'); // 如果碎片不足，设置为不可升级
            }
        }
    }
};

// 更新塔的升级可用性
StatePlay.prototype.updateTowerUpgradeAvailability = function() {
    this.towers.each(function(tower) {
        if (tower.lvl < 2) {
            if (this.fragments >= g.data.towers[tower.type].stats[tower.lvl + 1].cst) {
                tower.upgradable = 1; // 设置为可升级
                g.addClass(tower.dom.wrap, 'upgradable'); // 添加可升级类
            } else {
                tower.upgradable = 0; // 设置为不可升级
                g.removeClass(tower.dom.wrap, 'upgradable'); // 移除可升级类
            }
        } else {
            tower.upgradable = 0; // 已达最大等级，不可升级
            g.removeClass(tower.dom.wrap, 'upgradable'); // 移除可升级类
        }
    }, 0, this);
};

// 处理塔菜单外包点击事件
StatePlay.prototype.onTowerMenuWrapClick = function(e) {
    // 如果点击了外包裹，关闭塔菜单
    g.audio.play('ui-l'); // 播放音效
    this.hideTowerMenu();
};

// 处理塔菜单内部点击事件
StatePlay.prototype.onTowerMenuClick = function(e) {
    // 防止点击事件冒泡到其他瓦片或按钮
    e.stopPropagation();
};

// 处理塔按钮鼠标进入事件
StatePlay.prototype.onTowerButtonMouseenter = function(e) {
    // 根据悬停的按钮设置塔菜单的文本
    g.audio.play('ui-m'); // 播放音效
    this.updateTowerMenuText(g.attr(e.target, 'data-action')); // 更新菜单文本
};

// 处理塔按钮鼠标离开事件
StatePlay.prototype.onTowerButtonMouseleave = function(e) {
    // 移除悬停类，淡出描述
    g.removeClass(g.dom, 'hover-tower-button hover-tower-upgrade hover-tower-reclaim');
};

// 处理塔按钮点击事件
StatePlay.prototype.onTowerButtonClick = function(e) {
    g.audio.play('ui-h'); // 播放音效
    var action = g.attr(e.target, 'data-action'), // 获取按钮的动作
        lastClickedTower = this.getLastClickedTower(); // 获取上次点击的塔
    if (action == 'upgrade') {
        if (lastClickedTower.upgradable) { // 如果可以升级
            lastClickedTower.upgrade(); // 执行升级
            this.setFragments(-g.data.towers[lastClickedTower.type].stats[lastClickedTower.lvl].cst); // 扣除升级成本
            this.updateTowerMenuText('upgrade'); // 更新菜单文本
        }
    } else if (action == 'reclaim') { // 如果是回收
        lastClickedTower.reclaim(); // 执行回收
        this.hideTowerMenu(); // 隐藏塔菜单
    }
};

// 获取上次点击的塔
StatePlay.prototype.getLastClickedTower = function() {
    if (this.lastClickedTowerId) {
        return this.towers.getByPropVal('guid', this.lastClickedTowerId); // 根据ID获取塔对象
    }
};