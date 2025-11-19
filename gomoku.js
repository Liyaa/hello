// 游戏配置
const BOARD_SIZE = 15;
const CELL_SIZE = 40;
const STONE_RADIUS = 15;
const BOARD_PADDING = 20;

// 游戏状态
let board = [];
let currentPlayer = 'black';
let gameOver = false;

// 获取DOM元素
const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

// 初始化游戏
function initGame() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    currentPlayer = 'black';
    gameOver = false;
    updateStatus('黑棋先手');
    drawBoard();
}

// 绘制棋盘
function drawBoard() {
    // 清空画布
    ctx.fillStyle = '#daa520';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格线
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    for (let i = 0; i < BOARD_SIZE; i++) {
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(BOARD_PADDING + i * CELL_SIZE, BOARD_PADDING);
        ctx.lineTo(BOARD_PADDING + i * CELL_SIZE, BOARD_PADDING + (BOARD_SIZE - 1) * CELL_SIZE);
        ctx.stroke();

        // 水平线
        ctx.beginPath();
        ctx.moveTo(BOARD_PADDING, BOARD_PADDING + i * CELL_SIZE);
        ctx.lineTo(BOARD_PADDING + (BOARD_SIZE - 1) * CELL_SIZE, BOARD_PADDING + i * CELL_SIZE);
        ctx.stroke();
    }

    // 绘制星位（5个关键点）
    const starPoints = [
        [3, 3], [3, 11], [7, 7], [11, 3], [11, 11]
    ];
    
    ctx.fillStyle = '#000';
    starPoints.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(BOARD_PADDING + x * CELL_SIZE, BOARD_PADDING + y * CELL_SIZE, 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    // 绘制已有的棋子
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j]) {
                drawStone(i, j, board[i][j]);
            }
        }
    }
}

// 绘制棋子
function drawStone(row, col, color) {
    const x = BOARD_PADDING + col * CELL_SIZE;
    const y = BOARD_PADDING + row * CELL_SIZE;

    // 绘制棋子阴影
    ctx.beginPath();
    ctx.arc(x + 2, y + 2, STONE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // 绘制棋子
    ctx.beginPath();
    ctx.arc(x, y, STONE_RADIUS, 0, 2 * Math.PI);
    
    if (color === 'black') {
        const gradient = ctx.createRadialGradient(x - 5, y - 5, 2, x, y, STONE_RADIUS);
        gradient.addColorStop(0, '#666');
        gradient.addColorStop(1, '#000');
        ctx.fillStyle = gradient;
    } else {
        const gradient = ctx.createRadialGradient(x - 5, y - 5, 2, x, y, STONE_RADIUS);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#ddd');
        ctx.fillStyle = gradient;
    }
    
    ctx.fill();
    ctx.strokeStyle = color === 'black' ? '#000' : '#999';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// 处理点击事件
canvas.addEventListener('click', (event) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 计算最近的交叉点
    const col = Math.round((x - BOARD_PADDING) / CELL_SIZE);
    const row = Math.round((y - BOARD_PADDING) / CELL_SIZE);

    // 检查是否在有效范围内
    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        if (board[row][col] === null) {
            makeMove(row, col);
        }
    }
});

// 落子
function makeMove(row, col) {
    board[row][col] = currentPlayer;
    drawStone(row, col, currentPlayer);

    if (checkWin(row, col)) {
        gameOver = true;
        const winner = currentPlayer === 'black' ? '黑棋' : '白棋';
        updateStatus(`${winner}获胜！🎉`);
        return;
    }

    // 检查是否平局
    if (isBoardFull()) {
        gameOver = true;
        updateStatus('平局！');
        return;
    }

    // 切换玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    updateStatus(currentPlayer === 'black' ? '黑棋回合' : '白棋回合');
}

// 检查胜利
function checkWin(row, col) {
    const directions = [
        [[0, 1], [0, -1]],   // 水平
        [[1, 0], [-1, 0]],   // 垂直
        [[1, 1], [-1, -1]],  // 主对角线
        [[1, -1], [-1, 1]]   // 副对角线
    ];

    for (const [dir1, dir2] of directions) {
        let count = 1;
        count += countStones(row, col, dir1[0], dir1[1]);
        count += countStones(row, col, dir2[0], dir2[1]);
        
        if (count >= 5) {
            return true;
        }
    }

    return false;
}

// 计算特定方向上相同颜色的棋子数
function countStones(row, col, dRow, dCol) {
    const color = board[row][col];
    let count = 0;
    let r = row + dRow;
    let c = col + dCol;

    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === color) {
        count++;
        r += dRow;
        c += dCol;
    }

    return count;
}

// 检查棋盘是否已满
function isBoardFull() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === null) {
                return false;
            }
        }
    }
    return true;
}

// 更新状态显示
function updateStatus(message) {
    statusElement.textContent = message;
}

// 重置按钮事件
resetBtn.addEventListener('click', initGame);

// 初始化游戏
initGame();
