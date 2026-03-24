/**
 * 游戏地图类
 * 负责创建和管理游戏地图，包括地形、路径等
 */
class GameMap {
    /**
     * 创建游戏地图
     * @param {number} width - 地图宽度（格子数）
     * @param {number} height - 地图高度（格子数）
     * @param {number} tileSize - 每个格子的大小（像素）
     */
    constructor(width, height, tileSize) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.grid = [];
        this.path = [];
        this.startPoint = { x: 0, y: 0 };
        this.endPoint = { x: width - 1, y: Math.floor(height / 2) }; // 默认终点在右侧中间
        
        // 地形类型
        this.TILE_TYPES = {
            EMPTY: 0,   // 白色网格（默认不可放置塔）
            PATH: 1,    // 敌人行走的褐色路径
            BUILDABLE: 2, // 可建造塔的区域（路径附近）
            START: 3,   // 敌人起点
            END: 4      // 敌人终点
        };
        
        // 初始化地图格子
        this.initializeGrid();
        
        // 生成随机路径
        this.generateRandomPath();
    }
    
    /**
     * 初始化地图格子
     */
    initializeGrid() {
        // 创建空地图，默认为白色网格
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = this.TILE_TYPES.EMPTY;
            }
        }
    }
    
    /**
     * 设置地图格子的类型
     * @param {number} x - 格子的x坐标
     * @param {number} y - 格子的y坐标
     * @param {number} type - 格子类型
     */
    setTile(x, y, type) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x] = type;
            
            // 如果设置为起点或终点，更新相应的属性
            if (type === this.TILE_TYPES.START) {
                this.startPoint = { x, y };
            } else if (type === this.TILE_TYPES.END) {
                this.endPoint = { x, y };
            }
        }
    }
    
    /**
     * 获取指定位置的格子类型
     * @param {number} x - 格子的x坐标
     * @param {number} y - 格子的y坐标
     * @returns {number} - 格子类型
     */
    getTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.grid[y][x];
        }
        return -1; // 无效的格子
    }
    
    /**
     * 设置敌人行走路径
     * @param {Array} path - 路径点数组，每个点包含x和y坐标
     */
    setPath(path) {
        this.path = path;
        
        // 将路径上的所有格子设置为PATH类型
        for (const point of path) {
            if (point.x === this.startPoint.x && point.y === this.startPoint.y) {
                this.setTile(point.x, point.y, this.TILE_TYPES.START);
            } else if (point.x === this.endPoint.x && point.y === this.endPoint.y) {
                this.setTile(point.x, point.y, this.TILE_TYPES.END);
            } else {
                this.setTile(point.x, point.y, this.TILE_TYPES.PATH);
            }
        }
    }
    
    /**
     * 检查指定位置是否可以放置防御塔
     * @param {number} x - 格子的x坐标
     * @param {number} y - 格子的y坐标
     * @returns {boolean} - 如果可以放置则返回true
     */
    canPlaceTower(x, y) {
        const tileType = this.getTile(x, y);
        return tileType === this.TILE_TYPES.BUILDABLE;
    }
    
    /**
     * 生成从起点到终点的随机路径
     * 确保路径长度不小于地图总边长的一半
     * @returns {Array} - 生成的路径点数组
     */
    generateRandomPath() {
        // 清空当前地图，重置为白色网格
        this.initializeGrid();
        
        // 设置起点（左侧随机位置）
        const startY = Utils.randomInt(0, this.height - 1);
        this.startPoint = { x: 0, y: startY };
        this.setTile(0, startY, this.TILE_TYPES.START);
        
        // 设置终点（右侧随机位置）
        const endY = Utils.randomInt(0, this.height - 1);
        this.endPoint = { x: this.width - 1, y: endY };
        this.setTile(this.width - 1, endY, this.TILE_TYPES.END);
        
        // 计算最小路径长度（地图总边长的一半）
        const minPathLength = Math.floor((this.width + this.height) / 2);
        
        // 使用改进的随机行走算法生成路径
        const path = this.generatePathByRandomWalk(minPathLength);
        
        // 设置路径
        this.setPath(path);
        
        // 标记路径附近的可建造区域
        this.markBuildableAreas();
        
        return path;
    }
    
    /**
     * 使用随机行走算法生成从起点到终点的路径
     * @param {number} minLength - 路径的最小长度
     * @returns {Array} - 生成的路径点数组
     */
    generatePathByRandomWalk(minLength) {
        const path = [];
        const visited = {}; // 记录已访问的格子
        
        // 添加起点
        path.push({ x: this.startPoint.x, y: this.startPoint.y });
        visited[`${this.startPoint.x},${this.startPoint.y}`] = true;
        
        // 当前位置
        let currentX = this.startPoint.x;
        let currentY = this.startPoint.y;
        
        // 可能的移动方向：右、上、下（不包括左，以确保路径总体向右移动）
        const directions = [
            { dx: 1, dy: 0 },  // 右
            { dx: 0, dy: -1 }, // 上
            { dx: 0, dy: 1 }   // 下
        ];
        
        // 最大尝试次数，防止无限循环
        const maxAttempts = this.width * this.height * 2;
        let attempts = 0;
        
        // 生成路径，直到达到终点附近或达到最小长度
        while ((currentX < this.width - 2 || path.length < minLength) && path.length < this.width * this.height && attempts < maxAttempts) {
            attempts++;
            
            // 决定是随机移动还是向终点移动
            let dir;
            
            // 如果路径长度已达到最小要求，增加向终点方向移动的概率
            if (path.length >= minLength && Utils.randomInt(1, 10) <= 3) {
                // 计算到终点的方向
                const dx = this.endPoint.x - currentX;
                const dy = this.endPoint.y - currentY;
                
                // 选择向终点移动的方向
                if (Math.abs(dx) > Math.abs(dy) && dx > 0) {
                    dir = { dx: 1, dy: 0 }; // 向右移动
                } else if (dy > 0) {
                    dir = { dx: 0, dy: 1 }; // 向下移动
                } else if (dy < 0) {
                    dir = { dx: 0, dy: -1 }; // 向上移动
                } else {
                    // 随机选择一个方向
                    const dirIndex = Utils.randomInt(0, directions.length - 1);
                    dir = directions[dirIndex];
                }
            } else {
                // 随机选择一个方向
                const dirIndex = Utils.randomInt(0, directions.length - 1);
                dir = directions[dirIndex];
            }
            
            // 计算新位置
            const newX = currentX + dir.dx;
            const newY = currentY + dir.dy;
            
            // 检查新位置是否有效
            if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
                // 如果新位置未访问过，或者已经接近终点且路径长度已达到最小要求
                if (!visited[`${newX},${newY}`] || (newX >= this.width - 2 && path.length >= minLength)) {
                    // 添加到路径
                    path.push({ x: newX, y: newY });
                    visited[`${newX},${newY}`] = true;
                    
                    // 更新当前位置
                    currentX = newX;
                    currentY = newY;
                    
                    // 如果接近终点且路径长度已达到最小要求，尝试直接连接到终点
                    if (currentX >= this.width - 2 && path.length >= minLength) {
                        // 创建一条连接到终点的路径
                        this.connectToEndpoint(path, visited, currentX, currentY);
                        break;
                    }
                }
            }
        }
        
        // 如果路径没有正确到达终点，强制创建一条连接到终点的路径
        if (path[path.length - 1].x !== this.endPoint.x || path[path.length - 1].y !== this.endPoint.y) {
            this.connectToEndpoint(path, visited, currentX, currentY);
        }
        
        return path;
    }
    
    /**
     * 创建从当前位置到终点的连接路径
     * @param {Array} path - 当前路径
     * @param {Object} visited - 已访问的格子
     * @param {number} currentX - 当前X坐标
     * @param {number} currentY - 当前Y坐标
     */
    connectToEndpoint(path, visited, currentX, currentY) {
        // 如果当前位置已经是终点，直接返回
        if (currentX === this.endPoint.x && currentY === this.endPoint.y) {
            return;
        }
        
        // 创建一条从当前位置到终点的直接路径
        // 首先水平移动到终点的x坐标
        while (currentX < this.endPoint.x) {
            currentX++;
            if (!visited[`${currentX},${currentY}`]) {
                path.push({ x: currentX, y: currentY });
                visited[`${currentX},${currentY}`] = true;
            }
        }
        
        // 然后垂直移动到终点的y坐标
        while (currentY < this.endPoint.y) {
            currentY++;
            if (!visited[`${currentX},${currentY}`]) {
                path.push({ x: currentX, y: currentY });
                visited[`${currentX},${currentY}`] = true;
            }
        }
        
        while (currentY > this.endPoint.y) {
            currentY--;
            if (!visited[`${currentX},${currentY}`]) {
                path.push({ x: currentX, y: currentY });
                visited[`${currentX},${currentY}`] = true;
            }
        }
        
        // 确保终点被添加到路径中
        if (path[path.length - 1].x !== this.endPoint.x || path[path.length - 1].y !== this.endPoint.y) {
            path.push({ x: this.endPoint.x, y: this.endPoint.y });
        }
    }
    
    /**
     * 标记路径附近的可建造区域
     */
    markBuildableAreas() {
        // 遍历地图上的每个格子
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // 如果格子是空的（不是路径、起点或终点）
                if (this.grid[y][x] === this.TILE_TYPES.EMPTY) {
                    // 检查是否在路径附近（与路径格子相邻）
                    if (this.isNearPath(x, y)) {
                        this.setTile(x, y, this.TILE_TYPES.BUILDABLE);
                    }
                }
            }
        }
    }
    
    /**
     * 检查指定位置是否在路径附近
     * @param {number} x - 格子的x坐标
     * @param {number} y - 格子的y坐标
     * @returns {boolean} - 如果在路径附近则返回true
     */
    isNearPath(x, y) {
        // 检查周围8个方向的格子
        const directions = [
            { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
            { dx: -1, dy: 0 },                     { dx: 1, dy: 0 },
            { dx: -1, dy: 1 },  { dx: 0, dy: 1 },  { dx: 1, dy: 1 }
        ];
        
        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            
            // 检查相邻格子是否是路径、起点或终点
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                const tileType = this.grid[ny][nx];
                if (tileType === this.TILE_TYPES.PATH || 
                    tileType === this.TILE_TYPES.START || 
                    tileType === this.TILE_TYPES.END) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * 获取敌人行走路径的像素坐标
     * @returns {Array} - 路径点数组，每个点包含x和y像素坐标
     */
    getPathPixels() {
        return this.path.map(point => ({
            x: point.x * this.tileSize + this.tileSize / 2,
            y: point.y * this.tileSize + this.tileSize / 2
        }));
    }
    
    /**
     * 重置地图并生成新的随机路径
     * 在每波敌人开始前调用
     */
    resetMap() {
        // 清空当前地图
        this.initializeGrid();
        
        // 生成新的随机路径
        this.generateRandomPath();
    }
    
    /**
     * 绘制地图
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D上下文
     */
    draw(ctx) {
        // 绘制每个格子
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tileType = this.grid[y][x];
                const pixelX = x * this.tileSize;
                const pixelY = y * this.tileSize;
                
                // 根据格子类型设置颜色
                switch (tileType) {
                    case this.TILE_TYPES.EMPTY:
                        ctx.fillStyle = '#f5f5f5'; // 更浅的白色背景
                        break;
                    case this.TILE_TYPES.PATH:
                        ctx.fillStyle = '#e0d4b4'; // 更浅的褐色路径
                        break;
                    case this.TILE_TYPES.BUILDABLE:
                        ctx.fillStyle = '#e8f5e9'; // 更浅的绿色可建造区域
                        break;
                    case this.TILE_TYPES.START:
                        ctx.fillStyle = '#81c784'; // 更柔和的绿色起点
                        break;
                    case this.TILE_TYPES.END:
                        ctx.fillStyle = '#ef9a9a'; // 更柔和的红色终点
                        break;
                    default:
                        ctx.fillStyle = '#f5f5f5';
                }
                
                // 绘制格子
                ctx.fillRect(pixelX, pixelY, this.tileSize, this.tileSize);
                
                // 绘制格子边框
                ctx.strokeStyle = '#e0e0e0'; // 更浅的灰色边框
                ctx.lineWidth = 0.5;
                ctx.strokeRect(pixelX, pixelY, this.tileSize, this.tileSize);
            }
        }
    }
}