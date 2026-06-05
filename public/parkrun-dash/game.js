const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const distanceEl = document.querySelector("#distance");
const bestEl = document.querySelector("#best");
const weatherEl = document.querySelector("#weather");
const speedEl = document.querySelector("#speed");
const overlay = document.querySelector("#overlay");
const startButton = document.querySelector("#start");
const restartButton = document.querySelector("#restart");
const slowButton = document.querySelector("#slow");
const fastButton = document.querySelector("#fast");
const maleButton = document.querySelector("#male");
const femaleButton = document.querySelector("#female");

const W = canvas.width;
const H = canvas.height;
const groundY = 412;
const finishKm = 5;
const finishStartKm = 4.55;
const hillStartKm = 2.35;
const hillEndKm = 3.35;
const gravity = 0.78;
const jumpForce = -18.2;
const baseRunSpeed = 330;
const distanceRate = 0.00058;
const speedSteps = [0.75, 1, 1.25, 1.5];
const weatherOptions = [
  { id: "sunny", label: "Sunny", speed: 1, jump: 1, sky: "#73c5ef" },
  { id: "wind", label: "Wind", speed: 0.82, jump: 1, sky: "#9bc7d8" },
  { id: "rain", label: "Rain", speed: 0.93, jump: 0.88, sky: "#789db2" },
  { id: "ice", label: "Ice", speed: 0.88, jump: 0.82, sky: "#b7dce8" },
  { id: "hot", label: "Really Sunny", speed: 0.96, jump: 1, sky: "#8fd6f0" },
];

let state;
let lastTime = 0;
let animationId = 0;
let selectedRunner = "male";

const bestKey = "park-run-dash-best-v5";
let bestKm = Number(localStorage.getItem(bestKey) || 0);
bestEl.textContent = `${bestKm.toFixed(2)} km`;

function resetGame(playing = false) {
  const weather = playing ? randomWeather() : weatherOptions[0];
  state = {
    mode: playing ? "playing" : "ready",
    runner: {
      x: 142,
      y: groundY - 74,
      width: 42,
      height: 74,
      vy: 0,
      grounded: true,
      stride: 0,
    },
    logs: [],
    birds: [],
    water: [],
    particles: [],
    nextLogIn: 1.25,
    nextBirdIn: 0.6 + Math.random() * 1.5,
    nextWaterIn: 1.6,
    jumpQueued: 0,
    heatTimer: 0,
    waterCount: weather.id === "hot" ? 3 : 0,
    speedIndex: 1,
    weather,
    distanceKm: 0,
    scroll: 0,
    finishX: W + 120,
    finishedAt: 0,
    message: "Jump the logs and reach the 5km finish.",
  };
  overlay.classList.toggle("hidden", playing);
  if (!playing) {
    overlay.querySelector("h1").textContent = "Park Run Dash";
    overlay.querySelector("p").textContent = "Jump the logs and reach the 5km finish.";
    startButton.textContent = "Start Run";
  }
  updateHud();
}

function startGame() {
  resetGame(true);
  lastTime = performance.now();
}

function endGame(message) {
  state.mode = "ended";
  state.message = message;
  overlay.querySelector("h1").textContent = message;
  overlay.querySelector("p").textContent = `Distance: ${state.distanceKm.toFixed(2)} km`;
  startButton.textContent = "Run Again";
  overlay.classList.remove("hidden");
  saveBest();
}

function finishGame() {
  state.distanceKm = finishKm;
  state.mode = "finished";
  state.finishedAt = 0;
  saveBest();
}

function saveBest() {
  if (state.distanceKm > bestKm) {
    bestKm = Math.min(finishKm, state.distanceKm);
    localStorage.setItem(bestKey, String(bestKm));
    bestEl.textContent = `${bestKm.toFixed(2)} km`;
  }
}

