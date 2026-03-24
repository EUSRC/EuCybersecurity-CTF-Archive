/**
 * 工具函数集合
 */
const Utils = {
    /**
     * 计算两点之间的距离
     * @param {number} x1 - 第一个点的x坐标
     * @param {number} y1 - 第一个点的y坐标
     * @param {number} x2 - 第二个点的x坐标
     * @param {number} y2 - 第二个点的y坐标
     * @returns {number} - 两点之间的距离
     */
    distance: function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    /**
     * 计算从点(x1, y1)到点(x2, y2)的角度（弧度）
     * @param {number} x1 - 起始点的x坐标
     * @param {number} y1 - 起始点的y坐标
     * @param {number} x2 - 目标点的x坐标
     * @param {number} y2 - 目标点的y坐标
     * @returns {number} - 角度（弧度）
     */
    angle: function(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    /**
     * 将弧度转换为角度
     * @param {number} radians - 弧度值
     * @returns {number} - 角度值
     */
    radiansToDegrees: function(radians) {
        return radians * 180 / Math.PI;
    },
    
    /**
     * 将角度转换为弧度
     * @param {number} degrees - 角度值
     * @returns {number} - 弧度值
     */
    degreesToRadians: function(degrees) {
        return degrees * Math.PI / 180;
    },
    
    /**
     * 检查点是否在矩形内
     * @param {number} x - 点的x坐标
     * @param {number} y - 点的y坐标
     * @param {number} rectX - 矩形左上角的x坐标
     * @param {number} rectY - 矩形左上角的y坐标
     * @param {number} rectWidth - 矩形的宽度
     * @param {number} rectHeight - 矩形的高度
     * @returns {boolean} - 如果点在矩形内则返回true
     */
    pointInRect: function(x, y, rectX, rectY, rectWidth, rectHeight) {
        return x >= rectX && x <= rectX + rectWidth && 
               y >= rectY && y <= rectY + rectHeight;
    },
    
    /**
     * 生成指定范围内的随机整数
     * @param {number} min - 最小值（包含）
     * @param {number} max - 最大值（包含）
     * @returns {number} - 随机整数
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * 检查两个圆是否相交（碰撞检测）
     * @param {number} x1 - 第一个圆的中心x坐标
     * @param {number} y1 - 第一个圆的中心y坐标
     * @param {number} r1 - 第一个圆的半径
     * @param {number} x2 - 第二个圆的中心x坐标
     * @param {number} y2 - 第二个圆的中心y坐标
     * @param {number} r2 - 第二个圆的半径
     * @returns {boolean} - 如果两个圆相交则返回true
     */
    circlesIntersect: function(x1, y1, r1, x2, y2, r2) {
        return this.distance(x1, y1, x2, y2) <= r1 + r2;
    }
};