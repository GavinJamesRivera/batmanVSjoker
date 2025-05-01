let score = 0;
let timeLeft = 30;
let gameActive = false;
let countdownInterval;
let highScoreBeaten = false;
let level = 1;
let lives = 3;

const scoreDisplay = document.getElementById("score");
const currentScoreDisplay = document.getElementById("currentScore");
const currentHighScoreDisplay = document.getElementById("currentHighScore");
const timerDisplay = document.getElementById("timer");
const levelDisplay = document.getElementById("levelDisplay");
const livesDisplay = document.getElementById("lives");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const pauseButton = document.getElementById("pauseButton");
const levelUpPopup = document.getElementById("levelUpPopup");

pauseButton.style.display = "none";

const highScoreDisplay = document.createElement("p");
gameOverScreen.appendChild(highScoreDisplay);

const congratsMessage = document.createElement("p");
congratsMessage.style.color = "gold";
congratsMessage.style.fontWeight = "bold";
gameOverScreen.appendChild(congratsMessage);

let highScore = localStorage.getItem("highScore") || 0;

const startScreen = document.getElementById("startScreen");
const startHighScore = document.getElementById("startHighScore");
startHighScore.textContent = `High Score: ${highScore}`;
startScreen.style.display = "flex";

const batman = document.getElementsByClassName("batman")[0];
let batmanTop = 100;
let batmanLeft = 100;
const batmanSpeed = 5;

batman.style.top = `${batmanTop}px`;
batman.style.left = `${batmanLeft}px`;

const keysPressed = {};

window.addEventListener("keydown", (e) => {
  keysPressed[e.code] = true;
});

window.addEventListener("keyup", (e) => {
  keysPressed[e.code] = false;
});

const joker = document.getElementsByClassName("joker")[0];
let jokerTop = 200;
let jokerLeft = 200;
let speedX = getRandomSpeed();
let speedY = getRandomSpeed();

const powerup = document.createElement("div");
powerup.classList.add("powerup");
powerup.style.display = "none";
document.body.appendChild(powerup);

const lifePowerup = document.createElement("div");
lifePowerup.classList.add("life-powerup");
lifePowerup.style.display = "none";
document.body.appendChild(lifePowerup);

let powerupTimer;
let spawnPowerupInterval;
let lifePowerupTimer;
let bombs = [];
let spawnBombInterval;

function getRandomSpeed() {
  let baseSpeed;
  if (level === 1) baseSpeed = 2;
  else if (level === 2) baseSpeed = 4;
  else baseSpeed = 6;

  let speed = 0;
  while (speed === 0) {
    speed = Math.floor(Math.random() * (baseSpeed * 2 + 1)) - baseSpeed;
  }
  return speed;
}

function updateScoreDisplay() {
  currentScoreDisplay.textContent = `Score: ${score}`;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    currentHighScoreDisplay.textContent = `High Score: ${highScore}`;
    if (!highScoreBeaten) {
      highScoreBeaten = true;
      congratsMessage.textContent = "New High Score!";
    }
  } else {
    currentHighScoreDisplay.textContent = `High Score: ${highScore}`;
  }

  const newLevel = Math.floor(score / 1500) + 1;
  if (newLevel !== level) {
    level = newLevel;
    levelDisplay.textContent = `Level: ${level}`;
    levelUpPopup.style.display = "block";
    setTimeout(() => {
      levelUpPopup.style.display = "none";
    }, 2000);
    speedX = getRandomSpeed();
    speedY = getRandomSpeed();
  }
}

function updateLivesDisplay() {
  livesDisplay.textContent = `Lives: ${lives}`;
}

