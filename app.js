// ==========================================
// COSMO VISION - MAIN APPLICATION
// ==========================================

const skyMap = document.getElementById("skyMap");
const starsContainer = document.getElementById("stars");
const cloudLayer = document.getElementById("cloudLayer");


// ==========================================
// GENERATE STARS
// ==========================================

function generateStars() {

    starsContainer.innerHTML = "";

    const numberOfStars = 180;

    for (let i = 0; i < numberOfStars; i++) {

        const star = document.createElement("div");

        star.className = "star";

        // Keep stars inside the circular sky
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 48;

        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;

        const size = Math.random() * 2.5 + 1;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.opacity = Math.random() * 0.7 + 0.3;

        starsContainer.appendChild(star);
    }
}

generateStars();


// ==========================================
// CLOUD TOGGLE
// ==========================================

const cloudToggle = document.getElementById("cloudToggle");

let cloudsVisible = true;

cloudToggle.addEventListener("click", () => {

    cloudsVisible = !cloudsVisible;

    cloudLayer.style.opacity = cloudsVisible ? "1" : "0";

    cloudToggle.textContent =
        cloudsVisible ? "☁️ Clouds" : "☁️ Clouds OFF";
});


// ==========================================
// CONSTELLATION TOGGLE
// ==========================================

const constellationToggle =
    document.getElementById("constellationToggle");

const constellation =
    document.querySelector(".constellation");

let constellationsVisible = true;

constellationToggle.addEventListener("click", () => {

    constellationsVisible = !constellationsVisible;

    constellation.style.display =
        constellationsVisible ? "block" : "none";

    constellationToggle.textContent =
        constellationsVisible
            ? "✨ Constellations"
            : "✨ Constellations OFF";
});


// ==========================================
// RESET SKY
// ==========================================

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {

    skyMap.style.transform = "rotate(0deg) scale(1)";

    generateStars();

});


// ==========================================
// SKY MAP DRAGGING
// ==========================================

let dragging = false;

let startX = 0;
let startY = 0;

let rotationX = 0;
let rotationY = 0;

skyMap.addEventListener("pointerdown", (event) => {

    dragging = true;

    startX = event.clientX;
    startY = event.clientY;

    skyMap.setPointerCapture(event.pointerId);
});

skyMap.addEventListener("pointermove", (event) => {

    if (!dragging) return;

    const movementX = event.clientX - startX;
    const movementY = event.clientY - startY;

    rotationY += movementX * 0.15;
    rotationX -= movementY * 0.05;

    skyMap.style.transform =
        `perspective(900px)
         rotateX(${rotationX}deg)
         rotateY(${rotationY}deg)`;

    startX = event.clientX;
    startY = event.clientY;
});

skyMap.addEventListener("pointerup", () => {

    dragging = false;

});


// ==========================================
// MOUSE / TOUCH WHEEL ZOOM
// ==========================================

let zoom = 1;

skyMap.addEventListener("wheel", (event) => {

    event.preventDefault();

    if (event.deltaY < 0) {
        zoom += 0.05;
    } else {
        zoom -= 0.05;
    }

    zoom = Math.max(0.8, Math.min(1.6, zoom));

    skyMap.style.transform =
        `scale(${zoom})
         rotateX(${rotationX}deg)
         rotateY(${rotationY}deg)`;
});


// ==========================================
// LOCATION
// ==========================================

const locationBtn =
    document.getElementById("locationBtn");

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported by your browser.");

        return;
    }

    locationBtn.textContent = "📍 Finding...";

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            locationBtn.textContent = "📍 Location Found";

            console.log(
                "Latitude:",
                latitude,
                "Longitude:",
                longitude
            );

            alert(
                `Location found!\n\nLatitude: ${latitude.toFixed(4)}\nLongitude: ${longitude.toFixed(4)}`
            );
        },

        () => {

            locationBtn.textContent = "📍 Location";

            alert(
                "Location permission was not granted."
            );
        }
    );
});


// ==========================================
// SEARCH BUTTON
// ==========================================

const searchBtn =
    document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {

    const object =
        prompt(
            "Search the sky:\n\nTry: Moon, Venus, Orion"
        );

    if (!object) return;

    const search =
        object.toLowerCase();

    if (search.includes("venus")) {

        document.getElementById("venus").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        alert("Venus selected.");

    } else if (search.includes("moon")) {

        document.getElementById("moon").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        alert("Moon selected.");

    } else if (search.includes("orion")) {

        constellation.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        alert("Orion selected.");

    } else {

        alert(
            "Object not found in this prototype."
        );
    }
});


// ==========================================
// DEMO CLOUD DATA
// ==========================================

const cloudData = {

    total: 21,
    low: 12,
    mid: 25,
    high: 18,
    wind: 11,
    direction: "NW"

};

document.getElementById("totalCloud").textContent =
    cloudData.total + "%";

document.getElementById("lowCloud").textContent =
    cloudData.low + "%";

document.getElementById("midCloud").textContent =
    cloudData.mid + "%";

document.getElementById("highCloud").textContent =
    cloudData.high + "%";

document.getElementById("wind").textContent =
    cloudData.wind + " km/h";

document.getElementById("windDirection").textContent =
    cloudData.direction;


// ==========================================
// SKY CLARITY CALCULATION
// ==========================================

function calculateClarity(cloudPercentage) {

    const score =
        10 - (cloudPercentage / 10);

    return Math.max(
        0,
        Math.min(10, score)
    );
}

const clarity =
    calculateClarity(cloudData.total);

document.getElementById("clarityScore").textContent =
    clarity.toFixed(1);

if (clarity >= 8) {

    document.getElementById("conditionText").textContent =
        "Excellent conditions for stargazing";

} else if (clarity >= 6) {

    document.getElementById("conditionText").textContent =
        "Good conditions for stargazing";

} else if (clarity >= 4) {

    document.getElementById("conditionText").textContent =
        "Fair conditions — some clouds expected";

} else {

    document.getElementById("conditionText").textContent =
        "Poor conditions for stargazing";
}


// ==========================================
// DEBUG MESSAGE
// ==========================================

console.log(
    "🌌 Cosmo Vision initialized successfully."
);