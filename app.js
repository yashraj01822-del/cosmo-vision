// ----------------------------------------------------
// 1. TIME CONTROL ENGINE & STATE
// ----------------------------------------------------
let simulatedTime = new Date(); // Active sky time
let timeMultiplier = 1;         // 1 = realtime, >1 = fast-forward, <0 = rewind
let isTimePaused = false;
let lastFrameTimestamp = performance.now();

// ----------------------------------------------------
// 2. CELESTIAL MAP INITIALIZATION
// ----------------------------------------------------
const celestialConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    projection: "orthographic", 
    transform: "equatorial",
    center: [0, 20, 0],         
    orientation: "down",
    follow: "zenith",
    geopos: null,

    background: { fill: "#02040a", stroke: "#000000", opacity: 0 },

    stars: {
        show: true,
        limit: 6,               
        colors: true,            
        names: true,            
        propername: true,
        namelimit: 2.0,
        size: 6,
        data: 'stars.6.json'    
    },

    constellations: {
        show: true,
        names: true,
        lines: true,
        linewidth: 1.2,
        lineStyle: { stroke: "rgba(76, 201, 240, 0.45)", width: 1.2, dash: [3, 3] },
        bounds: false
    },

    mw: { show: true, style: { fill: "rgba(120, 160, 220, 0.12)" } },

    planets: { show: true, names: true, colors: true },
    dsos: { show: true, limit: 4 },

    interactive: true,
    controls: true,
    datapath: "https://cdn.jsdelivr.net/gh/ofrohn/d3-celestial@master/data/"
};

// Display Celestial Map
Celestial.display(celestialConfig);

// ----------------------------------------------------
// 3. DYNAMIC CLOUD OVERLAY ENGINE
// ----------------------------------------------------
const cloudCanvas = document.getElementById('cloud-canvas');
const cloudCtx = cloudCanvas.getContext('2d');

let cloudOffset = 0;
let driftSpeed = 0.001;
let isCloudsEnabled = true;

function resizeCloudCanvas() {
    cloudCanvas.width = window.innerWidth;
    cloudCanvas.height = window.innerHeight;
}

function renderClouds(offset) {
    if (!isCloudsEnabled) {
        cloudCtx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
        return;
    }

    const width = cloudCanvas.width;
    const height = cloudCanvas.height;

    cloudCtx.clearRect(0, 0, width, height);

    // Atmospheric cloud backdrop
    const mainGradient = cloudCtx.createRadialGradient(
        width / 2 + Math.sin(offset) * 120,
        height / 2 + Math.cos(offset) * 60,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
    );
    mainGradient.addColorStop(0, 'rgba(140, 170, 210, 0.3)');
    mainGradient.addColorStop(0.5, 'rgba(60, 80, 120, 0.15)');
    mainGradient.addColorStop(1, 'rgba(2, 4, 10, 0.5)');

    cloudCtx.fillStyle = mainGradient;
    cloudCtx.fillRect(0, 0, width, height);

    // Dynamic cloud formations
    for (let i = 0; i < 7; i++) {
        const cx = ((width * 0.22 * i) + (offset * 140 * (i + 1))) % (width + 600) - 300;
        const cy = ((height * 0.28 * i) + Math.sin(offset + i) * 110) % (height + 400) - 200;
        
        const cloudGradient = cloudCtx.createRadialGradient(cx, cy, 20, cx, cy, 340);
        cloudGradient.addColorStop(0, 'rgba(180, 205, 235, 0.25)');
        cloudGradient.addColorStop(0.6, 'rgba(90, 115, 150, 0.1)');
        cloudGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        cloudCtx.fillStyle = cloudGradient;
        cloudCtx.beginPath();
        cloudCtx.arc(cx, cy, 340, 0, Math.PI * 2);
        cloudCtx.fill();
    }
}

// Main Animation & Time Loop
function mainLoop(now) {
    const deltaMs = now - lastFrameTimestamp;
    lastFrameTimestamp = now;

    // Advance simulated time based on speed multiplier
    if (!isTimePaused) {
        simulatedTime = new Date(simulatedTime.getTime() + deltaMs * timeMultiplier);
        
        // Update celestial sky orientation if time speed is significant
        if (Math.abs(timeMultiplier) > 10) {
            Celestial.date(simulatedTime);
        }
    }

    // Render atmospheric cloud drift
    cloudOffset += driftSpeed;
    renderClouds(cloudOffset);

    // Update Header Display
    document.getElementById('time-display').innerText = 
        simulatedTime.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    requestAnimationFrame(mainLoop);
}

// ----------------------------------------------------
// 4. STELLARIUM TIME CONTROLS & LISTENERS
// ----------------------------------------------------
const btnPlayPause = document.getElementById('btn-play-pause');
const btnRewind = document.getElementById('btn-rewind');
const btnFFwd = document.getElementById('btn-ffwd');
const btnRealtime = document.getElementById('btn-realtime');
const btnTimeDialog = document.getElementById('btn-time-dialog');