function updateHud() {
  distanceEl.textContent = `${Math.min(finishKm, state.distanceKm).toFixed(2)} km`;
  const weatherText = state.weather.id === "hot"
    ? `${state.weather.label} ${state.waterCount}x water`
    : state.weather.label;
  weatherEl.textContent = isHillActive() ? `${weatherText} + Hill` : weatherText;
  speedEl.textContent = `Pace x${speedSteps[state.speedIndex].toFixed(2)}`;
}

function currentRunSpeed() {
  const heatSlowdown = state.weather.id === "hot" && state.waterCount <= 0 ? 0.78 : 1;
  const hillSlowdown = isHillActive() ? 0.58 : 1;
  return baseRunSpeed * speedSteps[state.speedIndex] * state.weather.speed * heatSlowdown * hillSlowdown;
}

function isHillActive() {
  return state.mode === "playing" && state.distanceKm >= hillStartKm && state.distanceKm <= hillEndKm;
}

function hillVisibility() {
  if (state.distanceKm < hillStartKm - 0.28 || state.distanceKm > hillEndKm + 0.28) return 0;
  if (state.distanceKm < hillStartKm) return (state.distanceKm - (hillStartKm - 0.28)) / 0.28;
  if (state.distanceKm > hillEndKm) return 1 - (state.distanceKm - hillEndKm) / 0.28;
  return 1;
}

function randomWeather() {
  return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
}

function changeSpeed(direction) {
  state.speedIndex = Math.max(0, Math.min(speedSteps.length - 1, state.speedIndex + direction));
  updateHud();
}

function jump() {
  if (state.mode !== "playing") return;
  if (!state.runner.grounded) {
    state.jumpQueued = 0.18;
    return;
  }
  const slipDelay = state.weather.id === "ice" ? 0.07 : state.weather.id === "rain" ? 0.04 : 0;
  if (slipDelay > 0) {
    state.runner.slipping = slipDelay;
    state.jumpQueued = slipDelay + 0.08;
    return;
  }
  performJump();
}

function performJump() {
  state.runner.vy = jumpForce * state.weather.jump;
  state.runner.grounded = false;
  state.jumpQueued = 0;
  state.runner.slipping = 0;
  burst(state.runner.x + 8, groundY - 8, "#fff1a8", 8);
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    state.particles.push({
      x,
      y,
      vx: -80 - Math.random() * 70,
      vy: -20 - Math.random() * 70,
      life: 0.35 + Math.random() * 0.25,
      color,
    });
  }
}

function spawnLog() {
  const size = Math.random();
  const width = 36 + Math.random() * 38;
  const height = size > 0.72 ? 38 : 24 + Math.random() * 12;
  const count = Math.random() > 0.72 ? 2 : 1;
  state.logs.push({
    x: W + 30,
    y: groundY - height,
    width,
    height,
    count,
    shade: Math.random() > 0.5 ? "#8d5524" : "#73421f",
    passed: false,
  });
  state.nextLogIn = 1.34 + Math.random() * 1.28;
}

function spawnBird() {
  state.birds.push({
    x: W + 40,
    y: 70 + Math.random() * 145,
    speed: 55 + Math.random() * 95,
    size: 0.75 + Math.random() * 0.75,
    flap: Math.random() * Math.PI * 2,
    color: Math.random() > 0.5 ? "#17324d" : "#6b4423",
  });
  state.nextBirdIn = 1.8 + Math.random() * 3.2;
}

function spawnWater() {
  state.water.push({
    x: W + 35,
    y: groundY - 54,
    width: 22,
    height: 38,
    bob: Math.random() * Math.PI * 2,
    collected: false,
  });
  state.nextWaterIn = 2.4 + Math.random() * 2.2;
}

