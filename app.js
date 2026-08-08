/* =====================================
   COSMO VISION
   Main Application
===================================== */


/* ---------- CELESTIAL DATABASE ---------- */

const knownObjects = [

    {
        name: "Sun",
        type: "STAR",
        ra: 0,
        dec: 0,
        description: "The star at the center of our Solar System."
    },

    {
        name: "Moon",
        type: "MOON",
        ra: 6,
        dec: 20,
        description: "Earth's natural satellite."
    },

    {
        name: "Mercury",
        type: "PLANET",
        ra: 8,
        dec: 5,
        description: "The smallest planet in the Solar System."
    },

    {
        name: "Venus",
        type: "PLANET",
        ra: 10,
        dec: 12,
        description: "The second planet from the Sun."
    },

    {
        name: "Mars",
        type: "PLANET",
        ra: 12,
        dec: -5,
        description: "The red planet."
    },

    {
        name: "Jupiter",
        type: "PLANET",
        ra: 15,
        dec: -10,
        description: "The largest planet in our Solar System."
    },

    {
        name: "Saturn",
        type: "PLANET",
        ra: 18,
        dec: -15,
        description: "The famous ringed planet."
    },

    {
        name: "Sirius",
        type: "STAR",
        ra: 6.75,
        dec: -16.7,
        description: "The brightest star in Earth's night sky."
    },

    {
        name: "Betelgeuse",
        type: "STAR",
        ra: 5.92,
        dec: 7.4,
        description: "A red supergiant in Orion."
    },

    {
        name: "Rigel",
        type: "STAR",
        ra: 5.24,
        dec: -8.2,
        description: "A blue supergiant in Orion."
    },

    {
        name: "Vega",
        type: "STAR",
        ra: 18.62,
        dec: 38.8,
        description: "One of the brightest stars in the northern sky."
    },

    {
        name: "Polaris",
        type: "STAR",
        ra: 2.53,
        dec: 89.2,
        description: "The North Star."
    },

    {
        name: "M31 Andromeda Galaxy",
        type: "GALAXY",
        ra: 0.71,
        dec: 41.3,
        description: "The nearest major galaxy to the Milky Way."
    },

    {
        name: "M42 Orion Nebula",
        type: "NEBULA",
        ra: 5.59,
        dec: -5.45,
        description: "A bright stellar nursery in Orion."
    },

    {
        name: "M45 Pleiades",
        type: "STAR CLUSTER",
        ra: 3.79,
        dec: 24.1,
        description: "A famous open star cluster."
    },

    {
        name: "M13 Hercules Cluster",
        type: "GLOBULAR CLUSTER",
        ra: 16.69,
        dec: 36.5,
        description: "A bright globular cluster in Hercules."
    }

];


/* ---------- CREATE LARGE SEARCHABLE CATALOG ---------- */

/*
   Creates a local demonstration catalog containing
   more than 1000 searchable objects.

   For scientifically precise positions, replace this
   catalog later with Gaia / SIMBAD / NASA data.
*/

const objects = [...knownObjects];

for (let i = objects.length; i <= 1200; i++) {

    objects.push({

        name: `Cosmo Object ${i}`,

        type: [
            "STAR",
            "GALAXY",
            "NEBULA",
            "STAR CLUSTER"
        ][i % 4],

        ra: Math.random() * 24,

        dec: Math.random() * 180 - 90,

        description:
            "Celestial object from the Cosmo Vision discovery catalog."

    });

}


/* ---------- CANVAS ---------- */

const canvas = document.getElementById("skyCanvas");

const ctx = canvas.getContext("2d");

let cloudVisible = true;
let starsVisible = true;

function resizeCanvas() {

    canvas.width = canvas.clientWidth * devicePixelRatio;

    canvas.height = canvas.clientHeight * devicePixelRatio;

    ctx.scale(devicePixelRatio, devicePixelRatio);

    drawSky();
}

window.addEventListener("resize", resizeCanvas);


/* ---------- STARS ---------- */

let stars = [];

for (let i = 0; i < 450; i++) {

    stars.push({

        x: Math.random(),
        y: Math.random(),

        size: Math.random() * 2 + .3,

        brightness: Math.random()

    });

}


/* ---------- SKY DRAWING ---------- */

