// Canvasの設定--------------------------------------------
const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");

// マス目を描画---------------------------------------------
function cells() {
    for (let i = 1; i < 10; i++) {
        context.strokeStyle = "gray";
        context.beginPath();
        context.moveTo(40, i * 40);
        context.lineTo(360, i * 40);
        context.moveTo(i * 40, 40);
        context.lineTo(i * 40, 360);
        context.closePath();
        context.stroke();
    }
};

// 初期位置設定---------------------------------------------
var player = [5, 9];
var computer = [5, 1];
let isGameOver = false;
let isStarted = false;

// 円を描画--------------------------------------------------------------
function drawCircle(x, y, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x * 40, y * 40, 10, Math.PI * 2, false);
    context.fill();
}

// 初期位置描画----------------------------------------------------
function drawInitialPosition() {
    cells();
    drawCircle(player[0], player[1], "blue");
    drawCircle(computer[0], computer[1], "red");
    drawText();

}

// テキストを描画する関数----------------------------------------
function drawText() {
    context.fillStyle = "black";
    context.font = "24px"; // フォントサイズを指定

    const youText = "You";
    const enemyText = "Enemy";

    const youTextWidth = context.measureText(youText).width;
    const enemyTextWidth = context.measureText(enemyText).width;

    // テキストの中央揃え位置を計算
    context.fillText(youText, (player[0] * 40) - (youTextWidth / 2), player[1] * 40 + 25); // プレイヤーの下
    context.fillText(enemyText, (computer[0] * 40) - (enemyTextWidth / 2), computer[1] * 40 - 20); // コンピュータの上
}

// 画面全体を再描画する関数-------------------------------------
function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    cells(); // グリッドを再描画
    drawCircle(player[0], player[1], "blue"); // プレイヤーを再描画
    drawCircle(computer[0], computer[1], "red"); // コンピュータを再描画
    if (!isStarted) {
        drawText(); // ゲームが始まっていなければテキストを描画
    }
}

// player位置描画----------------------------------------------------------
function p_position() {
    redraw();
}

// Player移動後の勝敗判定関数＆その後のCom移動と勝敗判定関数-------------
function player_winlose() {
    if (JSON.stringify(player) === JSON.stringify(computer)) {
        screen_lock_win();
        isGameOver = true;
    } else {
        com_action();
        com_winlose();
    }
}

// Computer移動後の勝敗判定関数---------------------------
function com_winlose() {
    if (JSON.stringify(player) === JSON.stringify(computer)) {
        screen_lock_lose();
        isGameOver = true;
    }
}

// Computerの移動処理関数-----------------------------------------
function com_action() {
    let com_direction = Math.floor(Math.random() * 2);
    let com_move = Math.floor(Math.random() * 2);
    if (com_direction === 0) {
        if (com_move === 0) {
            computer[0] = Math.max(computer[0] - 1, 1);
        } else {
            computer[0] = Math.min(computer[0] + 1, 9);
        }
    } else {
        if (com_move === 1) {
            computer[1] = Math.max(computer[1] - 1, 1);
        } else {
            computer[1] = Math.min(computer[1] + 1, 9);
        }
    }
    redraw(); // 再描画
}

// プレイヤーの移動処理
function movePlayer(direction) {
    switch (direction) {
        case "up":
            player[1] = Math.max(player[1] - 1, 1);
            break;
        case "down":
            player[1] = Math.min(player[1] + 1, 9);
            break;
        case "left":
            player[0] = Math.max(player[0] - 1, 1);
            break;
        case "right":
            player[0] = Math.min(player[0] + 1, 9);
            break;
    }
    p_position();
    player_winlose();
}


// キーボード操作設定
document.addEventListener("keydown", function (event) {
    if (isGameOver) return;
    if (!isStarted) {
        isStarted = true; // ゲームを開始
        redraw(); // テキストを消す
    }
    switch (event.key) {
        case "ArrowUp":
            movePlayer("up");
            break;
        case "ArrowDown":
            movePlayer("down");
            break;
        case "ArrowLeft":
            movePlayer("left");
            break;
        case "ArrowRight":
            movePlayer("right");
            break;
    }
});


// ボタンのクリックイベントを設定
document.getElementById("upBtn").addEventListener("click", function () {
    if (!isStarted) {
        isStarted = true;
        redraw();
    }
    movePlayer("up");
});
document.getElementById("downBtn").addEventListener("click", function () {
    if (!isStarted) {
        isStarted = true;
        redraw();
    }
    movePlayer("down");
});
document.getElementById("leftBtn").addEventListener("click", function () {
    if (!isStarted) {
        isStarted = true;
        redraw();
    }
    movePlayer("left");
});
document.getElementById("rightBtn").addEventListener("click", function () {
    if (!isStarted) {
        isStarted = true;
        redraw();
    }
    movePlayer("right");
});


// 終了時のスクリーンロック関数(win)
function screen_lock_win() {
    let lock_screen = createLockScreen("You win!!", "rgba(0,0,255,0.5)");
    document.body.appendChild(lock_screen);
}

// 終了時のスクリーンロック関数(lose)
function screen_lock_lose() {
    let lock_screen = createLockScreen("You lose!!", "rgba(255,0,0,0.5)");
    document.body.appendChild(lock_screen);
}

// スクリーンロックの生成
function createLockScreen(messageText, bgColor) {
    let lock_screen = document.createElement('div');
    lock_screen.id = "screenLock";
    lock_screen.style.height = '100%';
    lock_screen.style.left = '0px';
    lock_screen.style.position = 'fixed';
    lock_screen.style.top = '0px';
    lock_screen.style.width = '100%';
    lock_screen.style.zIndex = '9999';
    lock_screen.style.opacity = '0.8';
    lock_screen.style.backgroundColor = "rgba(0,0,0,0.5)";

    let message = document.createElement('div');
    message.textContent = messageText;
    message.style.color = 'white';
    message.style.fontSize = '48px';
    message.style.position = 'absolute';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.whiteSpace = "nowrap";
    message.style.backgroundColor = bgColor;

    lock_screen.appendChild(message);
    return lock_screen;
}

// 初期位置描画
drawInitialPosition();
