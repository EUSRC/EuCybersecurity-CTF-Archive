/*==============================================================================

音频管理类

==============================================================================*/

g.audio.sounds = {}; // 存储音频的对象

// 添加音效
g.audio.add = function( key, count, settings ) {
	g.audio.sounds[ key ] = []; // 初始化音效数组
	settings.forEach( function( elem, index ) {
		g.audio.sounds[ key ].push( { // 为每个音效设置音效数据结构
			tick: 0, // 当前音频索引
			count: count, // 音频池的数量
			pool: [] // 存储音频对象的池
		});
		while( count-- ) { // 根据数量循环创建音频对象
			var audio = new Audio(); // 创建新的音频对象
			audio.src = jsfxr( elem ); // 设置音频源
			g.audio.sounds[ key ][ index ].pool.push( audio ); // 将音频对象添加到池中
		}
	}, this );
};

// 播放音效
g.audio.play = function( key ) {
	var sound = g.audio.sounds[ key ]; // 获取音效数组
	var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ]; // 随机选择一个音效数据
	soundData.pool[ soundData.tick ].play(); // 播放当前音频
	if( soundData.tick < soundData.count - 1 ) { // 检查是否可以增加索引
		soundData.tick++; // 增加索引
	} else {
		soundData.tick = 0; // 重置索引
	}
};