function isColliding(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

function gameLoop() {
  if (!gameActive) return;

  const batmanWidth = batman.offsetWidth;
  const batmanHeight = batman.offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if ((keysPressed["ArrowRight"] || keysPressed["KeyD"]) && batmanLeft + batmanWidth + batmanSpeed <= windowWidth) batmanLeft += batmanSpeed;
  if ((keysPressed["ArrowLeft"] || keysPressed["KeyA"]) && batmanLeft - batmanSpeed >= 0) batmanLeft -= batmanSpeed;
  if ((keysPressed["ArrowUp"] || keysPressed["KeyW"]) && batmanTop - batmanSpeed >= 0) batmanTop -= batmanSpeed;
  if ((keysPressed["ArrowDown"] || keysPressed["KeyS"]) && batmanTop + batmanHeight + batmanSpeed <= windowHeight) batmanTop += batmanSpeed;

  batman.style.left = `${batmanLeft}px`;
  batman.style.top = `${batmanTop}px`;

  checkPowerupCollision();
  checkLifePowerupCollision();
  checkBombCollisions();

  requestAnimationFrame(gameLoop);
}

function moveJoker() {
  if (!gameActive) return;

  updateJokerDirectionIfNeeded();
  jokerLeft += speedX;
  jokerTop += speedY;
  joker.style.left = `${jokerLeft}px`;
  joker.style.top = `${jokerTop}px`;

  if (Math.random() < 0.02) {
    speedX = getRandomSpeed();
    speedY = getRandomSpeed();
  }

  if (isColliding(joker, batman)) {
    score += 100;
    updateScoreDisplay();
    const maxWidth = window.innerWidth - joker.offsetWidth;
    const maxHeight = window.innerHeight - joker.offsetHeight;
    jokerLeft = Math.floor(Math.random() * maxWidth);
    jokerTop = Math.floor(Math.random() * maxHeight);
    joker.style.left = `${jokerLeft}px`;
    joker.style.top = `${jokerTop}px`;
    speedX = getRandomSpeed();
    speedY = getRandomSpeed();
  }

  requestAnimationFrame(moveJoker);
}

function updateJokerDirectionIfNeeded() {
  const jokerWidth = joker.offsetWidth;
  const jokerHeight = joker.offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (jokerLeft <= 0 || jokerLeft + jokerWidth >= windowWidth) speedX = getRandomSpeed();
  if (jokerTop <= 0 || jokerTop + jokerHeight >= windowHeight) speedY = getRandomSpeed();

  jokerLeft = Math.max(0, Math.min(jokerLeft, windowWidth - jokerWidth));
  jokerTop = Math.max(0, Math.min(jokerTop, windowHeight - jokerHeight));
}

function spawnBomb() {
  if (!gameActive || level < 4) return;

  const bomb = document.createElement("div");
  bomb.classList.add("bomb");
  const x = jokerLeft;
  const y = jokerTop;
  bomb.style.left = `${x}px`;
  bomb.style.top = `${y}px`;
  document.body.appendChild(bomb);
  bombs.push(bomb);

  setTimeout(() => {
    if (bomb.parentElement) {
      bomb.remove();
      bombs = bombs.filter(b => b !== bomb);
    }
  }, 10000);
}

function checkBombCollisions() {
  bombs.forEach(bomb => {
    if (isColliding(bomb, batman)) {
      lives--;
      updateLivesDisplay();
      bomb.remove();
      bombs = bombs.filter(b => b !== bomb);
      if (lives <= 0) endGame("Batman ran out of lives!");
    }
  });
}

function spawnLifePowerup() {
  if (!gameActive) return;
  const x = Math.random() * (window.innerWidth - 50);
  const y = Math.random() * (window.innerHeight - 50);
  lifePowerup.style.left = `${x}px`;
  lifePowerup.style.top = `${y}px`;
  lifePowerup.style.display = "block";

  clearTimeout(lifePowerupTimer);
  lifePowerupTimer = setTimeout(() => {
    lifePowerup.style.display = "none";
  }, 10000);
}

function checkLifePowerupCollision() {
  if (lifePowerup.style.display === "none") return;
  if (isColliding(lifePowerup, batman)) {
    lives++;
    updateLivesDisplay();
    lifePowerup.style.display = "none";
  }
}

function spawnPowerup() {
  if (!gameActive) return;
  const x = Math.random() * (window.innerWidth - 50);
  const y = Math.random() * (window.innerHeight - 50);
  powerup.style.left = `${x}px`;
  powerup.style.top = `${y}px`;
  powerup.style.display = "block";

  clearTimeout(powerupTimer);
  powerupTimer = setTimeout(() => {
    powerup.style.display = "none";
  }, 5000);
}

function checkPowerupCollision() {
  if (powerup.style.display === "none") return;
  if (isColliding(powerup, batman)) {
    timeLeft += 15;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    powerup.style.display = "none";
  }
}

function startCountdown() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (!gameActive) {
      clearInterval(countdownInterval);
      return;
    }
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      endGame("Time's up!");
    }
  }, 1000);
}

