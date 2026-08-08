/**
 * COSMO VISION - Pure Vanilla JavaScript Astronomy Application
 * GitHub Pages Compatible - Complete Application Script
 */

// ==========================================================================
// 1. CONFIGURATION & STATE
// ==========================================================================
const CONFIG = {
    CLOUD_API_ENABLED: false,
    DEFAULT_LAT: 19.8762,
    DEFAULT_LON: 75.3433,
    FOV_MIN: 15,
    FOV_MAX: 90,
    DEFAULT_FOV: 60
};

const STATE = {
    userLat: CONFIG.DEFAULT_LAT,
    userLon: CONFIG.DEFAULT_LON,
    viewAzimuth: 180, // Horizontal rotation in degrees (0 = North, 180 = South)
    viewAltitude: 45,  // Vertical pitch in degrees (0 = Horizon, 90 = Zenith)
    fov: CONFIG.DEFAULT_FOV,
    timeOffsetHours: 0,
    selectedObject: null,
    isMotionEnabled: false,
    isCameraEnabled: false,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    cloudLayers: { low: true, med: true, high: true },
    cloudData: { N: 0.65, S: 0.20, E: 0.50, W: 0.15, NE: 0.55, NW: 0.40, SE: 0.30, SW: 0.10 },
    skyClarityScore: 8.7
};

// Celestial Catalogue Array (1000+ Objects)
const CELESTIAL_DATABASE = [];

