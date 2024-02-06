const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.style.background = "#111";

const keyPressed = [];

window.addEventListener("keydown", (e) => {
    keyPressed[e.code] = true;
});

window.addEventListener("keyup", (e) => {
    keyPressed[e.code] = false;
});

// window.addEventListener("resize", () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// });

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Ball {

    constructor(position, velocity, radius, color) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Paddle {
    constructor(position, velocity, width, height, color) {
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.color = color;
        this.score = 0;
    }
    update() {
        if (keyPressed["ArrowUp"]) {
            this.position.y -= this.velocity.y;
        }
        if (keyPressed["ArrowDown"]) {
            this.position.y += this.velocity.y;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    getCenter() {
        return new Vec2(
            this.position.x + (this.width / 2),
            this.position.y + (this.height / 2));
    }
}

const ball = new Ball(new Vec2(200, 200), new Vec2(10, 10), 20, "#800080");
const paddle1 = new Paddle(new Vec2(20, canvas.height / 2 - 80), new Vec2(15, 15), 20, 160, "#ff0000");
const paddle2 = new Paddle(new Vec2(canvas.width - 40, canvas.height / 2 - 80), new Vec2(15, 15), 20, 160, "#0000ff");
function ballCollisionWithEdges(ball) {

    let nextY = ball.position.y + ball.radius;

    if (nextY >= canvas.height || nextY <= 0) {
        ball.velocity.y *= -1;
    }
}

function paddleCollisionWithEdges(paddle) {
    if (paddle.position.y <= 0) {
        paddle.position.y = 0;
    }
    if (paddle.position.y + paddle.height > canvas.height)
        paddle.position.y = canvas.height - paddle.height;
}
function ballPaddleCollision(ball, paddle) {
    let dx = Math.abs(ball.position.x - paddle.getCenter().x);
    let dy = Math.abs(ball.position.y - paddle.getCenter().y);

    if (dx <= (ball.radius + paddle.width / 2) && dy <= (paddle.height / 2 + ball.radius)) {
        ball.velocity.x *= -1;
    }
}
// function playerAI(ball, paddle) {
//     if (ball.velocity.x > 0) {
//         if (ball.position.y > paddle.position.y) {
//             paddle.position.y += paddle.velocity.y;
//             if (paddle.position.y + paddle.height > canvas.height) {
//                 paddle.position.y = canvas.height - paddle.height;
//             }
//         }
//         if (ball.position.y < paddle.position.y) {
//             paddle.position.y -= paddle.velocity.y;
//             if (paddle.position.y <= 0) {
//                 paddle.position.y = 0;
//             }
//         }
//     }
// }

function playerAI(ball, paddle) {
    if (ball.velocity.x > 0 && ball.position.x > canvas.width / 2) {
        
        const randomOffset = Math.random() * 50 - 25;

        if (ball.position.y > paddle.position.y) {
            paddle.position.y += paddle.velocity.y + randomOffset;
            if (paddle.position.y + paddle.height > canvas.height) {
                paddle.position.y = canvas.height - paddle.height;
            }
        }
        if (ball.position.y < paddle.position.y) {
            paddle.position.y -= paddle.velocity.y + randomOffset;
            if (paddle.position.y <= 0) {
                paddle.position.y = 0;
            }
        }
    }
}
function resetGame(ball, paddle1, paddle2) {
    ball.position.x = canvas.width / 2;
    ball.position.y = canvas.height / 2;
    ball.velocity.x *= Math.random() > 0.5 ? 1 : -1;
    ball.velocity.y *= Math.random() > 0.5 ? 1 : -1;
    paddle1.position.y = canvas.height / 2 - 80;
    paddle2.position.y = canvas.height / 2 - 80;
}

const player1Score = document.getElementById("player1Score");
const player2Score = document.getElementById("player2Score");

function updateScore(ball, paddle1, paddle2) {
    if (ball.position.x <= ball.radius) {
        paddle2.score++;
        player2Score.innerText = paddle2.score;
        resetGame(ball, paddle1, paddle2);
    }
    if (ball.position.x >= canvas.width - ball.radius) {
        paddle1.score++;
        player1Score.innerText = paddle1.score;
        resetGame(ball, paddle1, paddle2);
    }
}
function drawGameScene() {
    ctx.strokeStyle = "#fff";

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.lineWidth = 5;
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.lineWidth = 5;
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.setLineDash([20, 20]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

function gameUpdate() {
    ball.update();
    paddle1.update();
    paddleCollisionWithEdges(paddle1);
    ballCollisionWithEdges(ball);
    playerAI(ball, paddle2);
    updateScore(ball, paddle1, paddle2);
    ballPaddleCollision(ball, paddle1);
    ballPaddleCollision(ball, paddle2);
}

function gameDraw() {
    ball.draw();
    paddle1.draw();
    paddle2.draw();
    drawGameScene();
}

function gameLoop() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(gameLoop);

    gameUpdate();
    gameDraw();
}
gameLoop();