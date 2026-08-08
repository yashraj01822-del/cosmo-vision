// ----------------------------------------------------
// 1. CELESTIAL MAP SETUP (Stellarium Blueprint Style)
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

    background: { fill: "transparent", stroke: "#000000", opacity: 0 },

    stars: {
        show: true,
        limit: 6,               
        colors: true,            
        names: true,            
        propername: true,
        namelimit: 2.0,
        size: 5,
        data: 'stars.6.json'    
    },

    constellations: {
        show: true,
        names: true,
        lines: true,
        linewidth: 1.2,
        lineStyle: { stroke: "rgba(138, 180, 248, 0.5)", width: 1.2, dash: [2, 2] },
        bounds: false
    },

    mw: { show: true, style: { fill: "rgba(140, 180, 240, 0.1)" } },

    planets: { show: true, names: true, colors: true },
    dsos: { show: true, limit: 4 },

    interactive: true,
    controls: false, // We use custom mobile bottom bar tools
    datapath: "https://cdn.jsdelivr.net/gh/ofrohn/d3-celestial@master/data/"
};

// Initialize Map
Celestial.display(celestialConfig);

// ----------------------------------------------------
// 2. PROCEDURAL CLOUD OVERLAY CANVAS
// ----------------------------------------------------
const cloudCanvas = document.getElementById('cloud-canvas');
const cloudCtx = cloudCanvas.getContext('2d');

let cloudOffset = 0;
let driftSpeed = 0.001;

function resizeCloudCanvas() {
    cloudCanvas.width = window.innerWidth;
    cloudCanvas.height = window.innerHeight;
}

function renderClouds(offset) {
    const width = cloudCanvas.width;
    const height = cloudCanvas.height;

    cloudCtx.clearRect(0, 0, width, height);

    // Subtle atmospheric haze gradient
    const mainGradient = cloudCtx.createRadialGradient(
        width / 2 + Math.sin(offset) * 100,
        height / 2 + Math.cos(offset) * 50,
        80,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
    );
    mainGradient.addColorStop(0, 'rgba(160, 185, 220, 0.25)');
    mainGradient.addColorStop(0.5, 'rgba(70, 95, 130, 0.12)');
    mainGradient.addColorStop(1, 'rgba(2, 4, 11, 0.4)');

    cloudCtx.fillStyle = mainGradient;
    cloudCtx.fillRect(0, 0, width, height);

    // Drifting cloud formations
    for (let i = 0; i < 6; i++) {
        const cx = ((width * 0.25 * i) + (offset * 130 * (i + 1))) % (width + 600) - 300;
        const cy = ((height * 0.3 * i) + Math.sin(offset + i) * 90) % (height + 400) - 200;
        
        const cloudGradient = cloudCtx.createRadialGradient(cx, cy, 20, cx, cy, 300);
        cloudGradient.addColorStop(0, 'rgba(190, 210, 240, 0.22)');
        cloudGradient.addColorStop(0.6, 'rgba(100, 125, 160, 0.08)');
        cloudGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        cloudCtx.fillStyle = cloudGradient;
        cloudCtx.beginPath();
        cloudCtx.arc(cx, cy, 300, 0, Math.PI * 2);
        cloudCtx.fill();
    }
}

function animateClouds() {
    cloudOffset += driftSpeed;
    renderClouds(cloudOffset);
    requestAnimationFrame(animateClouds);
}

// ----------------------------------------------------
// 3. UI CONTROLS & AR CAMERA MODE
// ----------------------------------------------------
const btnClouds = document.getElementById('btn-clouds');
const cloudPanel = document.getElementById('cloud-panel');
const btnAr = document.getElementById('btn-ar');
const arCameraFeed = document.getElementById('ar-camera-feed');
const celestialContainer = document.getElementById('celestial-map');
let isArActive = false;

// Toggle Cloud Menu
btnClouds.addEventListener('click', () => {
    cloudPanel.classList.toggle('hidden');
    btnClouds.classList.toggle('active');
});

// Toggle AR Camera Sensor Mode
btnAr.addEventListener('click', async () => {
    isArActive = !isArActive;
    btnAr.classList.toggle('active', isArActive);

    if (isArActive) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            arCameraFeed.srcObject = stream;
            arCameraFeed.classList.remove('hidden');
            celestialContainer.style.background = 'transparent'; // Make map transparent over camera
        } catch (err) {
            alert('Camera access denied or unavailable.');
            isArActive = false;
            btnAr.classList.remove('active');
        }
    } else {
        const stream = arCameraFeed.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        arCameraFeed.srcObject = null;
        arCameraFeed.classList.add('hidden');
        celestialContainer.style.background = 'radial-gradient(circle at center, #0c1432 0%, #02040b 100%)';
    }
});

// Sliders
document.getElementById('cloud-opacity').addEventListener('input', (e) => {
    cloudCanvas.style.opacity = e.target.value;
});

document.getElementById('cloud-speed').addEventListener('input', (e) => {
    driftSpeed = parseFloat(e.target.value);
});

// Window resizing
window.addEventListener('resize', () => {
    resizeCloudCanvas();
    Celestial.resize({ width: window.innerWidth, height: window.innerHeight });
});

// Live clock string
setInterval(() => {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const mins = String(now.getUTCMinutes()).padStart(2, '0');
    document.getElementById('time-display').innerText = `${hours}:${mins}`;
}, 1000);

// Initialize App Loops
resizeCloudCanvas();
animateClouds();
