const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const batman = {
    x: 100,
    y: 100,
    width: 50,
    height: 70,
    speed: 5,
    dx: 0,
    dy: 0,
    color: "black",
};

const joker = {
    x: 600,
    y: 100,
    width: 50,
    height: 70,
    speed: 3,
    dx: 0,
    dy: 0,
    color: "green",
};

let score = 0;
let timeLeft = 30;
let gameOver = false;
let gamePaused = false;
let gameInterval;
let timerInterval;

// Event listeners for controlling Batman
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key == "ArrowLeft" || e.key == "a") {
        batman.dx = -batman.speed;
    } else if (e.key == "ArrowRight" || e.key == "d") {
        batman.dx = batman.speed;
    } else if (e.key == "ArrowUp" || e.key == "w") {
        batman.dy = -batman.speed;
    } else if (e.key == "ArrowDown" || e.key == "s") {
        batman.dy = batman.speed;
    }
}

function keyUpHandler(e) {
    if (e.key == "ArrowLeft" || e.key == "a" || e.key == "ArrowRight" || e.key == "d") {
        batman.dx = 0;
    }
    if (e.key == "ArrowUp" || e.key == "w" || e.key == "ArrowDown" || e.key == "s") {
        batman.dy = 0;
    }
}

// Draw Batman and Joker
function drawCharacter(character) {
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

// Move Batman based on keyboard input
function moveBatman() {
    batman.x += batman.dx;
    batman.y += batman.dy;

    // Keep Batman within canvas bounds
    if (batman.x < 0) batman.x = 0;
    if (batman.x + batman.width > canvas.width) batman.x = canvas.width - batman.width;
    if (batman.y < 0) batman.y = 0;
    if (batman.y + batman.height > canvas.height) batman.y = canvas.height - batman.height;
}

// Joker AI (moves randomly within canvas)
function moveJoker() {
    joker.x += joker.dx;
    joker.y += joker.dy;

    // Joker randomly changes direction (simple AI)
    if (Math.random() < 0.02) joker.dx = (Math.random() < 0.5 ? 1 : -1) * joker.speed;
    if (Math.random() < 0.02) joker.dy = (Math.random() < 0.5 ? 1 : -1) * joker.speed;

    // Keep Joker within canvas bounds
    if (joker.x < 0) joker.x = 0;
    if (joker.x + joker.width > canvas.width) joker.x = canvas.width - joker.width;
    if (joker.y < 0) joker.y = 0;
    if (joker.y + joker.height > canvas.height) joker.y = canvas.height - joker.height;
}

// Collision detection
function checkCollision() {
    if (batman.x < joker.x + joker.width &&
        batman.x + batman.width > joker.x &&
        batman.y < joker.y + joker.height &&
        batman.y + batman.height > joker.y) {
        captureJoker();
    }
}

// Capture Joker
function captureJoker() {
    score += 100;
    joker.x = Math.random() * (canvas.width - joker.width);
    joker.y = Math.random() * (canvas.height - joker.height);
    document.getElementById("score").textContent = "Score: " + score;
}

// Timer countdown
function updateTimer() {
    if (!gameOver) {
        timeLeft -= 1;
        if (timeLeft <= 0) {
            gameOver = true;
            document.getElementById("message").textContent = "Game Over!";
            clearInterval(gameInterval);
            clearInterval(timerInterval);
        }
        document.getElementById("time").textContent = "Time: " + timeLeft;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveBatman();
    moveJoker();
    checkCollision();

    drawCharacter(batman);
    drawCharacter(joker);
}

// Start the game
function startGame() {
    score = 0;
    timeLeft = 30;
    gameOver = false;

    joker.x = Math.random() * (canvas.width - joker.width);
    joker.y = Math.random() * (canvas.height - joker.height);
    joker.dx = (Math.random() < 0.5 ? 1 : -1) * joker.speed;
    joker.dy = (Math.random() < 0.5 ? 1 : -1) * joker.speed;

    document.getElementById("message").textContent = "Chase the Joker!";
    document.getElementById("score").textContent = "Score: " + score;
    document.getElementById("time").textContent = "Time: " + timeLeft;

    clearInterval(gameInterval);
    clearInterval(timerInterval);

    gameInterval = setInterval(gameLoop, 1000 / 60);
    timerInterval = setInterval(updateTimer, 1000);
}

// Start the game on page load
startGame();