function endGame(message = "Game Over") {
  gameActive = false;
  pauseButton.style.display = "none";
  finalScore.textContent = `${message} Your final score is: ${score}`;
  highScoreDisplay.textContent = `High Score: ${highScore}`;
  gameOverScreen.style.display = "block";
  clearInterval(spawnPowerupInterval);
  clearInterval(spawnBombInterval);
  powerup.style.display = "none";
  lifePowerup.style.display = "none";
  bombs.forEach(bomb => bomb.remove());
  bombs = [];
}

function resetGame() {
  score = 0;
  level = 1;
  timeLeft = 30;
  lives = 3;
  highScoreBeaten = false;
  congratsMessage.textContent = "";
  updateScoreDisplay();
  updateLivesDisplay();
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  levelDisplay.textContent = `Level: ${level}`;
  batmanTop = window.innerHeight / 2 - 75 / 2;
  batmanLeft = window.innerWidth / 2 - 75 / 2;
  batman.style.top = `${batmanTop}px`;
  batman.style.left = `${batmanLeft}px`;
  jokerTop = 200;
  jokerLeft = 200;
  speedX = getRandomSpeed();
  speedY = getRandomSpeed();
  joker.style.left = `${jokerLeft}px`;
  joker.style.top = `${jokerTop}px`;
  gameActive = true;
  gameLoop();
  moveJoker();
  startCountdown();
  spawnPowerupInterval = setInterval(spawnPowerup, 15000);
  spawnBombInterval = setInterval(spawnBomb, 4000);
  setInterval(() => {
    if (Math.random() < 0.4) spawnLifePowerup();
  }, 5000);
}

function startGame() {
  startScreen.style.display = "none";
  const countdownDisplay = document.getElementById("preGameCountdown");
  let countdown = 5;
  countdownDisplay.textContent = countdown;
  countdownDisplay.style.display = "block";
  pauseButton.style.display = "block";
  const countdownTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownDisplay.textContent = countdown;
    } else {
      clearInterval(countdownTimer);
      countdownDisplay.style.display = "none";
      resetGame();
    }
  }, 1000);
}

function restartGame() {
  gameOverScreen.style.display = "none";
  startGame();
}

function pauseGame() {
  if (!gameActive) return;
  gameActive = false;
  document.getElementById("pauseMenu").style.display = "block";
  pauseButton.style.display = "block";
}

function resumeGame() {
  if (gameActive) return;
  const countdownDisplay = document.getElementById("preGameCountdown");
  let countdown = 3;
  countdownDisplay.textContent = countdown;
  countdownDisplay.style.display = "block";
  document.getElementById("pauseMenu").style.display = "none";
  pauseButton.style.display = "block";
  const countdownTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownDisplay.textContent = countdown;
    } else {
      clearInterval(countdownTimer);
      countdownDisplay.style.display = "none";
      gameActive = true;
      gameLoop();
      moveJoker();
      startCountdown();
    }
  }, 1000);
}

function forceEndGame() {
  gameActive = false;
  document.getElementById("pauseMenu").style.display = "none";
  pauseButton.style.display = "none";
  endGame();
}

function showInstructions() {
  startScreen.style.display = "none";
  document.getElementById("instructionsMenu").style.display = "flex";
}

function backToMenu() {
  document.getElementById("instructionsMenu").style.display = "none";
  startScreen.style.display = "flex";
}

function returnToMainMenu() {
  gameOverScreen.style.display = "none";
  startScreen.style.display = "flex";
  score = 0;
  level = 1;
  timeLeft = 30;
  lives = 3;
  highScoreBeaten = false;
  congratsMessage.textContent = "";
  updateScoreDisplay();
  updateLivesDisplay();
  levelDisplay.textContent = `Level: ${level}`;
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
}