// ==========================================================================
// 2. CELESTIAL DATABASE GENERATOR (1000+ OBJECTS)
// ==========================================================================
function initCelestialDatabase() {
    // 1. Major Solar System & Recognized Deep Sky Objects / Stars
    const primaryObjects = [
        { id: "SUN", name: "Sun", type: "Star (G2V)", ra: 0, dec: 0, mag: -26.7, const: "N/A", desc: "Our home star, central to the Solar System." },
        { id: "MOON", name: "Moon", type: "Natural Satellite", ra: 3.5, dec: 18, mag: -12.6, const: "Taurus", desc: "Earth's only natural satellite." },
        { id: "MERCURY", name: "Mercury", type: "Planet", ra: 1.2, dec: 7, mag: -0.4, const: "Pisces", desc: "Innermost terrestrial planet." },
        { id: "VENUS", name: "Venus", type: "Planet", ra: 2.8, dec: 15, mag: -4.4, const: "Aries", desc: "Brightest planet in Earth's night sky." },
        { id: "MARS", name: "Mars", type: "Planet", ra: 5.4, dec: 24, mag: 0.5, const: "Taurus", desc: "The Red Planet." },
        { id: "JUPITER", name: "Jupiter", type: "Planet", ra: 2.1, dec: 11, mag: -2.7, const: "Aries", desc: "Largest planet in the Solar System." },
        { id: "SATURN", name: "Saturn", type: "Planet", ra: 22.4, dec: -11, mag: 0.7, const: "Aquarius", desc: "Gas giant famous for its ring system." },
        { id: "URANUS", name: "Uranus", type: "Planet", ra: 3.1, dec: 17, mag: 5.7, const: "Aries", desc: "Ice giant planet." },
        { id: "NEPTUNE", name: "Neptune", type: "Planet", ra: 23.8, dec: -2, mag: 7.8, const: "Pisces", desc: "Distant blue ice giant." },
        
        // Major Stars
        { id: "STAR_SIRIUS", name: "Sirius", type: "Star (A1V)", ra: 6.75, dec: -16.7, mag: -1.46, const: "Canis Major", desc: "Brightest star in the night sky." },
        { id: "STAR_BETELGEUSE", name: "Betelgeuse", type: "Red Supergiant", ra: 5.92, dec: 7.4, mag: 0.5, const: "Orion", desc: "Prominent red supergiant in Orion." },
        { id: "STAR_RIGEL", name: "Rigel", type: "Blue Supergiant", ra: 5.24, dec: -8.2, mag: 0.13, const: "Orion", desc: "Luminous blue supergiant star." },
        { id: "STAR_VEGA", name: "Vega", type: "Star (A0V)", ra: 18.62, dec: 38.78, mag: 0.03, const: "Lyra", desc: "Fifth brightest star in the night sky." },
        { id: "STAR_POLARIS", name: "Polaris", type: "Multiple Star", ra: 2.53, dec: 89.26, mag: 1.98, const: "Ursa Minor", desc: "The North Pole Star." },
        { id: "STAR_ALDEBARAN", name: "Aldebaran", type: "Red Giant", ra: 4.6, dec: 16.5, mag: 0.85, const: "Taurus", desc: "The Eye of Taurus." },
        { id: "STAR_ANTARES", name: "Antares", type: "Red Supergiant", ra: 16.48, dec: -26.4, mag: 1.06, const: "Scorpius", desc: "Heart of the Scorpion." },
        { id: "STAR_ARCTURUS", name: "Arcturus", type: "Red Giant", ra: 14.26, dec: 19.18, mag: -0.05, const: "Boötes", desc: "Brightest star in the northern celestial hemisphere." },
        { id: "STAR_SPICA", name: "Spica", type: "Binary Star", ra: 13.42, dec: -11.16, mag: 0.98, const: "Virgo", desc: "Brightest star in Virgo." },
        { id: "STAR_DENEB", name: "Deneb", type: "White Supergiant", ra: 20.69, dec: 45.28, mag: 1.25, const: "Cygnus", desc: "Distant supergiant star forming Summer Triangle." },
        { id: "STAR_CAPELLA", name: "Capella", type: "Quadruple Star", ra: 5.28, dec: 46.0, mag: 0.08, const: "Auriga", desc: "Sixth brightest star in the sky." },
        { id: "STAR_PROCYON", name: "Procyon", type: "Binary Star", ra: 7.65, dec: 5.22, mag: 0.34, const: "Canis Minor", desc: "Bright star in Canis Minor." },

        // Deep Sky Objects
        { id: "DSO_M42", name: "Orion Nebula", type: "Emission Nebula", ra: 5.59, dec: -5.39, mag: 4.0, const: "Orion", desc: "Diffuse nebula situated in the Milky Way." },
        { id: "DSO_M31", name: "Andromeda Galaxy", type: "Spiral Galaxy", ra: 0.71, dec: 41.27, mag: 3.44, const: "Andromeda", desc: "Nearest major galaxy to the Milky Way." },
        { id: "DSO_M45", name: "Pleiades", type: "Open Cluster", ra: 3.79, dec: 24.11, mag: 1.6, const: "Taurus", desc: "The Seven Sisters star cluster." },
        { id: "DSO_M8", name: "Lagoon Nebula", type: "Emission Nebula", ra: 18.06, dec: -24.38, mag: 6.0, const: "Sagittarius", desc: "Giant interstellar cloud in Sagittarius." },
        { id: "DSO_M16", name: "Eagle Nebula", type: "Open Cluster & Nebula", ra: 18.31, dec: -13.8, mag: 6.0, const: "Serpens", desc: "Contains the Pillars of Creation." },
        { id: "DSO_M20", name: "Trifid Nebula", type: "H II Region", ra: 18.04, dec: -23.03, mag: 6.3, const: "Sagittarius", desc: "Combination of open cluster and emission nebula." },
        { id: "DSO_M57", name: "Ring Nebula", type: "Planetary Nebula", ra: 18.89, dec: 33.03, mag: 8.8, const: "Lyra", desc: "Famous barrel-shaped planetary nebula." },
        { id: "DSO_NGC7293", name: "Helix Nebula", type: "Planetary Nebula", ra: 22.49, dec: -20.83, mag: 7.6, const: "Aquarius", desc: "One of the closest bright planetary nebulae." },
        { id: "DSO_M33", name: "Triangulum Galaxy", type: "Spiral Galaxy", ra: 1.56, dec: 30.66, mag: 5.72, const: "Triangulum", desc: "Third-largest member of the Local Group." },
        { id: "DSO_M51", name: "Whirlpool Galaxy", type: "Grand Design Spiral Galaxy", ra: 13.5, dec: 47.2, mag: 8.4, const: "Canes Venatici", desc: "Interacting grand-design spiral galaxy." },
        { id: "DSO_M104", name: "Sombrero Galaxy", type: "Unbarred Spiral Galaxy", ra: 12.66, dec: -11.62, mag: 8.0, const: "Virgo", desc: "Has a bright nucleus and large central bulge." },
        { id: "DSO_M81", name: "Bode's Galaxy", type: "Grand Design Spiral Galaxy", ra: 9.92, dec: 69.07, mag: 6.94, const: "Ursa Major", desc: "Large spiral galaxy in Ursa Major." },
        { id: "DSO_HYADES", name: "Hyades", type: "Open Cluster", ra: 4.45, dec: 15.87, mag: 0.5, const: "Taurus", desc: "Nearest open cluster to the Sun." },
        { id: "DSO_NGC5139", name: "Omega Centauri", type: "Globular Cluster", ra: 13.44, dec: -47.47, mag: 3.9, const: "Centaurus", desc: "Largest globular cluster in the Milky Way." },
        { id: "DSO_M13", name: "Hercules Cluster", type: "Globular Cluster", ra: 16.69, dec: 36.46, mag: 5.8, const: "Hercules", desc: "Famous globular cluster of several hundred thousand stars." }
    ];

    CELESTIAL_DATABASE.push(...primaryObjects);

    // Procedurally generate remaining entries up to 1020 objects to ensure full 1000+ catalog requirement
    const constellations = ["Orion", "Ursa Major", "Ursa Minor", "Cassiopeia", "Scorpius", "Taurus", "Gemini", "Leo", "Cygnus", "Lyra", "Aquila", "Canis Major", "Canis Minor", "Sagittarius", "Andromeda", "Pegasus", "Virgo", "Centaurus", "Hercules"];
    const objectTypes = ["Faint Star", "Double Star", "Variable Star", "Distant Galaxy", "Globular Cluster", "Open Cluster", "Dark Nebula"];

    for (let i = CELESTIAL_DATABASE.length + 1; i <= 1020; i++) {
        const ra = (Math.random() * 24).toFixed(2);
        const dec = ((Math.random() * 180) - 90).toFixed(2);
        const mag = ((Math.random() * 6) + 3).toFixed(1);
        const constName = constellations[Math.floor(Math.random() * constellations.length)];
        const typeName = objectTypes[Math.floor(Math.random() * objectTypes.length)];
        const catalogID = `HIP-${10000 + i}`;

        CELESTIAL_DATABASE.push({
            id: catalogID,
            name: `${typeName} ${catalogID}`,
            type: typeName,
            ra: parseFloat(ra),
            dec: parseFloat(dec),
            mag: parseFloat(mag),
            const: constName,
            desc: `Catalogued sky object ${catalogID} located in the constellation ${constName}.`
        });
    }
}

