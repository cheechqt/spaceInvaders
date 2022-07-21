const grid = document.querySelector(".grid");
const squares = [];
const gridWidth = 20;
const result = document.querySelector(".result")
const deadInvaders = []

let currentUserIndex = 670;
let direction = 1;
let moveToRight = true;
let invadersTimer;



for (let i = 0; i < 700; i++) {
  const square = document.createElement("div");
  square.classList.add("square");
  grid.append(square)
  squares.push(square)
}
 
const LevelOne = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  40, 41, 42, 43, 44, 45, 46, 47, 48, 49
]

let invaders = getCurrentLevel(LevelOne)

function getCurrentLevel(array) {
  return JSON.parse(JSON.stringify(array))
}

function addInvaders() {
  for (let i = 0; i < invaders.length; i++) {
    if (!deadInvaders.includes(i)) {
      squares[invaders[i]].classList.add("invader");
    }
  }
}

addInvaders();

function removeInvaders() {
  for (let i = 0; i < invaders.length; i++) {
    squares[invaders[i]].classList.remove("invader");
  }
}


//addUser
squares[currentUserIndex].classList.add("user")


function moveUser(event) {
  squares[currentUserIndex].classList.remove("user")
  switch (event.key) {
    case "ArrowLeft":
      if (currentUserIndex % gridWidth != 0) {
        currentUserIndex -= 1;
      }
      break;
    case "ArrowRight":
      if (currentUserIndex % gridWidth < gridWidth - 1) {
        currentUserIndex += 1;
      }
      break;
  }
  squares[currentUserIndex].classList.add("user")
}

document.addEventListener("keydown", moveUser);

function moveInvaders() {
  const maxLeft = invaders[0] % gridWidth == 0;
  const maxRight = invaders[invaders.length - 1] % gridWidth == gridWidth - 1;

  removeInvaders();

  if (maxRight && moveToRight) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += gridWidth + 1;
      direction = -1;
      moveToRight = false
    }
  }

  if (maxLeft && !moveToRight) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += gridWidth - 1;
      direction = 1;
      moveToRight = true
    }
  }

  for (let i = 0; i < invaders.length; i++) {
    invaders[i] += direction;
  }

  addInvaders()

  if (squares[currentUserIndex].classList.contains("invader", "user")) {
    result.innerText = "GAME OVER"
    clearInterval(invadersTimer)
  }

  if (deadInvaders.length == invaders.length) {
    result.innerText = "U WINNN"
    clearInterval(invadersTimer)
  }
}

invadersTimer = setInterval(() => (moveInvaders(invaders)), 500)

function shooting(event) {
  let shootingTimer;
  let currentShotIndex = currentUserIndex;

  function moveShot() {

    squares[currentShotIndex].classList.remove("shot");
    currentShotIndex -= gridWidth;
    squares[currentShotIndex].classList.add("shot");

    if (currentShotIndex < gridWidth + 1) {
      squares[currentShotIndex].classList.remove("shot");
      clearInterval(shootingTimer)
    }

    if (squares[currentShotIndex].classList.contains("invader")) {
      squares[currentShotIndex].classList.remove("shot");
      squares[currentShotIndex].classList.remove("invader");
      squares[currentShotIndex].classList.add("explosion");

      setTimeout(() => squares[currentShotIndex].classList.remove("explosion"), 300);
      clearInterval(shootingTimer)

      deadInvaders.push(invaders.indexOf(currentShotIndex))
    }
  }
  //space event.key == single space lol 
  if (event.key == " ") {
    shootingTimer = setInterval(moveShot, 100)
  }
}

document.addEventListener("keydown", shooting)