function update(dt) {
  const runSpeed = currentRunSpeed();
  state.scroll += runSpeed * dt;
  updateBirds(dt, runSpeed);
  updateWeather(dt, runSpeed);

  if (state.mode === "playing") {
    state.distanceKm += runSpeed * distanceRate * dt;
    state.runner.stride += dt * (isHillActive() ? 7 : 13);
    state.jumpQueued = Math.max(0, state.jumpQueued - dt);
    state.runner.slipping = Math.max(0, (state.runner.slipping || 0) - dt);
    if (state.runner.slipping === 0 && state.jumpQueued > 0 && state.runner.grounded) performJump();
    state.runner.vy += gravity * 60 * dt;
    state.runner.y += state.runner.vy * dt * 60;

    if (state.runner.y >= groundY - state.runner.height) {
      state.runner.y = groundY - state.runner.height;
      state.runner.vy = 0;
      state.runner.grounded = true;
      if (state.jumpQueued > 0) jump();
    }

    state.nextLogIn -= dt;
    if (state.nextLogIn <= 0 && state.distanceKm < 4.35) spawnLog();

    for (const log of state.logs) {
      log.x -= runSpeed * dt;
      if (!log.passed && log.x + log.width < state.runner.x) {
        log.passed = true;
        burst(log.x, groundY - 20, "#9ee493", 4);
      }
      if (rectsOverlap(state.runner, log, 13)) {
        endGame("Log Trip");
      }
    }

    if (state.mode !== "playing") {
      updateHud();
      return;
    }

    state.logs = state.logs.filter((log) => log.x + log.width > -60);
    updateWaterPickups(dt, runSpeed);

    if (state.distanceKm >= finishStartKm) {
      state.finishX -= runSpeed * dt;
      if (state.finishX <= state.runner.x + state.runner.width) {
        state.finishX = state.runner.x + state.runner.width;
        state.logs = [];
        finishGame();
      }
    }

    if (state.distanceKm > finishKm) {
      state.distanceKm = finishKm;
    }

    if (state.distanceKm >= finishKm && state.finishX <= state.runner.x + state.runner.width + 4) {
      finishGame();
    }
  } else if (state.mode === "finished") {
    state.finishedAt += dt;
    if (!state.runner.grounded) {
      state.runner.vy += gravity * 60 * dt;
      state.runner.y += state.runner.vy * dt * 60;
      if (state.runner.y >= groundY - state.runner.height) {
        state.runner.y = groundY - state.runner.height;
        state.runner.vy = 0;
        state.runner.grounded = true;
      }
    }
    state.runner.x = Math.min(675, state.runner.x + 120 * dt);
    state.runner.stride += dt * 6;
    if (state.finishedAt > 4.2) {
      endGame("5km Finished");
    }
  }

  for (const particle of state.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 160 * dt;
    particle.life -= dt;
  }
  state.particles = state.particles.filter((particle) => particle.life > 0);
  updateHud();
}

function updateBirds(dt, runSpeed) {
  state.nextBirdIn -= dt;
  if (state.nextBirdIn <= 0) spawnBird();

  for (const bird of state.birds) {
    bird.x -= (bird.speed + runSpeed * 0.12) * dt;
    bird.y += Math.sin(bird.flap) * 10 * dt;
    bird.flap += dt * 9;
  }
  state.birds = state.birds.filter((bird) => bird.x > -70);
}

function updateWeather(dt, runSpeed) {
  if (state.heatTimer > 0) state.heatTimer = Math.max(0, state.heatTimer - dt);

  if (state.weather.id !== "hot" || state.mode !== "playing" || state.distanceKm >= 4.35) return;
  state.nextWaterIn -= dt;
  if (state.nextWaterIn <= 0) spawnWater();
}

function updateWaterPickups(dt, runSpeed) {
  if (state.weather.id !== "hot") return;

  for (const bottle of state.water) {
    bottle.x -= runSpeed * dt;
    bottle.bob += dt * 7;

    if (!bottle.collected && rectsOverlap(state.runner, bottle, 4)) {
      bottle.collected = true;
      state.waterCount = Math.min(5, state.waterCount + 1);
      burst(bottle.x, bottle.y + 20, "#73c5ef", 10);
    }

    if (!bottle.collected && bottle.x + bottle.width < -5) {
      bottle.collected = true;
      state.waterCount = Math.max(0, state.waterCount - 1);
      state.heatTimer = 1.8;
    }
  }

  state.water = state.water.filter((bottle) => !bottle.collected && bottle.x + bottle.width > -60);
}

