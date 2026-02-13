let obstacles = [];
let lastScore = 0;

function inBounds(x, y) {
  const b = bounds();
  return x >= b.minX && y >= b.minY && x <= b.maxX && y <= b.maxY;
}

function spawnObstacle() {
  const b = bounds();
  for (let i = 0; i < 200; i++) {
    const x = b.minX + Math.floor(Math.random() * (b.maxX - b.minX + 1));
    const y = b.minY + Math.floor(Math.random() * (b.maxY - b.minY + 1));
    const hitSnake = snake.some(s => s.x === x && s.y === y);
    const hitFood = (food && food.x === x && food.y === y);
    const hitObs = obstacles.some(o => o.x === x && o.y === y);
    if (!hitSnake && !hitFood && !hitObs) {
      obstacles.push({ x, y });
      return;
    }
  }
}

function spawnObstacles(n) {
  for (let i = 0; i < n; i++) spawnObstacle();
}

const _obs_reset = reset;
reset = function () {
  _reset();
  obstacles = [];
  const s = (window.getDiffSettings && window.getDiffSettings()) || { obsStart: 15 };
  spawnObstacles(Math.max(s.obsStart, Math.floor(tiles * 0.5)));
};

const _obs_spawnFood = spawnFood;
spawnFood = function () {
  do { _obs_spawnFood() } while (obstacles.some(o => o.x === food.x && o.y === food.y));
};

const _obs_render = render;
render = function () {
  const s = (window.getDiffSettings && window.getDiffSettings()) || { obsPerScore: 1 };
  obstacles = obstacles.filter(o => inBounds(o.x, o.y));
  if (score !== lastScore) {
    for (let i = 0; i < (s.obsPerScore || 1); i++) spawnObstacle();
    lastScore = score;
  }
  _obs_render();

  ctx.fillStyle = "#666";
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    ctx.fillRect(o.x * size, o.y * size, size, size);
  }

  if (state === "playing") {
    const h = snake[0];
    const hit = obstacles.some(o => o.x === h.x && o.y === h.y);
    if (hit) {
      const ghost = (window.power && performance.now() < window.power.ghostUntil);
      if (ghost) {
      } else if (window.power && window.power.lives > 0) {
        window.power.lives -= 1;
      } else {
        state = "over";
      }
    }
  }

  if (obstacles.some(o => o.x === food.x && o.y === food.y)) spawnFood();
};
