let score = 0;
let timeLeft = 30;
let gameActive = false;
let countdownInterval;
let highScoreBeaten = false;

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");

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

function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
}

function gameLoop() {
  if (!gameActive) return;

  const batmanWidth = batman.offsetWidth;
  const batmanHeight = batman.offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (keysPressed["ArrowRight"] && batmanLeft + batmanWidth + batmanSpeed <= windowWidth) {
    batmanLeft += batmanSpeed;
  }
  if (keysPressed["ArrowLeft"] && batmanLeft - batmanSpeed >= 0) {
    batmanLeft -= batmanSpeed;
  }
  if (keysPressed["ArrowUp"] && batmanTop - batmanSpeed >= 0) {
    batmanTop -= batmanSpeed;
  }
  if (keysPressed["ArrowDown"] && batmanTop + batmanHeight + batmanSpeed <= windowHeight) {
    batmanTop += batmanSpeed;
  }

  batman.style.left = `${batmanLeft}px`;
  batman.style.top = `${batmanTop}px`;

  requestAnimationFrame(gameLoop);
}

const joker = document.getElementsByClassName("joker")[0];
let jokerTop = 200;
let jokerLeft = 200;
let speedX = getRandomSpeed();
let speedY = getRandomSpeed();

function getRandomSpeed() {
  let speed = 0;
  while (speed === 0) {
    speed = Math.floor(Math.random() * 5) - 2;
  }
  return speed;
}

function updateJokerDirectionIfNeeded() {
  const jokerWidth = joker.offsetWidth;
  const jokerHeight = joker.offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (jokerLeft <= 0 || jokerLeft + jokerWidth >= windowWidth) {
    speedX = getRandomSpeed();
  }

  if (jokerTop <= 0 || jokerTop + jokerHeight >= windowHeight) {
    speedY = getRandomSpeed();
  }

  jokerLeft = Math.max(0, Math.min(jokerLeft, windowWidth - jokerWidth));
  jokerTop = Math.max(0, Math.min(jokerTop, windowHeight - jokerHeight));
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

    if (score > highScore && !highScoreBeaten) {
      highScoreBeaten = true;
      congratsMessage.textContent = "New High Score!";
    }

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

function isColliding(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function startCountdown() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;

  countdownInterval = setInterval(() => {
    if (!gameActive) {
      clearInterval(countdownInterval);
      return;
    }

    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
}

function endGame() {
  gameActive = false;

  finalScore.textContent = `Your final score is: ${score}`;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  highScoreDisplay.textContent = `High Score: ${highScore}`;
  gameOverScreen.style.display = "block";
}

function restartGame() {
  gameOverScreen.style.display = "none";

  const countdownDisplay = document.getElementById("preGameCountdown");
  let countdown = 5;
  countdownDisplay.textContent = countdown;
  countdownDisplay.style.display = "block";

  const countdownTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownDisplay.textContent = countdown;
    } else {
      clearInterval(countdownTimer);
      countdownDisplay.style.display = "none";

      score = 0;
      timeLeft = 30;
      gameActive = true;
      highScoreBeaten = false;
      congratsMessage.textContent = "";

      updateScoreDisplay();
      timerDisplay.textContent = `Time Left: ${timeLeft}s`;

      batmanTop = window.innerHeight / 2 - batman.offsetHeight / 2;
      batmanLeft = window.innerWidth / 2 - batman.offsetWidth / 2;
      batman.style.top = `${batmanTop}px`;
      batman.style.left = `${batmanLeft}px`;

      jokerTop = 200;
      jokerLeft = 200;
      speedX = getRandomSpeed();
      speedY = getRandomSpeed();
      joker.style.left = `${jokerLeft}px`;
      joker.style.top = `${jokerTop}px`;

      gameLoop();
      moveJoker();
      startCountdown();
      setTimeout(endGame, 30000);
    }
  }, 1000);
}

function startGame() {
  startScreen.style.display = "none";

  const countdownDisplay = document.getElementById("preGameCountdown");
  let countdown = 5;
  countdownDisplay.textContent = countdown;
  countdownDisplay.style.display = "block";

  const countdownTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownDisplay.textContent = countdown;
    } else {
      clearInterval(countdownTimer);
      countdownDisplay.style.display = "none";

      gameActive = true;
      score = 0;
      timeLeft = 30;
      highScoreBeaten = false;
      congratsMessage.textContent = "";

      updateScoreDisplay();
      timerDisplay.textContent = `Time Left: ${timeLeft}s`;

      batmanTop = window.innerHeight / 2 - batman.offsetHeight / 2;
      batmanLeft = window.innerWidth / 2 - batman.offsetWidth / 2;
      batman.style.top = `${batmanTop}px`;
      batman.style.left = `${batmanLeft}px`;

      jokerTop = 200;
      jokerLeft = 200;
      speedX = getRandomSpeed();
      speedY = getRandomSpeed();
      joker.style.left = `${jokerLeft}px`;
      joker.style.top = `${jokerTop}px`;

      gameLoop();
      moveJoker();
      startCountdown();
      setTimeout(endGame, 30000);
    }
  }, 1000);
}