function rectsOverlap(a, b, pad = 0) {
  return (
    a.x + pad < b.x + b.width &&
    a.x + a.width - pad > b.x &&
    a.y + pad < b.y + b.height &&
    a.y + a.height - pad > b.y
  );
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  drawSky();
  drawWeather();
  for (const bird of state.birds) drawBird(bird);
  drawCourse();
  drawHill();
  drawFinish();
  for (const bottle of state.water) drawWaterBottle(bottle);
  for (const log of state.logs) drawLog(log);
  drawRunner(state.runner);
  if (state.mode === "finished" || (state.mode === "ended" && state.distanceKm >= finishKm)) {
    drawFlagWaver();
  }
  drawParticles();
}

function drawSky() {
  ctx.fillStyle = state.weather.sky;
  ctx.fillRect(0, 0, W, H);
  if (state.weather.id === "hot") {
    ctx.fillStyle = "#ffd85a";
    ctx.fillRect(790, 42, 62, 62);
    ctx.fillStyle = "#ffef9a";
    ctx.fillRect(806, 58, 30, 30);
  }
  ctx.fillStyle = "#ffffff";
  drawPixelCloud(90 - (state.scroll * 0.08) % 1120, 72, 4);
  drawPixelCloud(520 - (state.scroll * 0.055) % 1180, 126, 3);
  drawPixelCloud(860 - (state.scroll * 0.07) % 1160, 86, 3);

  ctx.fillStyle = "#4d944f";
  for (let x = -90 - (state.scroll * 0.18) % 150; x < W + 120; x += 150) {
    drawTree(x, 250, 1.1);
  }
}

function drawWeather() {
  if (state.weather.id === "wind") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
    for (let x = -80 - (state.scroll * 1.3) % 220; x < W + 80; x += 220) {
      ctx.fillRect(x, 86, 72, 5);
      ctx.fillRect(x + 34, 126, 110, 5);
      ctx.fillRect(x - 20, 182, 92, 5);
    }
  } else if (state.weather.id === "rain") {
    ctx.fillStyle = "rgba(24, 62, 88, 0.5)";
    for (let x = -60 - (state.scroll * 0.75) % 54; x < W + 70; x += 54) {
      for (let y = 28; y < groundY - 20; y += 62) {
        ctx.fillRect(x + y % 37, y, 5, 22);
      }
    }
  } else if (state.weather.id === "ice") {
    ctx.fillStyle = "rgba(235, 252, 255, 0.75)";
    for (let x = -80 - (state.scroll * 0.18) % 140; x < W + 100; x += 140) {
      ctx.fillRect(x, groundY - 8, 78, 6);
      ctx.fillRect(x + 20, groundY + 42, 96, 5);
    }
  } else if (state.weather.id === "hot" && state.heatTimer > 0) {
    ctx.fillStyle = "rgba(255, 216, 90, 0.18)";
    ctx.fillRect(0, 0, W, H);
  }
}

function drawCourse() {
  ctx.fillStyle = "#65ad55";
  ctx.fillRect(0, groundY, W, H - groundY);
  ctx.fillStyle = "#d5a85c";
  ctx.fillRect(0, groundY - 4, W, 64);
  ctx.fillStyle = "#bd8842";
  ctx.fillRect(0, groundY + 56, W, 9);

  for (let x = -80 - (state.scroll % 96); x < W + 96; x += 96) {
    ctx.fillStyle = "#8e6637";
    ctx.fillRect(x, groundY + 20, 42, 5);
    ctx.fillStyle = "#f5c775";
    ctx.fillRect(x + 50, groundY + 38, 30, 4);
  }

  ctx.fillStyle = "#17324d";
  ctx.font = "bold 18px monospace";
  ctx.fillText(`${Math.min(finishKm, state.distanceKm).toFixed(2)} / 5.00 km`, 28, 38);
}