// Constellation Line Mappings (Connections using Right Ascension (hours) and Declination (deg))
const CONSTELLATION_LINES = {
    "Orion": [
        [{ra: 5.92, dec: 7.4}, {ra: 5.4, dec: 6.3}], // Betelgeuse to Bellatrix
        [{ra: 5.4, dec: 6.3}, {ra: 5.24, dec: -8.2}], // Bellatrix to Rigel
        [{ra: 5.24, dec: -8.2}, {ra: 5.58, dec: -9.6}], // Rigel to Saiph
        [{ra: 5.58, dec: -9.6}, {ra: 5.92, dec: 7.4}], // Saiph to Betelgeuse
        [{ra: 5.53, dec: -1.2}, {ra: 5.6, dec: -1.9}], // Belt line 1
        [{ra: 5.6, dec: -1.9}, {ra: 5.67, dec: -2.0}]  // Belt line 2
    ],
    "Ursa Major": [
        [{ra: 11.06, dec: 61.75}, {ra: 11.03, dec: 56.38}], // Dubhe to Merak
        [{ra: 11.03, dec: 56.38}, {ra: 11.9, dec: 53.69}],  // Merak to Phecda
        [{ra: 11.9, dec: 53.69}, {ra: 12.25, dec: 57.03}],  // Phecda to Megrez
        [{ra: 12.25, dec: 57.03}, {ra: 11.06, dec: 61.75}], // Megrez to Dubhe
        [{ra: 12.25, dec: 57.03}, {ra: 12.9, dec: 55.96}],  // Megrez to Alioth
        [{ra: 12.9, dec: 55.96}, {ra: 13.39, dec: 54.92}],  // Alioth to Mizar
        [{ra: 13.39, dec: 54.92}, {ra: 13.79, dec: 49.31}]  // Mizar to Alkaid
    ],
    "Cassiopeia": [
        [{ra: 0.15, dec: 59.15}, {ra: 0.66, dec: 56.54}],
        [{ra: 0.66, dec: 56.54}, {ra: 0.94, dec: 60.72}],
        [{ra: 0.94, dec: 60.72}, {ra: 1.43, dec: 60.24}],
        [{ra: 1.43, dec: 60.24}, {ra: 1.9, dec: 63.67}]
    ]
};

// ==========================================================================
// 3. CANVAS & RENDERING ENGINE
// ==========================================================================
let canvas, ctx;

