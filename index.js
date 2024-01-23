const primaryColor = 'rgb(28, 118, 244)';

let canvas = document.getElementById('game'),
  ctx = canvas.getContext('2d'),
  ballRadius = 8,

  // Начальное положение шара
  x = canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3),
  y = canvas.height - 40,
  dx = 2,
  dy = -2;

// Ширина и высота платформы 
let paddleHeight = 12,
  paddleWidth = 72;

let paddleX = (canvas.width - paddleWidth) / 2; // Начальное положение платформы

let rowCount = 5, // Количество строк блоков
  columnCount = 9, // Количество колонок блоков
  brickWidth = 54, // Ширина блока
  brickHeight = 18, // Высота блока
  brickPadding = 12, // Расстояние между блоками
  topOffset = 40, // Отступ сверху
  leftOffset = 33, // Отступ слева
  score = 0; // НАчальный результат

// Массив блоков
let bricks = [];
for (let c = 0; c < columnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < rowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // Статус 1 - блок видим и по нему не попал. Статус 0 - прячем
  }
}

document.addEventListener("mousemove", mouseMoveHandler, false);

// Двигаем платформу вслед за мышкой
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// Рисуем платформу, которая отбивает шар
function drawPaddle() {
  ctx.beginPath();
  ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, 30);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

// Рисуем шар 
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = primaryColor;
  ctx.fill();
  ctx.closePath();
}

// Рисуем блоки, в которые должен попадать шар
function drawBricks() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = (c * (brickWidth + brickPadding)) + leftOffset;
        let brickY = (r * (brickHeight + brickPadding)) + topOffset;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 30);
        ctx.fillStyle = primaryColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Тут отслеживаем наш текущий результат
function trackScore() {
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = primaryColor;
  ctx.fillText('Score : ' + score, 8, 24);
}

// Функция для отлавливания попадания по блоку
function hitDetection() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === rowCount * columnCount) {
            alert('Вы выиграли!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Стартовая функция инициализации
function init() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  trackScore();
  drawBricks();
  drawBall();
  drawPaddle();
  hitDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  }
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } 
    else {
      alert('Вы проиграли!');
      document.location.reload();
    }
  }

  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }

  x += dx;
  y += dy;
}

setInterval(init, 8);