function drawSky() {

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    ctx.clearRect(0,0,w,h);


    /* Background */

    const gradient =
        ctx.createRadialGradient(
            w/2,
            h/2,
            20,
            w/2,
            h/2,
            w
        );

    gradient.addColorStop(0, "#162c50");
    gradient.addColorStop(0.5, "#081226");
    gradient.addColorStop(1, "#02040b");

    ctx.fillStyle = gradient;

    ctx.fillRect(0,0,w,h);


    /* Stars */

    if (starsVisible) {

        stars.forEach(star => {

            ctx.beginPath();

            ctx.arc(
                star.x * w,
                star.y * h,
                star.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(255,255,255,${.35 + star.brightness * .65})`;

            ctx.fill();

        });

    }


    /* Important objects */

    drawPlanet(w*.76, h*.34, 9, "#d9d9d9", "Venus");

    drawPlanet(w*.46, h*.48, 7, "#ffcb78", "Jupiter");

    drawPlanet(w*.25, h*.27, 6, "#f0f0e8", "Polaris");


    /* Clouds */

    if (cloudVisible) {

        drawClouds(w,h);

    }

}


/* ---------- CLOUD LAYER ---------- */

function drawClouds(w,h) {

    /*
       Cloud banks deliberately leave transparent
       holes so stars remain visible.
    */

    const cloudGradient =
        ctx.createLinearGradient(0,0,w,0);

    cloudGradient.addColorStop(
        0,
        "rgba(120,135,165,.48)"
    );

    cloudGradient.addColorStop(
        .35,
        "rgba(100,120,150,.20)"
    );

    cloudGradient.addColorStop(
        .55,
        "rgba(100,120,150,0)"
    );

    cloudGradient.addColorStop(
        .75,
        "rgba(100,120,150,.35)"
    );

    cloudGradient.addColorStop(
        1,
        "rgba(120,135,165,.55)"
    );


    ctx.fillStyle = cloudGradient;

    ctx.beginPath();

    ctx.moveTo(0,h*.18);

    ctx.bezierCurveTo(
        w*.12,h*.05,
        w*.25,h*.30,
        w*.38,h*.15
    );

    ctx.bezierCurveTo(
        w*.52,h*.05,
        w*.62,h*.20,
        w*.75,h*.12
    );

    ctx.bezierCurveTo(
        w*.88,h*.03,
        w*.95,h*.20,
        w,h*.10
    );

    ctx.lineTo(w,0);

    ctx.lineTo(0,0);

    ctx.closePath();

    ctx.fill();


    /* Lower cloud bank */

    ctx.fillStyle =
        "rgba(100,120,150,.27)";

    ctx.beginPath();

    ctx.moveTo(0,h);

    ctx.bezierCurveTo(
        w*.15,h*.75,
        w*.27,h*.90,
        w*.40,h*.80
    );

    ctx.bezierCurveTo(
        w*.58,h*.92,
        w*.70,h*.73,
        w*.82,h*.85
    );

    ctx.bezierCurveTo(
        w*.92,h*.74,
        w*.97,h*.87,
        w,h*.78
    );

    ctx.lineTo(w,h);

    ctx.closePath();

    ctx.fill();

}


/* ---------- PLANETS ---------- */

function drawPlanet(x,y,size,color,label) {

    ctx.beginPath();

    ctx.arc(x,y,size,0,Math.PI*2);

    ctx.fillStyle = color;

    ctx.shadowBlur = 15;

    ctx.shadowColor = color;

    ctx.fill();

    ctx.shadowBlur = 0;


    if (starsVisible) {

        ctx.fillStyle = "white";

        ctx.font = "11px Arial";

        ctx.fillText(label,x+12,y+4);

    }

}


/* ---------- SEARCH ---------- */

const searchInput =
    document.getElementById("searchInput");

const results =
    document.getElementById("searchResults");

function searchObjects() {

    const query =
        searchInput.value
        .trim()
        .toLowerCase();

    results.innerHTML = "";

    if (!query) {

        results.style.display = "none";

        return;

    }


    const matches =
        objects
        .filter(obj =>
            obj.name.toLowerCase().includes(query)
        )
        .slice(0,8);


    matches.forEach(obj => {

        const div =
            document.createElement("div");

        div.className = "result";

        div.innerHTML =
            `<b>${obj.name}</b>
             <br>
             <small>${obj.type}</small>`;

        div.onclick = () => showObject(obj);

        results.appendChild(div);

    });


    results.style.display =
        matches.length ? "block" : "none";

}


searchInput.addEventListener(
    "input",
    searchObjects
);

document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        searchObjects
);


/* ---------- OBJECT INFORMATION ---------- */

function showObject(obj) {

    results.style.display = "none";

    document
        .getElementById("objectInfo")
        .classList.remove("hidden");

    document
        .getElementById("objectName")
        .textContent = obj.name;

    document
        .getElementById("objectType")
        .textContent = obj.type;

    document
        .getElementById("objectDescription")
        .textContent = obj.description;

    document
        .getElementById("objectRA")
        .textContent = obj.ra.toFixed(2) + "h";

    document
        .getElementById("objectDEC")
        .textContent = obj.dec.toFixed(2) + "°";

}


document
    .getElementById("closeObject")
    .onclick = () => {

        document
            .getElementById("objectInfo")
            .classList.add("hidden");

    };


/* ---------- CLOUD TOGGLE ---------- */

document
    .getElementById("cloudBtn")
    .onclick = () => {

        cloudVisible = !cloudVisible;

        drawSky();

    };


document
    .getElementById("cloudToggle")
    .onchange = e => {

        cloudVisible = e.target.checked;

        drawSky();

    };


/* ---------- STAR TOGGLE ---------- */

document
    .getElementById("starToggle")
    .onchange = e => {

        starsVisible = e.target.checked;

        drawSky();

    };


/* ---------- SETTINGS ---------- */

const settingsPanel =
    document.getElementById("settingsPanel");

function openSettings() {

    settingsPanel.classList.add("open");

}

function closeSettings() {

    settingsPanel.classList.remove("open");

}

document
    .getElementById("settingsBtn")
    .onclick = openSettings;

document
    .getElementById("settingsNavBtn")
    .onclick = openSettings;

document
    .getElementById("closeSettings")
    .onclick = closeSettings;


/* ---------- LOCATION ---------- */

function getLocation() {

    if (!navigator.geolocation) {

        alert("Location is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude.toFixed(3);

            const lon =
                position.coords.longitude.toFixed(3);

            alert(
                `Cosmo Vision location:\nLatitude: ${lat}\nLongitude: ${lon}`
            );

        },

        () => {

            alert("Location permission was denied.");

        }

    );

}

document
    .getElementById("locationBtn")
    .onclick = getLocation;

document
    .getElementById("locationPermission")
    .onclick = getLocation;


/* ---------- CAMERA / AR ---------- */

const cameraScreen =
    document.getElementById("cameraScreen");

const video =
    document.getElementById("camera");


async function openCamera() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                },
                audio: false
            });

        video.srcObject = stream;

        cameraScreen.classList.add("active");

    }

    catch(error) {

        alert(
            "Camera permission is required for AR Sky."
        );

    }

}


function closeCamera() {

    if (video.srcObject) {

        video.srcObject
            .getTracks()
            .forEach(track => track.stop());

    }

    cameraScreen.classList.remove("active");

}


document
    .getElementById("arBtn")
    .onclick = openCamera;

document
    .getElementById("arNavBtn")
    .onclick = openCamera;

document
    .getElementById("cameraPermission")
    .onclick = openCamera;

document
    .getElementById("closeCamera")
    .onclick = closeCamera;


/* ---------- TIMELINE ---------- */

const slider =
    document.getElementById("timeSlider");

slider.addEventListener("input", () => {

    const value =
        Number(slider.value);

    let text;

    if (value === 0) {

        text = "Tonight — Now";

    } else if (value > 0) {

        text = `Tonight +${value}h`;

    } else {

        text = `Tonight ${value}h`;

    }

    document
        .getElementById("timeDisplay")
        .textContent = text;

});


/* ---------- ORIENTATION ---------- */

document
    .getElementById("orientationToggle")
    .onchange = async e => {

        if (!e.target.checked) return;

        if (
            typeof DeviceOrientationEvent !==
            "undefined" &&
            typeof DeviceOrientationEvent
                .requestPermission === "function"
        ) {

            try {

                await DeviceOrientationEvent
                    .requestPermission();

            }

            catch {

                alert(
                    "Motion permission was denied."
                );

            }

        }

        window.addEventListener(
            "deviceorientation",
            event => {

                /*
                   This is the foundation for
                   phone-direction tracking.

                   Full astronomical coordinate
                   conversion can be added later.
                */

                const heading =
                    event.alpha || 0;

                document
                    .querySelector(".north")
                    .style.transform =
                    `rotate(${heading}deg)`;

            }
        );

    };


/* ---------- INITIALIZE ---------- */

resizeCanvas();

console.log(
    "Cosmo Vision loaded with",
    objects.length,
    "searchable objects."
);