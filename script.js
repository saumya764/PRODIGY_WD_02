const timeDisplay = document.getElementById("timeDisplay");
const startBtn = document.getElementById("startBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const lapsList = document.getElementById("lapsList");
const exportBtn = document.getElementById("exportBtn");

let startTime = 0;
let elapsed = 0;
let running = false;
let timer;
let laps = [];

// Format time helper
function formatTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const msecs = ms % 1000;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(msecs).padStart(3, "0")}`;
}

// Update display
function updateDisplay() {
  timeDisplay.textContent = formatTime(elapsed);
}

// Start stopwatch
function start() {
  if (running) return;
  running = true;
  startTime = Date.now() - elapsed;
  timer = setInterval(() => {
    elapsed = Date.now() - startTime;
    updateDisplay();
  }, 10);
  startBtn.textContent = "Pause";
  lapBtn.disabled = false;
  resetBtn.disabled = false;
}

// Pause stopwatch
function pause() {
  running = false;
  clearInterval(timer);
  startBtn.textContent = "Start";
}

// Reset stopwatch
function reset() {
  running = false;
  clearInterval(timer);
  elapsed = 0;
  updateDisplay();
  laps = [];
  lapsList.innerHTML = "";
  startBtn.textContent = "Start";
  lapBtn.disabled = true;
  resetBtn.disabled = true;
  exportBtn.disabled = true;
}

// Record lap
function recordLap() {
  const lapTime = elapsed - (laps.length > 0 ? laps[laps.length - 1].total : 0);
  const lap = { index: laps.length + 1, time: lapTime, total: elapsed };
  laps.push(lap);
  renderLaps();
  exportBtn.disabled = false;
}

function renderLaps() {
  lapsList.innerHTML = "";
  for (let i = laps.length - 1; i >= 0; i--) {
    const lap = laps[i];
    const li = document.createElement("li");
    li.innerHTML = `<span>Lap ${lap.index}</span><span>${formatTime(lap.time)} <small style="color:var(--muted)">(${formatTime(lap.total)})</small></span>`;
    lapsList.appendChild(li);
  }
}

// Export laps to CSV
function exportCSV() {
  if (!laps.length) return;
  let csv = "Lap, Lap Time, Total Time\\n";
  laps.forEach(l => {
    csv += `${l.index},${formatTime(l.time)},${formatTime(l.total)}\\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "laps.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Event listeners
startBtn.addEventListener("click", () => {
  if (!running) start();
  else pause();
});

lapBtn.addEventListener("click", recordLap);
resetBtn.addEventListener("click", reset);
exportBtn.addEventListener("click", exportCSV);

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); running ? pause() : start(); }
  if (e.key.toLowerCase() === "l") { e.preventDefault(); if (!lapBtn.disabled) recordLap(); }
  if (e.key.toLowerCase() === "r") { e.preventDefault(); reset(); }
});

updateDisplay();