const iconPause = document.getElementById('icon-pause');
const iconPlay = document.getElementById('icon-play');
const speedBadge = document.getElementById('speed-multiplier-display');

const timePanel = document.getElementById('time-panel');
const datetimePicker = document.getElementById('datetime-picker');

function updateSpeedBadge() {
    speedBadge.innerText = `${timeMultiplier}x`;
}

// Pause / Play Toggle
btnPlayPause.addEventListener('click', () => {
    isTimePaused = !isTimePaused;
    btnPlayPause.classList.toggle('active', !isTimePaused);
    iconPause.classList.toggle('hidden', isTimePaused);
    iconPlay.classList.toggle('hidden', !isTimePaused);
});

// Fast Forward (10x -> 100x -> 1000x -> 10000x)
btnFFwd.addEventListener('click', () => {
    isTimePaused = false;
    btnPlayPause.classList.add('active');
    iconPause.classList.remove('hidden');
    iconPlay.classList.add('hidden');

    if (timeMultiplier <= 0) timeMultiplier = 10;
    else timeMultiplier *= 10;

    if (timeMultiplier > 10000) timeMultiplier = 1;
    updateSpeedBadge();
});

// Rewind (-10x -> -100x -> -1000x -> -10000x)
btnRewind.addEventListener('click', () => {
    isTimePaused = false;
    btnPlayPause.classList.add('active');
    iconPause.classList.remove('hidden');
    iconPlay.classList.add('hidden');

    if (timeMultiplier >= 0) timeMultiplier = -10;
    else timeMultiplier *= 10;

    if (timeMultiplier < -10000) timeMultiplier = -1;
    updateSpeedBadge();
});

// Jump back to Current Real Time
btnRealtime.addEventListener('click', () => {
    simulatedTime = new Date();
    timeMultiplier = 1;
    isTimePaused = false;
    updateSpeedBadge();
    Celestial.date(simulatedTime);

    btnPlayPause.classList.add('active');
    iconPause.classList.remove('hidden');
    iconPlay.classList.add('hidden');
});

// Open Date/Time Dialog Panel
btnTimeDialog.addEventListener('click', () => {
    timePanel.classList.toggle('hidden');
    btnTimeDialog.classList.toggle('active');

    // Pre-fill input with currently simulated date
    const localIso = new Date(simulatedTime.getTime() - (simulatedTime.getTimezoneOffset() * 60000))
        .toISOString().slice(0, 16);
    datetimePicker.value = localIso;
});

// Apply Selected Custom Date/Time
document.getElementById('btn-apply-time').addEventListener('click', () => {
    if (datetimePicker.value) {
        simulatedTime = new Date(datetimePicker.value);
        Celestial.date(simulatedTime);
    }
    timePanel.classList.add('hidden');
    btnTimeDialog.classList.remove('active');
});

document.getElementById('btn-now-time').addEventListener('click', () => {
    simulatedTime = new Date();
    Celestial.date(simulatedTime);
    timePanel.classList.add('hidden');
    btnTimeDialog.classList.remove('active');
});

// ----------------------------------------------------
// 5. DISPLAY TOGGLES & RESIZE
// ----------------------------------------------------
const btnConstellations = document.getElementById('btn-constellations');
const btnNames = document.getElementById('btn-names');
const btnGrid = document.getElementById('btn-grid');
const btnClouds = document.getElementById('btn-clouds');
const cloudPanel = document.getElementById('cloud-panel');

let showLines = true;
let showNames = true;
let showGrid = true;

btnConstellations.addEventListener('click', () => {
    showLines = !showLines;
    btnConstellations.classList.toggle('active', showLines);
    Celestial.sky.constellations.lines = showLines;
    Celestial.reload();
});

btnNames.addEventListener('click', () => {
    showNames = !showNames;
    btnNames.classList.toggle('active', showNames);
    Celestial.sky.stars.names = showNames;
    Celestial.sky.constellations.names = showNames;
    Celestial.reload();
});

btnGrid.addEventListener('click', () => {
    showGrid = !showGrid;
    btnGrid.classList.toggle('active', showGrid);
    Celestial.sky.grid.show = showGrid;
    Celestial.reload();
});

btnClouds.addEventListener('click', () => {
    cloudPanel.classList.toggle('hidden');
    btnClouds.classList.toggle('active');
});

document.getElementById('cloud-opacity').addEventListener('input', (e) => {
    cloudCanvas.style.opacity = e.target.value;
});

document.getElementById('cloud-speed').addEventListener('input', (e) => {
    driftSpeed = parseFloat(e.target.value);
});

window.addEventListener('resize', () => {
    resizeCloudCanvas();
    Celestial.resize({ width: window.innerWidth, height: window.innerHeight });
});

// Start loop
resizeCloudCanvas();
requestAnimationFrame(mainLoop);
