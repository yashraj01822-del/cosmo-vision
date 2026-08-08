// ----------------------------------------------------
// 1. REAL CELESTIAL MAP INITIALIZATION
// ----------------------------------------------------
const celestialConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    projection: "orthographic", // Spherical globe sky view like Stellarium
    transform: "equatorial",
    center: [0, 20, 0],         // Initial sky target [RA, Dec, Roll]
    orientation: "down",
    follow: "zenith",
    geopos: null,

    // Real Star Data Settings
    stars: {
        show: true,
        limit: 6,               // Show visible stars up to magnitude 6
        colors: true,            // Real stellar spectral classification colors
        names: true,            // Display major star names
        propername: true,
        namelimit: 2.5,
        size: 5,
        data: 'stars.6.json'    // Real astronomical dataset from CDN
    },

    // Constellations
    constellations: {
        show: true,
        names: true,
        lines: true,
        linewidth: 1,
        lineStyle: { stroke: "rgba(138, 180, 248, 0.4)", width: 1, dash: [2, 2] },
        bounds: false
    },

    // Planets and Deep Space
    planets: { show: true, names: true, colors: true },
    dsos: { show: true, limit: 4 },

    // Interactive Controls
    interactive: true,
    controls: true,
    datapath: "https://cdn.jsdelivr.net/gh/ofrohn/d3-celestial@master/data/"
};

// Render real sky map
Celestial.display(celestialConfig);

// ----------------------------------------------------
// 2. DUMMY CLOUD OVERLAY ENGINE
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

    // Dynamic atmospheric haze gradient
    const mainGradient = cloudCtx.createRadialGradient(
        width / 2 + Math.sin(offset) * 120,
        height / 2 + Math.cos(offset) * 60,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
    );
    mainGradient.addColorStop(0, 'rgba(180, 200, 230, 0.35)');
    mainGradient.addColorStop(0.5, 'rgba(90, 110, 140, 0.2)');
    mainGradient.addColorStop(1, 'rgba(5, 10, 20, 0.6)');

    cloudCtx.fillStyle = mainGradient;
    cloudCtx.fillRect(0, 0, width, height);

    // Render moving cloud clusters
    for (let i = 0; i < 6; i++) {
        const cx = ((width * 0.25 * i) + (offset * 120 * (i + 1))) % (width + 600) - 300;
        const cy = ((height * 0.3 * i) + Math.sin(offset + i) * 100) % (height + 400) - 200;
        
        const cloudGradient = cloudCtx.createRadialGradient(cx, cy, 20, cx, cy, 320);
        cloudGradient.addColorStop(0, 'rgba(210, 225, 250, 0.3)');
        cloudGradient.addColorStop(0.6, 'rgba(120, 140, 170, 0.15)');
        cloudGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        cloudCtx.fillStyle = cloudGradient;
        cloudCtx.beginPath();
        cloudCtx.arc(cx, cy, 320, 0, Math.PI * 2);
        cloudCtx.fill();
    }
}

function animateClouds() {
    cloudOffset += driftSpeed;
    renderClouds(cloudOffset);
    requestAnimationFrame(animateClouds);
}

// ----------------------------------------------------
// 3. EVENT LISTENERS
// ----------------------------------------------------
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
animateClouds();
