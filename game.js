const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const statusEl = document.getElementById("status");

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;
const MOVE_INTERVAL_MS = 100;

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

let snake, direction, nextDirection, food, score, highScore, running, paused, gameOver, lastTick;

function init() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  nextDirection = { x: 0, y: 0 };
  score = 0;
  running = true;
  paused = false;
  gameOver = false;
  lastTick = 0;
  highScore = Number(localStorage.getItem("snakeHighScore") || 0);
  statusEl.textContent = "";
  placeFood();
  updateScore();
  requestAnimationFrame(loop);
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT),
    };
  } while (snake.some((seg) => seg.x === food.x && seg.y === food.y));
}

function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
  highScoreEl.textContent = `Best: ${highScore}`;
}

function loop(timestamp) {
  if (!running) return;
  requestAnimationFrame(loop);
  if (paused || gameOver) return;

  if (timestamp - lastTick < MOVE_INTERVAL_MS) return;
  lastTick = timestamp;

  direction = nextDirection;
  if (direction.x === 0 && direction.y === 0) {
    draw();
    return;
  }

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (
    head.x < 0 ||
    head.x >= TILE_COUNT ||
    head.y < 0 ||
    head.y >= TILE_COUNT ||
    snake.some((seg) => seg.x === head.x && seg.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function endGame() {
  gameOver = true;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", String(highScore));
    updateScore();
  }
  statusEl.textContent = "Game Over — press Space or Enter to restart";
}

function draw() {
  ctx.fillStyle = "#14151a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? "#7bd88f" : "#4fae67";
    ctx.fillRect(seg.x * GRID_SIZE, seg.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
  });
}

function handleKey(e) {
  if (gameOver && (e.key === " " || e.key === "Enter")) {
    init();
    return;
  }

  if (e.key === " ") {
    paused = !paused;
    statusEl.textContent = paused ? "Paused" : "";
    return;
  }

  const dir = DIRECTIONS[e.key];
  if (!dir) return;

  const isReversal =
    snake.length > 1 && dir.x === -direction.x && dir.y === -direction.y;
  if (!isReversal) {
    nextDirection = dir;
  }
}

document.addEventListener("keydown", handleKey);

init();