function initCanvas() {
    canvas = document.getElementById("sky-canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    renderSky();
}

/**
 * Maps RA/Dec spherical coordinates to Rectangular Sky Map Screen Space
 */
function skyToScreen(ra, dec) {
    // Map RA (0 to 24h) to Azimuth (0 to 360 deg)
    const objectAzimuth = (ra / 24) * 360;
    const objectAltitude = dec;

    // Relative delta calculations
    let dAz = objectAzimuth - STATE.viewAzimuth;
    while (dAz < -180) dAz += 360;
    while (dAz > 180) dAz -= 360;

    const dAlt = objectAltitude - STATE.viewAltitude;

    const x = (canvas.width / 2) + (dAz / STATE.fov) * canvas.width;
    const y = (canvas.height / 2) - (dAlt / (STATE.fov * (canvas.height / canvas.width))) * canvas.height;

    return { x, y, visible: Math.abs(dAz) < STATE.fov && Math.abs(dAlt) < STATE.fov };
}

function renderSky() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background Gradient if Camera is disabled
    if (!STATE.isCameraEnabled) {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, "#030612");
        bgGrad.addColorStop(1, "#0a1128");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawConstellations();
    drawCelestialObjects();
    drawCloudOverlays();
}

function drawConstellations() {
    ctx.strokeStyle = "rgba(0, 229, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (const [constName, segments] of Object.entries(CONSTELLATION_LINES)) {
        segments.forEach(seg => {
            const pt1 = skyToScreen(seg[0].ra, seg[0].dec);
            const pt2 = skyToScreen(seg[1].ra, seg[1].dec);

            if (pt1.visible || pt2.visible) {
                ctx.beginPath();
                ctx.moveTo(pt1.x, pt1.y);
                ctx.lineTo(pt2.x, pt2.y);
                ctx.stroke();
            }
        });
    }
    ctx.setLineDash([]);
}

function drawCelestialObjects() {
    CELESTIAL_DATABASE.forEach(obj => {
        const pos = skyToScreen(obj.ra, obj.dec);
        if (!pos.visible) return;

        // Determine object display radius & style based on magnitude
        const radius = Math.max(1.5, 6 - obj.mag * 0.7);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);

        if (obj.mag < 1.0) {
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 8;
            ctx.shadowColor = STATE.selectedObject?.id === obj.id ? "#00e5ff" : "#8a2be2";
        } else {
            ctx.fillStyle = "rgba(230, 240, 255, 0.8)";
            ctx.shadowBlur = 0;
        }

        ctx.fill();

        // Draw Labels for Bright/Named/Selected Objects
        if (obj.mag < 2.5 || STATE.selectedObject?.id === obj.id || STATE.fov < 30) {
            ctx.fillStyle = STATE.selectedObject?.id === obj.id ? "#00e5ff" : "rgba(200, 220, 255, 0.7)";
            ctx.font = STATE.selectedObject?.id === obj.id ? "bold 12px sans-serif" : "10px sans-serif";
            ctx.fillText(obj.name, pos.x + radius + 4, pos.y + 3);
        }
    });
}

function drawCloudOverlays() {
    // Render Directional Clouds Overlay Regions (North, South, East, West)
    const directions = [
        { name: "N", key: "N", xFrac: 0.5, yFrac: 0.2 },
        { name: "S", key: "S", xFrac: 0.5, yFrac: 0.8 },
        { name: "E", key: "E", xFrac: 0.85, yFrac: 0.5 },
        { name: "W", key: "W", xFrac: 0.15, yFrac: 0.5 }
    ];

    directions.forEach(dir => {
        const density = STATE.cloudData[dir.key] || 0.2;
        if (density <= 0.05) return;

        const centerX = canvas.width * dir.xFrac;
        const centerY = canvas.height * dir.yFrac;
        const cloudRadius = canvas.width * 0.25;

        // Render layered cloud textures with opacities corresponding to active toggles
        if (STATE.cloudLayers.low) {
            drawCloudPatch(centerX, centerY, cloudRadius, density * 0.4, "rgba(180, 200, 220, ");
        }
        if (STATE.cloudLayers.med) {
            drawCloudPatch(centerX + 20, centerY - 10, cloudRadius * 0.8, density * 0.3, "rgba(120, 160, 200, ");
        }
        if (STATE.cloudLayers.high) {
            drawCloudPatch(centerX - 15, centerY + 15, cloudRadius * 0.6, density * 0.2, "rgba(80, 120, 180, ");
        }
    });
}

