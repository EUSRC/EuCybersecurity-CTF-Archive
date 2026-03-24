/*==============================================================================

塔的定义

==============================================================================*/

// 来源于 http://codepen.io/jackrugile/pen/tDJyv/

// 定义塔的数据
g.data.towers = {
	e: {
		type: 'e',                // 塔的类型
		counters: 'a',            // 克制的类型
		title: 'Earth',           // 塔的名称
		dmg: 'Medium',            // 伤害等级
		bonus: '+50% vs Air',     // 对空中单位的伤害加成
		rng: 'Medium',            // 攻击范围
		rte: 'Medium',            // 攻击速度
		stats: [                  // 塔的统计信息
			{cst: 200, dmg: 30, rng: 75, rte: 30},  // 升级1
			{cst: 250, dmg: 42, rng: 85, rte: 28},  // 升级2
			{cst: 313, dmg: 60, rng: 95, rte: 15}   // 升级3
		]
	},
	w: {
		type: 'w',
		counters: 'f',
		title: 'Water',
		dmg: 'Medium',
		bonus: '+50% vs Fire',
		rng: 'Low',
		rte: 'High',
		stats: [
			{cst: 300, dmg: 30, rng: 65, rte: 25},  // 升级1
			{cst: 375, dmg: 42, rng: 69, rte: 22},  // 升级2
			{cst: 469, dmg: 60, rng: 72, rte: 13}   // 升级3
		]
	},
	a: {
		type: 'a',
		counters: 'w',
		title: 'Air',
		dmg: 'Low',
		bonus: '+50% vs Water',
		rng: 'High',
		rte: 'Medium',
		stats: [
			{cst: 250, dmg: 20, rng: 85, rte: 30},  // 升级1
			{cst: 313, dmg: 24, rng: 102, rte: 28}, // 升级2
			{cst: 391, dmg: 28, rng: 121, rte: 20}  // 升级3
		]
	},
	f: {
		type: 'f',
		counters: 'e',
		title: 'Fire',
		dmg: 'High',
		bonus: '+50% vs Earth',
		rng: 'Medium',
		rte: 'Low',
		stats: [
			{cst: 250, dmg: 20, rng: 75, rte: 35},  // 升级1
			{cst: 313, dmg: 33, rng: 85, rte: 33},  // 升级2
			{cst: 391, dmg: 110, rng: 95, rte: 22}   // 升级3
		]
	}
};
