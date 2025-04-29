const words = [
  "velocity", "quantum", "glitch", "cyberspace", "neon", "hologram",
  "interface", "protocol", "spectrum", "matrix", "network", "fusion",
  "android", "transmit", "encrypt", "datastream", "synth", "reboot"
];

const sentences = [
  "The future is now, embrace the digital revolution",
  "Technology evolves at an exponential rate",
  "Artificial intelligence is changing our world",
  "Virtual reality creates new dimensions of experience",
  "Blockchain technology is revolutionizing finance",
  "Quantum computing will solve complex problems",
  "Cybersecurity is essential in the digital age",
  "The internet of things connects everything",
  "Machine learning powers intelligent systems",
  "Augmented reality enhances our perception"
];

// DOM Elements
const wordDisplay = document.getElementById("word");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");

// Menu Elements
const mainMenu = document.getElementById("mainMenu");
const gameModeMenu = document.getElementById("gameModeMenu");
const optionMenu = document.getElementById("optionMenu");
const leaderboardMenu = document.getElementById("leaderboardMenu");
const game = document.getElementById("game");

// Buttons
const startBtn = document.getElementById("startBtn");
const optionBtn = document.getElementById("optionBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const wordModeBtn = document.getElementById("wordMode");
const sentenceModeBtn = document.getElementById("sentenceMode");
const backToMain = document.getElementById("backToMain");
const backToMainFromOption = document.getElementById("backToMainFromOption");
const backToMainFromLeaderboard = document.getElementById("backToMainFromLeaderboard");
const saveOptions = document.getElementById("saveOptions");

// Option Elements
const difficultySelect = document.getElementById("difficulty");
const timeLimitInput = document.getElementById("timeLimit");

// Game State
let currentWord = "";
let score = 0;
let time = 30;
let isWordMode = true;
let timer;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Event Listeners for Main Menu
startBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  gameModeMenu.style.display = "block";
});

optionBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  optionMenu.style.display = "block";
});

leaderboardBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  leaderboardMenu.style.display = "block";
  updateLeaderboardDisplay();
});

// Event Listeners for Back Buttons
backToMain.addEventListener("click", showMainMenu);
backToMainFromOption.addEventListener("click", showMainMenu);
backToMainFromLeaderboard.addEventListener("click", showMainMenu);

// Event Listeners for Game Mode
wordModeBtn.addEventListener("click", () => {
  isWordMode = true;
  startGame();
});

sentenceModeBtn.addEventListener("click", () => {
  isWordMode = false;
  startGame();
});

// Event Listener for Options
saveOptions.addEventListener("click", () => {
  time = parseInt(timeLimitInput.value);
  showMainMenu();
});

// Game Functions
function showMainMenu() {
  mainMenu.style.display = "block";
  gameModeMenu.style.display = "none";
  optionMenu.style.display = "none";
  leaderboardMenu.style.display = "none";
  game.style.display = "none";
}

function getRandomWord() {
  return isWordMode ? 
    words[Math.floor(Math.random() * words.length)] :
    sentences[Math.floor(Math.random() * sentences.length)];
}

function showNewWord() {
  currentWord = getRandomWord();
  wordDisplay.textContent = currentWord;
}

function startGame() {
  gameModeMenu.style.display = "none";
  game.style.display = "block";
  score = 0;
  time = parseInt(timeLimitInput.value);
  scoreEl.textContent = score;
  timeEl.textContent = time;
  showNewWord();
  input.value = "";
  input.disabled = false;
  timer = setInterval(countdown, 1000);
}

function countdown() {
  time--;
  timeEl.textContent = time;
  if (time === 0) {
    clearInterval(timer);
    wordDisplay.textContent = "Game Over";
    input.disabled = true;
    saveScore();
  }
}

function saveScore() {
  const playerName = prompt("Masukkan nama Anda untuk leaderboard:");
  if (playerName) {
    leaderboard.push({
      name: playerName,
      score: score,
      mode: isWordMode ? "Kata" : "Kalimat",
      difficulty: difficultySelect.value,
      date: new Date().toLocaleDateString()
    });
    
    // Sort leaderboard by score
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    updateLeaderboardDisplay();
  }
}

function updateLeaderboardDisplay() {
  const leaderboardContent = document.getElementById("leaderboardContent");
  leaderboardContent.innerHTML = "";
  
  if (leaderboard.length === 0) {
    leaderboardContent.innerHTML = "<p>Belum ada skor yang tersimpan</p>";
    return;
  }
  
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  
  const headerRow = table.insertRow();
  ["Peringkat", "Nama", "Skor", "Mode", "Kesulitan", "Tanggal"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    th.style.padding = "10px";
    th.style.borderBottom = "2px solid #0ff";
    headerRow.appendChild(th);
  });
  
  leaderboard.forEach((entry, index) => {
    const row = table.insertRow();
    [index + 1, entry.name, entry.score, entry.mode, entry.difficulty, entry.date].forEach(text => {
      const cell = row.insertCell();
      cell.textContent = text;
      cell.style.padding = "8px";
      cell.style.borderBottom = "1px solid #0ff";
    });
  });
  
  leaderboardContent.appendChild(table);
}

input.addEventListener("input", () => {
  if (input.value.trim().toLowerCase() === currentWord.toLowerCase()) {
    score++;
    scoreEl.textContent = score;
    showNewWord();
    input.value = "";
  }
}); 