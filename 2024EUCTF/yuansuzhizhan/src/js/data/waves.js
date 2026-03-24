/*==============================================================================

敌人波次生成器（随机敌人类型，简单版）

==============================================================================*/

// 定义敌人波次数据数组
g.data.waves = [];

// 定义元素类型
const elements = ['e', 'w', 'a', 'f'];

// 定义关卡数量
const totalWaves = 200;

// 生成敌人波次
for (let i = 1; i <= totalWaves; i++) {
    let wave = [];
    
    // 敌人数量逐渐增加，每波增加1个敌人
    let enemiesCount = Math.floor(i / 5) + 1; // 每 5 波增加 1 个敌人

    // 每 10 波生成一个 Boss
    if (i % 10 === 0) {
        // Boss 敌人类型和数量
        wave.push(`${elements[i % 4]} 1 1`); // Boss: 强力敌人
    }

    // 随机选择 1 到 3 种敌人类型
    let elementCount = Math.floor(Math.random() * 3) + 1; // 1 到 3 种敌人
    for (let j = 0; j < elementCount; j++) {
        let element = elements[Math.floor(Math.random() * elements.length)]; // 随机选择元素类型
        wave.push(`${element} ${enemiesCount}`); // 添加敌人到波次
    }

    // 将生成的波次添加到数据数组中
    g.data.waves.push(wave);
}

// 输出生成的波次数据
console.log(g.data.waves);