function drawHill() {
  const visible = hillVisibility();
  if (visible <= 0) return;

  const progress = Math.min(
    1,
    Math.max(0, (state.distanceKm - (hillStartKm - 0.28)) / ((hillEndKm + 0.28) - (hillStartKm - 0.28)))
  );
  const x = W + 120 - progress * (W + 520);
  const width = 560;
  const height = 176;
  const peakX = x + width * 0.48;
  const peakY = groundY - height;

  ctx.globalAlpha = visible;
  ctx.fillStyle = "#4f9847";
  ctx.beginPath();
  ctx.moveTo(x - 80, groundY + 4);
  ctx.lineTo(x + 90, groundY - 40);
  ctx.lineTo(peakX, peakY);
  ctx.lineTo(x + width - 60, groundY - 28);
  ctx.lineTo(x + width + 120, groundY + 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#3f7f3c";
  ctx.beginPath();
  ctx.moveTo(x + 80, groundY - 10);
  ctx.lineTo(peakX, peakY + 30);
  ctx.lineTo(x + width - 120, groundY - 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#d5a85c";
  ctx.beginPath();
  ctx.moveTo(x + 12, groundY + 12);
  ctx.lineTo(x + 145, groundY - 32);
  ctx.lineTo(peakX - 18, peakY + 52);
  ctx.lineTo(x + width - 120, groundY - 18);
  ctx.lineTo(x + width + 24, groundY + 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#17324d";
  ctx.fillRect(peakX - 46, peakY - 36, 92, 30);
  ctx.fillStyle = "#ffd85a";
  ctx.fillRect(peakX - 42, peakY - 32, 84, 22);
  ctx.fillStyle = "#17324d";
  ctx.font = "bold 15px monospace";
  ctx.fillText("BIG HILL", peakX - 36, peakY - 16);

  if (isHillActive()) {
    ctx.fillStyle = "rgba(23, 50, 77, 0.12)";
    ctx.fillRect(0, 0, W, H);
  }

  ctx.globalAlpha = 1;
}

function drawFinish() {
  if (state.mode !== "finished" && state.distanceKm < finishStartKm) return;
  const x = state.finishX;
  ctx.fillStyle = "#17324d";
  ctx.fillRect(x, groundY - 142, 10, 142);
  ctx.fillRect(x + 100, groundY - 142, 10, 142);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? "#ffffff" : "#e43f35";
    ctx.fillRect(x + 10 + i * 15, groundY - 142, 15, 24);
  }
  ctx.fillStyle = "#17324d";
  ctx.font = "bold 20px monospace";
  ctx.fillText("FINISH", x + 17, groundY - 154);
}

function drawRunner(runner) {
  const x = runner.x;
  const y = runner.y;
  const step = runner.grounded ? Math.sin(runner.stride) : 0.4;
  const isFemale = selectedRunner === "female";

  ctx.fillStyle = "#17324d";
  ctx.fillRect(x + 8, y + 22, 26, 28);
  ctx.fillStyle = isFemale ? "#d65db1" : "#ff7f50";
  ctx.fillRect(x + 11, y + 25, 20, 22);
  ctx.fillStyle = "#f7c99a";
  ctx.fillRect(x + 11, y + 4, 22, 20);
  ctx.fillStyle = isFemale ? "#7a3d18" : "#47301f";
  ctx.fillRect(x + 8, y, 28, isFemale ? 10 : 8);
  if (isFemale) {
    ctx.fillRect(x + 7, y + 9, 7, 18);
    ctx.fillRect(x + 29, y + 9, 7, 18);
  }
  ctx.fillStyle = "#17324d";
  ctx.fillRect(x + 27, y + 11, 4, 4);

  ctx.fillStyle = "#17324d";
  ctx.fillRect(x + 7, y + 50, 8, 18 + step * 5);
  ctx.fillRect(x + 26, y + 50, 8, 18 - step * 5);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 3, y + 67 + step * 5, 16, 7);
  ctx.fillRect(x + 22, y + 67 - step * 5, 16, 7);

  ctx.fillStyle = "#17324d";
  ctx.fillRect(x + 3, y + 28, 8, 20 - step * 4);
  ctx.fillRect(x + 31, y + 28, 8, 20 + step * 4);
}

function drawFlagWaver() {
  const wave = Math.sin(performance.now() / 160) * 8;
  const x = 805;
  const y = groundY - 86;

  ctx.fillStyle = "#17324d";
  ctx.fillRect(x + 19, y + 28, 24, 32);
  ctx.fillStyle = "#2f9e44";
  ctx.fillRect(x + 22, y + 31, 18, 25);
  ctx.fillStyle = "#f7c99a";
  ctx.fillRect(x + 20, y + 5, 22, 22);
  ctx.fillStyle = "#2c2018";
  ctx.fillRect(x + 17, y, 28, 8);
  ctx.fillStyle = "#17324d";
  ctx.fillRect(x + 42, y + 22, 36, 7);
  ctx.fillRect(x + 74, y - 28 + wave, 6, 72);
  ctx.fillStyle = "#ffd85a";
  ctx.fillRect(x + 80, y - 28 + wave, 50, 28);
  ctx.fillStyle = "#e43f35";
  ctx.fillRect(x + 80, y - 28 + wave, 50, 9);
  ctx.fillStyle = "#17324d";
  ctx.font = "bold 12px monospace";
  ctx.fillText("5K", x + 94, y - 8 + wave);

  ctx.fillStyle = "#17324d";
  ctx.fillRect(x + 19, y + 60, 8, 22);
  ctx.fillRect(x + 35, y + 60, 8, 22);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 15, y + 80, 15, 6);
  ctx.fillRect(x + 31, y + 80, 15, 6);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x - 18, y - 58, 112, 34);
  ctx.fillStyle = "#17324d";
  ctx.fillRect(x - 18, y - 58, 112, 4);
  ctx.fillRect(x - 18, y - 24, 112, 4);
  ctx.fillRect(x - 18, y - 58, 4, 34);
  ctx.fillRect(x + 90, y - 58, 4, 34);
  ctx.font = "bold 17px monospace";
  ctx.fillText("I'm out", x - 4, y - 35);
}

