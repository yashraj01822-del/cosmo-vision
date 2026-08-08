* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select: none;
}

body, html {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #02040b;
    font-family: 'Roboto', sans-serif;
    color: #ffffff;
}

/* Full Screen Immersive Container */
#celestial-map {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background: radial-gradient(circle at center, #0c1432 0%, #02040b 100%);
}

/* Clear any boxed constraints from celestial components */
#celestial-map, #celestial-map > div, #celestial-map svg, #celestial-map canvas {
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    clip-path: none !important;
}

/* Hide default d3-celestial border ring */
.d3-celestial-globe {
    stroke: none !important;
    fill: transparent !important;
}

/* AR Camera Feed Layer */
#ar-camera-feed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    z-index: 0;
}

#ar-camera-feed.hidden {
    display: none;
}

/* Horizon Atmosphere Glow */
#horizon-glow {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 30vh;
    background: linear-gradient(to top, rgba(14, 32, 60, 0.5) 0%, rgba(2, 4, 11, 0) 100%);
    pointer-events: none;
    z-index: 2;
}

/* Cloud Canvas Overlay */
#cloud-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 3;
    pointer-events: none;
    opacity: 0.45;
    transition: opacity 0.3s ease;
}

#cloud-canvas.hidden {
    opacity: 0;
}

/* Top Bar Layout */
.top-bar {
    position: absolute;
    top: 15px;
    left: 0;
    width: 100%;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    pointer-events: auto;
}

.top-text-btn {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #ffffff;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    backdrop-filter: blur(5px);
}

.time-readout {
    font-family: monospace;
    font-size: 1rem;
    letter-spacing: 1px;
    color: #cbd5e1;
}

.icon-btn {
    background: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    width: 24px;
    height: 24px;
}

.icon-btn svg {
    width: 100%;
    height: 100%;
}

/* Bottom Toolbar (Stellarium Style Pill) */
.bottom-toolbar {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(10, 16, 28, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 8px 20px;
    border-radius: 35px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
}

.tool-btn {
    background: transparent;
    border: none;
    outline: none;
    color: #94a3b8;
    cursor: pointer;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
}

.tool-btn svg {
    width: 22px;
    height: 22px;
}

.tool-btn:hover {
    color: #ffffff;
}

.tool-btn.active {
    color: #8ab4f8;
    filter: drop-shadow(0 0 6px rgba(138, 180, 248, 0.6));
}