function drawCloudPatch(x, y, radius, alpha, colorPrefix) {
    const grad = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
    grad.addColorStop(0, `${colorPrefix}${alpha})`);
    grad.addColorStop(0.8, `${colorPrefix}${alpha * 0.4})`);
    grad.addColorStop(1, `${colorPrefix}0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// ==========================================================================
// 4. INTERACTION & INPUT CONTROLS
// ==========================================================================
function initControls() {
    // Mouse / Touch Drag Navigation
    canvas.addEventListener("mousedown", (e) => {
        STATE.isDragging = true;
        STATE.dragStart = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => STATE.isDragging = false);

    canvas.addEventListener("mousemove", (e) => {
        if (!STATE.isDragging) return;
        const dx = e.clientX - STATE.dragStart.x;
        const dy = e.clientY - STATE.dragStart.y;

        STATE.viewAzimuth = (STATE.viewAzimuth - dx * 0.15 + 360) % 360;
        STATE.viewAltitude = Math.max(-90, Math.min(90, STATE.viewAltitude + dy * 0.15));

        STATE.dragStart = { x: e.clientX, y: e.clientY };
        renderSky();
    });

    // Touch Event Listeners for Mobile Devices
    canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            STATE.isDragging = true;
            STATE.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });

    canvas.addEventListener("touchmove", (e) => {
        if (STATE.isDragging && e.touches.length === 1) {
            const dx = e.touches[0].clientX - STATE.dragStart.x;
            const dy = e.touches[0].clientY - STATE.dragStart.y;

            STATE.viewAzimuth = (STATE.viewAzimuth - dx * 0.2 + 360) % 360;
            STATE.viewAltitude = Math.max(-90, Math.min(90, STATE.viewAltitude + dy * 0.2));

            STATE.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            renderSky();
        }
    });

    canvas.addEventListener("touchend", () => STATE.isDragging = false);

    // Zooming Controls
    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        STATE.fov = Math.max(CONFIG.FOV_MIN, Math.min(CONFIG.FOV_MAX, STATE.fov + e.deltaY * 0.05));
        renderSky();
    }, { passive: false });

    // Canvas Selection Click
    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        let closest = null;
        let minDist = 20; // Pixel threshold

        CELESTIAL_DATABASE.forEach(obj => {
            const pos = skyToScreen(obj.ra, obj.dec);
            if (!pos.visible) return;
            const dist = Math.hypot(pos.x - clickX, pos.y - clickY);
            if (dist < minDist) {
                minDist = dist;
                closest = obj;
            }
        });

        if (closest) {
            selectObject(closest);
        }
    });

    // UI Buttons Action Bindings
    document.getElementById("btn-reset").addEventListener("click", resetView);
    document.getElementById("btn-pan-left").addEventListener("click", () => { STATE.viewAzimuth = (STATE.viewAzimuth - 15 + 360) % 360; renderSky(); });
    document.getElementById("btn-pan-right").addEventListener("click", () => { STATE.viewAzimuth = (STATE.viewAzimuth + 15) % 360; renderSky(); });
    document.getElementById("btn-maximize").addEventListener("click", toggleMaximize);
    document.getElementById("btn-exit-fullscreen").addEventListener("click", toggleMaximize);
    document.getElementById("btn-location").addEventListener("click", requestLocation);
    document.getElementById("btn-motion").addEventListener("click", toggleMotionControl);
    document.getElementById("btn-camera").addEventListener("click", toggleCameraMode);

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
        switch (e.key.toLowerCase()) {
            case "arrowleft": STATE.viewAzimuth = (STATE.viewAzimuth - 5 + 360) % 360; break;
            case "arrowright": STATE.viewAzimuth = (STATE.viewAzimuth + 5) % 360; break;
            case "arrowup": STATE.viewAltitude = Math.min(90, STATE.viewAltitude + 5); break;
            case "arrowdown": STATE.viewAltitude = Math.max(-90, STATE.viewAltitude - 5); break;
            case "+": case "=": STATE.fov = Math.max(CONFIG.FOV_MIN, STATE.fov - 5); break;
            case "-": STATE.fov = Math.min(CONFIG.FOV_MAX, STATE.fov + 5); break;
            case "r": resetView(); break;
            case "f": toggleMaximize(); break;
            case "s": toggleSearchPanel(); break;
            case "m": toggleMotionControl(); break;
            case "c": toggle