function drawLog(log) {
  const segmentWidth = log.width / log.count;
  for (let i = 0; i < log.count; i++) {
    drawLogSegment(log.x + i * segmentWidth + i * 8, log.y + i * 4, segmentWidth, log.height, log.shade);
  }
}

function drawLogSegment(x, y, width, height, shade) {
  ctx.fillStyle = "#5b351e";
  ctx.fillRect(x, y + height * 0.22, width, height * 0.58);
  ctx.fillStyle = shade;
  ctx.fillRect(x + 4, y + 3, width - 8, height - 6);
  ctx.fillStyle = "#d89a55";
  ctx.fillRect(x + 6, y + 8, 10, Math.max(10, height - 16));
  ctx.fillRect(x + width - 16, y + 8, 10, Math.max(10, height - 16));
  ctx.fillStyle = "#4b2b18";
  ctx.fillRect(x + 20, y + 10, Math.max(5, width - 40), 4);
  if (height > 34) {
    ctx.fillRect(x + 22, y + 22, Math.max(5, width - 44), 4);
  }
}

function drawBird(bird) {
  const wing = Math.sin(bird.flap) * 7 * bird.size;
  ctx.fillStyle = bird.color;
  ctx.fillRect(bird.x, bird.y, 12 * bird.size, 7 * bird.size);
  ctx.fillRect(bird.x + 10 * bird.size, bird.y + 2 * bird.size, 6 * bird.size, 4 * bird.size);
  ctx.fillRect(bird.x - 9 * bird.size, bird.y - wing, 12 * bird.size, 4 * bird.size);
  ctx.fillRect(bird.x + 4 * bird.size, bird.y + wing, 12 * bird.size, 4 * bird.size);
  ctx.fillStyle = "#ffd85a";
  ctx.fillRect(bird.x + 16 * bird.size, bird.y + 3 * bird.size, 5 * bird.size, 3 * bird.size);
}

