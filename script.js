// DOM Elements
const holes = document.querySelectorAll(".hole");
const playerScoreBoard = document.getElementById("score");
const moles = document.querySelectorAll(".mole");
const startButton = document.getElementById("startButton");
const countdownOverlay = document.getElementById("countdownOverlay");
const gameScreen = document.getElementById("game");
const gameOverScreen = document.getElementById("game-over-screen");
const restartBtn = document.getElementById("restart-btn");
const hitSoundSkeleton = document.getElementById("hitSoundSkeleton");
const hitSoundZombie = document.getElementById("hitSoundZombie");
const countdownSound = document.getElementById("countdownSound");
const bgm = document.getElementById("bgm");
const gameOverSound = document.getElementById("gameOverSound");

// Audio settings
hitSoundSkeleton.volume = 0.5;
hitSoundZombie.volume = 0.5;
countdownSound.volume = 0.2;
gameOverSound.volume = 0.2;
bgm.volume = 0.02;

// Variables
let lastHole;
let timeUp = false;
let playerScore = 0;
let countdownIndex = 0;

// Countdown numbers
const countdownNumbers = ["3", "2", "1", " "];

// Auto-play BGM on page load
window.addEventListener("load", () => {
  bgm.loop = true; // Loop background music
  bgm.play().catch((error) => console.error("BGM playback failed: ", error));
});

// Event Listeners for Start Button
startButton.addEventListener("click", startCountdown);

// Start Countdown Function
function startCountdown() {
  countdownIndex = 0; // Reset countdown index
  document.getElementById("start-screen").style.display = "none"; // Hide start screen
  countdownOverlay.style.display = "flex"; // Show countdown overlay
  countdownSound.play();
  showCountdown(); // Start showing the countdown
}

// Show Countdown Function
function showCountdown() {
  if (countdownIndex < countdownNumbers.length) {
    countdownOverlay.innerText = countdownNumbers[countdownIndex];
    countdownOverlay.classList.add("countdown-show");
    countdownOverlay.classList.remove("countdown-hide");

    setTimeout(() => {
      countdownOverlay.classList.add("countdown-hide");
      countdownOverlay.classList.remove("countdown-show");
      countdownIndex++;
      setTimeout(showCountdown, 350); // Delay before showing the next number
    }, 500);
  } else {
    countdownOverlay.style.display = "none"; // Hide overlay after countdown finishes
    startGame(); // Start the game after countdown
  }
}

// Start Game Logic
function startGame() {
  playerScore = 0;
  playerScoreBoard.textContent = playerScore;
  timeUp = false;
  document.getElementById("game").style.display = "flex"; // Show game screen
  peep(); // Start mole popping up
  setTimeout(() => {
    timeUp = true;
    endGame(); // End game after 10 seconds
  }, 10000); // Game duration is 10 seconds
}

// Random time generator for mole popping up
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Random hole selection for moles
function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];

  if (hole === lastHole) {
    return randomHole(holes); // Avoid same hole twice
  }

  lastHole = hole;
  return hole;
}

// Peep function to pop up moles
function peep() {
  const time = randomTime(200, 1000); // Time mole stays up
  const hole = randomHole(holes); // Choose a random hole
  hole.classList.add("up"); // Mole pops up

  setTimeout(() => {
    hole.classList.remove("up"); // Mole goes down
    if (!timeUp) peep(); // Continue if time is not up
  }, time);
}

// Mole hit function (bonk)
function bonk(e) {
  if (!e.isTrusted) return; // Ignore fake clicks

  this.classList.add("hit"); // Add a 'hit' class for visual feedback
  setTimeout(() => this.classList.remove("hit"), 200); // Remove after 200ms

  // Determine which monster was hit and update score
  if (this.classList.contains("skeleton")) {
    playerScore++;
    playerScoreBoard.textContent = playerScore;
    hitSoundSkeleton.play(); // Play skeleton hit sound
  } else if (this.classList.contains("zombie")) {
    playerScore++;
    playerScoreBoard.textContent = playerScore;
    hitSoundZombie.play(); // Play zombie hit sound
  }

  this.classList.remove("up"); // Remove the mole from the hole
}

// End Game Function
function endGame() {
  gameScreen.style.display = "none"; // Hide game screen
  gameOverScreen.style.display = "flex"; // Show game over screen
  bgm.pause(); // Stop BGM
  bgm.currentTime = 0; // Reset background music

  // Display player score and high score
  const highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("final-score").textContent = playerScore;
  document.getElementById("highscore").textContent = highScore;

  if (playerScore > highScore) {
    localStorage.setItem("highScore", playerScore);
    document.getElementById("highscore").textContent = playerScore;
  }

  gameOverSound.play(); // Play game over sound
}

// Restart Button Function
restartBtn.addEventListener("click", () => {
  location.reload(); // Reload the game
});

// Event listeners for mole clicks (bonk)
moles.forEach((mole) => mole.addEventListener("click", bonk));
