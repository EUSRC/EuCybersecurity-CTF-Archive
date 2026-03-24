/*==============================================================================

工具类（Utilities）

==============================================================================*/

/*==============================================================================

数学工具（Math）

==============================================================================*/

// 生成指定范围内的随机数
g.rand = function( min, max ) {
	return Math.random() * ( max - min ) + min; // 返回 min 和 max 之间的随机数
};

/*==============================================================================

DOM操作工具（DOM）

==============================================================================*/

// 查询选择器，返回匹配元素
g.qS = function( q ) {
	var query = document.querySelectorAll( q ); // 获取所有匹配的元素
	if( query.length > 1 ) {
		return query; // 如果有多个匹配元素，返回整个 NodeList
	} else {
		return query[ 0 ]; // 否则返回第一个元素
	}
};

// 创建一个新的 div 元素并可选地附加到父元素
g.cE = function( appendParent, classes ) {
	var elem = document.createElement( 'div' ); // 创建 div 元素
	if( appendParent ) {
		appendParent.appendChild( elem ); // 附加到指定的父元素
	}
	if( classes ) {
		g.addClass( elem, classes ); // 添加指定的类
	}
	return elem; // 返回新创建的元素
};

// 添加事件监听
g.on = function( elem, e, cb, ctx ) {
	ctx = ctx || window; // 如果没有指定上下文，则使用 window
	elem.addEventListener( e, cb.bind( ctx ) ); // 绑定事件处理函数
};

// 设置元素的文本内容
g.text = function( elem, content ) {
	elem.firstChild.nodeValue = content; // 设置第一个子节点的值
};

// 重置动画
g.resetAnim = function( elem ) {
	g.removeClass( elem, 'anim' ); // 移除动画类
	elem.offsetWidth = elem.offsetWidth; // 触发重绘
	g.addClass( elem, 'anim' ); // 重新添加动画类
};

// 检查浏览器对 CSS 属性的前缀支持
g.prefixElement = g.cE(); // 创建一个元素用于前缀支持检查
g.prefixMatches = {}; // 缓存支持的前缀属性
g.prefixCheck = function (property) {
	if (g.prefixMatches[property]) {
		return [ g.prefixMatches[property], true ]; // 如果已经缓存，直接返回
	} else {
		var vendors = [ "", "Webkit", "Moz", "ms", "O" ],
			cb = function(match) { return match.toUpperCase(); }; // 转换为大写
		for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
			var propertyPrefixed;
			if (i === 0) {
				propertyPrefixed = property; // 不带前缀
			} else {
				propertyPrefixed = vendors[i] + property.replace(/^\w/, cb); // 带前缀
			}
			if (g.isString(g.prefixElement.style[propertyPrefixed])) {
				g.prefixMatches[property] = propertyPrefixed; // 缓存支持的属性
				return [ propertyPrefixed, true ]; // 返回带前缀的属性
			}
		}
		return [ property, false ]; // 未找到支持的属性
	}
};

// 设置 CSS 属性
g.css = function( elem, prop, val ) {
	if( g.isObject( prop ) ) {
		var cssProps = prop; // 如果 prop 是对象，递归设置属性
		for( prop in cssProps ) {
			if( cssProps.hasOwnProperty( prop ) ) {
				g.css( elem, prop, cssProps[ prop ] );
			}
		}
	} else {
		prop = g.prefixCheck( prop ); // 检查属性前缀
		if( prop[ 1 ] ) {
			elem.style[ prop[ 0 ] ] = val; // 设置 CSS 属性
		}
	}
};

// 检查元素是否拥有指定类
g.hasClass = function ( elem, className ) {
	if( className ) {
		return elem.classList.contains( className ); // 使用 classList 检查类名
	}
};

// 添加类名
g.addClass = function ( elem, className ) {
	if( className.length ) {
		if( className.indexOf( ' ' ) != -1 ) {
			classes = className.split( ' ' ); // 支持多个类名
			classes.forEach( function( className ) {
				if( !g.hasClass( elem, className ) ) {
					g.addClass( elem, className ); // 如果没有该类，则添加
				}
			});
		} else {
			elem.classList.add( className ); // 单个类名添加
		}
	}
};

// 移除类名
g.removeClass = function ( elem, className ) {
	if( className.indexOf( ' ' ) != -1 ) {
		classes = className.split( ' ' ); // 支持多个类名
		classes.forEach( function( className ) {
			if( g.hasClass( elem, className ) ) {
				g.removeClass( elem, className ); // 如果有该类，则移除
			}
		});
	} else {
		elem.classList.remove( className ); // 单个类名移除
	}
};

// 获取元素属性
g.attr = function( elem, attr ) {
	return elem.getAttribute( attr ); // 返回指定属性的值
};

/*==============================================================================

碰撞检测工具（Collision）

==============================================================================*/

// 计算两点之间的距离
g.distance = function( p1x, p1y, p2x, p2y ) {
	var dx = p1x - p2x,
		dy = p1y - p2y;
	return Math.sqrt( dx * dx + dy * dy ); // 返回距离
};

/*==============================================================================

格式化工具（Formatting）

==============================================================================*/

// 格式化数字，添加千分位逗号
g.formatCommas = function( n ) {
	n = Math.round( n ); // 先四舍五入
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 添加逗号
};

/*==============================================================================

其他工具（Miscellaneous）

==============================================================================*/

// 判断变量是否为字符串
g.isString = function( variable ) {
	return typeof variable === 'string';
};

// 判断变量是否为对象
g.isObject = function( variable ) {
	return typeof variable === 'object';
};

// 判断变量是否已定义
g.isSet = function( prop ) {
	return typeof prop != 'undefined';
};

// 判断对象是否为空
g.isObjEmpty = function( obj ) {
	for( var prop in obj ) {
		if( obj.hasOwnProperty( prop ) ) {
			return false; // 有属性则返回 false
		}
	}
	return true; // 没有属性则返回 true
};

// 合并两个对象
g.merge = function( obj1, obj2 ) {
	for( var prop in obj2 ) {
		obj1[ prop ] = obj2[ prop ]; // 将 obj2 的属性添加到 obj1
	}
};