function drawWaterBottle(bottle) {
  const y = bottle.y + Math.sin(bottle.bob) * 4;
  ctx.fillStyle = "#17324d";
  ctx.fillRect(bottle.x + 6, y, 10, 6);
  ctx.fillRect(bottle.x + 3, y + 6, 16, 28);
  ctx.fillStyle = "#dff9ff";
  ctx.fillRect(bottle.x + 6, y + 9, 10, 22);
  ctx.fillStyle = "#4dabf7";
  ctx.fillRect(bottle.x + 6, y + 18, 10, 13);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(bottle.x + 9, y + 11, 4, 5);
}

function drawTree(x, y, scale) {
  ctx.fillStyle = "#6b4423";
  ctx.fillRect(x + 30 * scale, y + 54 * scale, 20 * scale, 74 * scale);
  ctx.fillStyle = "#2f7d32";
  ctx.fillRect(x + 8 * scale, y + 22 * scale, 64 * scale, 44 * scale);
  ctx.fillStyle = "#3fa34d";
  ctx.fillRect(x + 20 * scale, y, 42 * scale, 36 * scale);
  ctx.fillStyle = "#236d2b";
  ctx.fillRect(x, y + 48 * scale, 78 * scale, 34 * scale);
}

function drawPixelCloud(x, y, scale) {
  ctx.fillRect(x, y + 12 * scale, 26 * scale, 12 * scale);
  ctx.fillRect(x + 16 * scale, y, 30 * scale, 24 * scale);
  ctx.fillRect(x + 40 * scale, y + 9 * scale, 34 * scale, 15 * scale);
}

function drawParticles() {
  for (const particle of state.particles) {
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, 7, 7);
  }
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
  lastTime = now;
  update(dt);
  draw();
  animationId = requestAnimationFrame(loop);
}

function handleControl(code) {
  if (code === "Space" || code === "ArrowUp") {
    if (state.mode === "ready" || state.mode === "ended") startGame();
    else jump();
  } else if (code === "ArrowLeft") {
    changeSpeed(-1);
  } else if (code === "ArrowRight") {
    changeSpeed(1);
  }
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp" || event.code === "ArrowLeft" || event.code === "ArrowRight") {
    event.preventDefault();
    handleControl(event.code);
  }
});

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin || event.data?.type !== "parkrun-control") return;
  handleControl(event.data.code);
});

canvas.addEventListener("pointerdown", () => {
  canvas.focus();
  if (state.mode === "ready" || state.mode === "ended") startGame();
  else jump();
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
slowButton.addEventListener("click", () => changeSpeed(-1));
fastButton.addEventListener("click", () => changeSpeed(1));
maleButton.addEventListener("click", () => chooseRunner("male"));
femaleButton.addEventListener("click", () => chooseRunner("female"));

function chooseRunner(runner) {
  selectedRunner = runner;
  maleButton.classList.toggle("selected", runner === "male");
  femaleButton.classList.toggle("selected", runner === "female");
  maleButton.setAttribute("aria-pressed", String(runner === "male"));
  femaleButton.setAttribute("aria-pressed", String(runner === "female"));
}

resetGame(false);
cancelAnimationFrame(animationId);
lastTime = performance.now();
animationId = requestAnimationFrame(loop);
