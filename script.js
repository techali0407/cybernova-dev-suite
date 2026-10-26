// Web Audio Synth Sound Effects
let audioCtx = null;
let soundEnabled = true;

function playBeep(freq = 600, duration = 0.08) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('soundBtn');
  btn.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
  playBeep(800, 0.1);
}

// Background Canvas Stars
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for(let i = 0; i < 75; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      alpha: Math.random(),
      speed: Math.random() * 0.01 + 0.005
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = star.r > 1 ? "#d4af37" : "#a855f7";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    
    star.alpha += star.speed;
    if(star.alpha > 1 || star.alpha < 0) {
      star.speed = -star.speed;
    }
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', () => { resizeCanvas(); initStars(); });
resizeCanvas();
initStars();
drawStars();

// Tab Switcher
function switchTab(tab) {
  playBeep(700, 0.05);
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  if(tab === 'clock') {
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.getElementById('tab-clock').classList.add('active');
  } else if(tab === 'stopwatch') {
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    document.getElementById('tab-stopwatch').classList.add('active');
  } else {
    document.querySelectorAll('.tab-btn')[2].classList.add('active');
    document.getElementById('tab-quotes').classList.add('active');
  }
}

// World Clock Setup
let currentTZ = 'Asia/Karachi';

function setTimezone(tz) {
  playBeep(650, 0.05);
  currentTZ = tz;
  document.querySelectorAll('.tz-btn').forEach(b => b.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }
  updateClock();
}

function updateClock() {
  const now = new Date();
  const options = { timeZone: currentTZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);
  
  let h = parts.find(p => p.type === 'hour').value;
  let m = parts.find(p => p.type === 'minute').value;
  let s = parts.find(p => p.type === 'second').value;
  let ampm = parts.find(p => p.type === 'dayPeriod').value;

  document.getElementById('clock').innerText = `${h}:${m}:${s}`;
  document.getElementById('ampm').innerText = ampm;
  
  const dateOptions = { timeZone: currentTZ, weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  document.getElementById('date').innerText = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
  
  let tzName = "PKT (UTC+5)";
  if(currentTZ === 'UTC') tzName = "UTC / GMT";
  if(currentTZ === 'America/New_York') tzName = "EST (UTC-5)";
  if(currentTZ === 'Asia/Tokyo') tzName = "JST (UTC+9)";
  document.getElementById('tzLabel').innerText = tzName;
}
setInterval(updateClock, 1000);
updateClock();

// Precision Stopwatch Logic
let swInterval = null;
let swStartTime = 0;
let swElapsedTime = 0;
let isSwRunning = false;

function toggleStopwatch() {
  playBeep(900, 0.08);
  if(!isSwRunning) {
    swStartTime = Date.now() - swElapsedTime;
    swInterval = setInterval(updateStopwatch, 10);
    isSwRunning = true;
    document.getElementById('swStartBtn').innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
  } else {
    clearInterval(swInterval);
    isSwRunning = false;
    document.getElementById('swStartBtn').innerHTML = '<i class="fa-solid fa-play"></i> Start';
  }
}

function updateStopwatch() {
  swElapsedTime = Date.now() - swStartTime;
  let ms = Math.floor((swElapsedTime % 1000) / 10);
  let s = Math.floor((swElapsedTime / 1000) % 60);
  let m = Math.floor((swElapsedTime / (1000 * 60)) % 60);

  let mStr = String(m).padStart(2, '0');
  let sStr = String(s).padStart(2, '0');
  let msStr = String(ms).padStart(2, '0');

  document.getElementById('swDisplay').innerHTML = `${mStr}:${sStr}<small>.${msStr}</small>`;
}

function resetStopwatch() {
  playBeep(400, 0.08);
  clearInterval(swInterval);
  isSwRunning = false;
  swElapsedTime = 0;
  document.getElementById('swDisplay').innerHTML = `00:00<small>.00</small>`;
  document.getElementById('swStartBtn').innerHTML = '<i class="fa-solid fa-play"></i> Start';
  document.getElementById('lapList').innerHTML = '';
}

function lapStopwatch() {
  if(!isSwRunning) return;
  playBeep(1100, 0.05);
  const lapTime = document.getElementById('swDisplay').innerText;
  const li = document.createElement('li');
  const count = document.getElementById('lapList').children.length + 1;
  li.innerHTML = `<span>Lap ${count}</span> <span>${lapTime}</span>`;
  document.getElementById('lapList').prepend(li);
}

// Timer & Alarm Logic (Reset Fix to 00:00)
let timerSeconds = 0;
let timerInterval = null;
let isTimerRunning = false;

function updateTimerDisplay() {
  let m = Math.floor(timerSeconds / 60);
  let s = timerSeconds % 60;
  document.getElementById('timerDisplay').innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function addTimerSeconds(sec) {
  playBeep(800, 0.05);
  timerSeconds += sec;
  updateTimerDisplay();
}

function resetTimer() {
  playBeep(400, 0.08);
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isTimerRunning = false;
  timerSeconds = 0;
  updateTimerDisplay();
  const btn = document.getElementById('timerStartBtn');
  if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> Start Timer';
}

function toggleTimer() {
  playBeep(900, 0.08);
  if(!isTimerRunning) {
    if(timerSeconds <= 0) {
      alert("Please set timer duration using +1 Min, +5 Min, or +10 Min buttons first!");
      return;
    }
    isTimerRunning = true;
    document.getElementById('timerStartBtn').innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();
      if(timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        isTimerRunning = false;
        document.getElementById('timerStartBtn').innerHTML = '<i class="fa-solid fa-play"></i> Start Timer';
        playBeep(1200, 0.4);
        alert("CyberNova Alarm: Timer Finished!");
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    document.getElementById('timerStartBtn').innerHTML = '<i class="fa-solid fa-play"></i> Start Timer';
  }
}

// Quote Engine
const quotes = [
  { cat: "tech", text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { cat: "tech", text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { cat: "tech", text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { cat: "ai", text: "Artificial Intelligence is the new electricity.", author: "Andrew Ng" },
  { cat: "ai", text: "Predicting the future isn't magic, it's Artificial Intelligence.", author: "Dave Waters" },
  { cat: "cyber", text: "Security is not a product, but a process.", author: "Bruce Schneier" },
  { cat: "cyber", text: "There are only two types of companies: those that have been hacked, and those that will be.", author: "Robert Mueller" }
];

let activeCat = 'all';

function setQuoteCat(cat) {
  playBeep(650, 0.05);
  activeCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }
  generateQuote();
}

function generateQuote() {
  playBeep(850, 0.08);
  let filtered = quotes;
  if(activeCat !== 'all') {
    filtered = quotes.filter(q => q.cat === activeCat);
  }
  const rand = Math.floor(Math.random() * filtered.length);
  document.getElementById('quoteText').innerText = `"${filtered[rand].text}"`;
  document.getElementById('quoteAuthor').innerText = `— ${filtered[rand].author}`;
}

function copyQuote() {
  playBeep(1000, 0.08);
  const text = document.getElementById('quoteText').innerText + " " + document.getElementById('quoteAuthor').innerText;
  navigator.clipboard.writeText(text);
  alert("Quote copied to clipboard!");
}

function shareQuote() {
  playBeep(1000, 0.08);
  const text = encodeURIComponent(document.getElementById('quoteText').innerText + " " + document.getElementById('quoteAuthor').innerText + " #CyberNova #BuildInPublic");
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}