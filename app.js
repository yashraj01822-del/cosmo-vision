/* =====================================================
   COSMO VISION
   CAMERA AR SKY
   ===================================================== */


/* =====================================================
   EXISTING SKY
===================================================== */

const skyMap =
    document.getElementById("skyMap");

const stars =
    document.getElementById("stars");

const cloudLayer =
    document.getElementById("cloudLayer");


/* =====================================================
   CELESTIAL OBJECTS
===================================================== */

let celestialObjects = [

    {
        name: "Sirius",
        catalog: "HIP 32349",
        type: "Star",
        constellation: "Canis Major",
        magnitude: "-1.46",
        description:
            "The brightest star in Earth's night sky."
    },

    {
        name: "Jupiter",
        catalog: "Solar System",
        type: "Planet",
        constellation: "Variable",
        magnitude: "-2.90",
        description:
            "The largest planet in the Solar System."
    },

    {
        name: "Orion",
        catalog: "Constellation",
        type: "Constellation",
        constellation: "Orion",
        magnitude: "—",
        description:
            "One of the most recognizable constellations."
    },

    {
        name: "Pleiades",
        catalog: "M45",
        type: "Open Cluster",
        constellation: "Taurus",
        magnitude: "1.60",
        description:
            "A famous open star cluster."
    },

    {
        name: "Andromeda Galaxy",
        catalog: "M31",
        type: "Galaxy",
        constellation: "Andromeda",
        magnitude: "3.44",
        description:
            "The nearest large galaxy to the Milky Way."
    },

    {
        name: "Orion Nebula",
        catalog: "M42",
        type: "Nebula",
        constellation: "Orion",
        magnitude: "4.00",
        description:
            "A bright stellar nursery."
    },

    {
        name: "Betelgeuse",
        catalog: "Alpha Orionis",
        type: "Star",
        constellation: "Orion",
        magnitude: "0.42",
        description:
            "A red supergiant in Orion."
    },

    {
        name: "Polaris",
        catalog: "Alpha Ursae Minoris",
        type: "Star",
        constellation: "Ursa Minor",
        magnitude: "1.98",
        description:
            "The North Star."
    }

];


const types = [

    "Star",
    "Galaxy",
    "Nebula",
    "Open Cluster",
    "Globular Cluster",
    "Planetary Nebula"

];


const constellations = [

    "Orion",
    "Taurus",
    "Andromeda",
    "Cassiopeia",
    "Cygnus",
    "Lyra",
    "Scorpius",
    "Sagittarius",
    "Leo",
    "Virgo",
    "Ursa Major",
    "Ursa Minor",
    "Gemini",
    "Canis Major",
    "Aquila",
    "Perseus"

];


for (
    let i = 1;
    i <= 1200;
    i++
) {

    celestialObjects.push({

        name:
            `Catalogue Object ${i}`,

        catalog:
            `CV-${String(i).padStart(4,"0")}`,

        type:
            types[
                i % types.length
            ],

        constellation:
            constellations[
                i % constellations.length
            ],

        magnitude:
            (2 + (i % 90) / 10)
                .toFixed(1),

        description:
            "Celestial catalogue object."

    });

}


document.getElementById(
    "objectCount"
).textContent =
    celestialObjects.length + "+";


/* =====================================================
   SEARCH
===================================================== */

const searchInput =
    document.getElementById(
        "objectSearch"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );


searchInput.addEventListener(
    "input",
    function() {

        const query =
            this.value
                .toLowerCase()
                .trim();


        searchResults.innerHTML = "";


        if (!query)
            return;


        const matches =
            celestialObjects
                .filter(
                    object =>
                        object.name
                            .toLowerCase()
                            .includes(query)

                        ||

                        object.catalog
                            .toLowerCase()
                            .includes(query)

                        ||

                        object.type
                            .toLowerCase()
                            .includes(query)

                        ||

                        object.constellation
                            .toLowerCase()
                            .includes(query)
                )
                .slice(0,10);


        matches.forEach(
            object => {

                const item =
                    document.createElement(
                        "button"
                    );


                item.className =
                    "search-result";


                item.innerHTML = `

                    <span class="result-icon">
                        ⭐
                    </span>

                    <div>

                        <strong>
                            ${object.name}
                        </strong>

                        <small>
                            ${object.catalog}
                            •
                            ${object.type}
                            •
                            ${object.constellation}
                        </small>

                    </div>
                `;


                item.onclick =
                    () => {

                        showObject(
                            object
                        );

                        searchResults
                            .innerHTML =
                            "";

                        searchInput.value =
                            object.name;

                    };


                searchResults.appendChild(
                    item
                );

            }
        );

    }
);


function showObject(object) {

    document.getElementById(
        "infoName"
    ).textContent =
        object.name;


    document.getElementById(
        "infoDescription"
    ).textContent =
        object.description;


    document.getElementById(
        "infoType"
    ).textContent =
        object.type;


    document.getElementById(
        "infoCatalog"
    ).textContent =
        object.catalog;


    document.getElementById(
        "infoConstellation"
    ).textContent =
        object.constellation;


    document.getElementById(
        "infoMagnitude"
    ).textContent =
        object.magnitude;

}


/* =====================================================
   STARS
===================================================== */

function createStars() {

    stars.innerHTML = "";


    for (
        let i = 0;
        i < 450;
        i++
    ) {

        const star =
            document.createElement(
                "div"
            );


        star.className =
            "star";


        star.style.left =
            Math.random() * 100 +
            "%";


        star.style.top =
            Math.random() * 100 +
            "%";


        const size =
            Math.random() * 2.5 +
            .5;


        star.style.width =
            size + "px";


        star.style.height =
            size + "px";


        star.style.opacity =
            Math.random() * .8 +
            .2;


        stars.appendChild(
            star
        );

    }

}


createStars();


/* =====================================================
   CLOUD BUTTON
===================================================== */

let cloudsVisible = true;


document
    .getElementById("cloudBtn")
    .onclick =
    function() {

        cloudsVisible =
            !cloudsVisible;


        cloudLayer.style.opacity =
            cloudsVisible
                ? "1"
                : "0";

    };


/* =====================================================
   LABEL BUTTON
===================================================== */

let labelsVisible = true;


document
    .getElementById("labelsBtn")
    .onclick =
    function() {

        labelsVisible =
            !labelsVisible;


        document
            .querySelectorAll(
                ".sky-object"
            )
            .forEach(
                object => {

                    object.style.opacity =
                        labelsVisible
                            ? "1"
                            : "0";

                }
            );

    };


/* =====================================================
   MAXIMIZE
===================================================== */

document
    .getElementById("maximizeBtn")
    .onclick =
    function() {

        document
            .getElementById("skyPanel")
            .classList.toggle(
                "maximized"
            );

    };


/* =====================================================
   EXPLORE
===================================================== */

document
    .getElementById("exploreBtn")
    .onclick =
    function() {

        document
            .getElementById("skyPanel")
            .scrollIntoView({
                behavior: "smooth"
            });

    };


/* =====================================================
   CAMERA AR
===================================================== */

const arSection =
    document.getElementById(
        "arSection"
    );

const cameraVideo =
    document.getElementById(
        "cameraVideo"
    );

let cameraStream = null;

let currentFacingMode =
    "environment";


/* =====================================================
   OPEN CAMERA
===================================================== */

async function openCamera() {

    arSection.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    try {

        cameraStream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {

                        facingMode:
                            currentFacingMode

                    },

                    audio: false

                });


        cameraVideo.srcObject =
            cameraStream;


    }

    catch(error) {

        console.error(error);


        alert(
            "Camera permission was not granted. Please allow camera access and try again."
        );

    }

}


/* =====================================================
   CAMERA BUTTONS
===================================================== */

document
    .getElementById(
        "cameraTopBtn"
    )
    .onclick =
    openCamera;


document
    .getElementById(
        "cameraHeroBtn"
    )
    .onclick =
    openCamera;


/* =====================================================
   CLOSE CAMERA
===================================================== */

document
    .getElementById(
        "closeAR"
    )
    .onclick =
    closeCamera;


function closeCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        cameraStream = null;

    }


    cameraVideo.srcObject =
        null;


    arSection.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =====================================================
   SWITCH CAMERA
===================================================== */

document
    .getElementById(
        "switchCameraBtn"
    )
    .onclick =
    async function() {

        if (cameraStream) {

            cameraStream
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );

        }


        currentFacingMode =
            currentFacingMode ===
            "environment"

                ? "user"

                : "environment";


        await openCamera();

    };


/* =====================================================
   AR STARS
===================================================== */

const arStars =
    document.getElementById(
        "arStars"
    );


function createARStars() {

    arStars.innerHTML = "";


    for (
        let i = 0;
        i < 180;
        i++
    ) {

        const star =
            document.createElement(
                "div"
            );


        star.className =
            "ar-star-dot";


        star.style.left =
            Math.random() * 100 +
            "%";


        star.style.top =
            Math.random() * 100 +
            "%";


        const size =
            Math.random() * 3 +
            1;


        star.style.width =
            size + "px";


        star.style.height =
            size + "px";


        star.style.opacity =
            Math.random() * .8 +
            .2;


        arStars.appendChild(
            star
        );

    }

}


createARStars();


/* =====================================================
   DEVICE ORIENTATION
===================================================== */

let sensorEnabled = false;

let heading = 0;

let pitch = 0;


async function enableSensors() {

    try {

        /*
         iPhone/iPad may require
         explicit permission.
        */

        if (
            typeof DeviceOrientationEvent
                !== "undefined"

            &&

            typeof DeviceOrientationEvent
                .requestPermission ===
                "function"
        ) {

            const permission =
                await DeviceOrientationEvent
                    .requestPermission();


            if (
                permission !==
                "granted"
            ) {

                throw new Error(
                    "Orientation permission denied"
                );

            }

        }


        window.addEventListener(
            "deviceorientation",
            handleOrientation,
            true
        );


        sensorEnabled =
            true;


        document.getElementById(
            "sensorStatus"
        ).textContent =
            "🧭 Sensors active";


    }

    catch(error) {

        console.error(error);


        document.getElementById(
            "sensorStatus"
        ).textContent =
            "⚠ Sensors unavailable";


        alert(
            "Motion/orientation permission was not granted."
        );

    }

}


/* =====================================================
   ORIENTATION HANDLER
===================================================== */

function handleOrientation(event) {

    let alpha =
        event.alpha;


    let beta =
        event.beta;


    let gamma =
        event.gamma;


    /*
      Prefer Apple's compass heading
      when available.
    */

    if (
        typeof event.webkitCompassHeading
        === "number"
    ) {

        heading =
            event.webkitCompassHeading;

    }

    else if (
        typeof alpha === "number"
    ) {

        heading =
            360 - alpha;

    }


    if (
        typeof beta === "number"
    ) {

        pitch =
            beta;

    }


    document.getElementById(
        "arHeading"
    ).textContent =
        Math.round(heading) +
        "°";


    updateARSky();

}


/* =====================================================
   MOVE AR SKY
===================================================== */

function updateARSky() {

    const arSky =
        document.getElementById(
            "arSky"
        );


    /*
      Horizontal movement:
      phone heading changes
      star field position.
    */

    const horizontal =
        -(heading / 360) *
        100;


    /*
      Vertical movement.
    */

    const vertical =
        Math.max(
            -30,
            Math.min(
                30,
                pitch - 45
            )
        );


    arSky.style.transform =
        `translate(${horizontal}%, ${vertical}px)`;

}


/* =====================================================
   SENSOR BUTTON
===================================================== */

document
    .getElementById(
        "sensorBtn"
    )
    .onclick =
    enableSensors;


/* =====================================================
   AR LABELS
===================================================== */

let arLabels =
    true;


document
    .getElementById(
        "arLabelsBtn"
    )
    .onclick =
    function() {

        arLabels =
            !arLabels;


        document
            .querySelectorAll(
                ".ar-object"
            )
            .forEach(
                object => {

                    object.style.display =
                        arLabels
                            ? ""
                            : "none";

                }
            );

    };


/* =====================================================
   AR CLOUDS
===================================================== */

let arClouds =
    true;


document
    .getElementById(
        "arCloudBtn"
    )
    .onclick =
    function() {

        arClouds =
            !arClouds;


        document.getElementById(
            "arCloudWarning"
        ).style.display =
            arClouds
                ? "block"
                : "none";

    };


/* =====================================================
   LOCATION
===================================================== */

document
    .getElementById(
        "locationBtn"
    )
    .onclick =
    function() {

        if (
            !navigator.geolocation
        ) {

            alert(
                "Location is not supported."
            );

            return;

        }


        navigator
            .geolocation
            .getCurrentPosition(

                position => {

                    alert(

                        "Cosmo Vision\n\n" +

                        "Latitude: " +

                        position.coords
                            .latitude
                            .toFixed(4) +

                        "\nLongitude: " +

                        position.coords
                            .longitude
                            .toFixed(4)

                    );

                },

                () => {

                    alert(
                        "Location permission denied."
                    );

                }

            );

    };


/* =====================================================
   SIMPLE SKY DRAG
===================================================== */

let dragging = false;

let lastX = 0;

let rotation = 0;


skyMap.addEventListener(
    "pointerdown",
    event => {

        dragging = true;

        lastX =
            event.clientX;

    }
);


window.addEventListener(
    "pointermove",
    event => {

        if (!dragging)
            return;


        const difference =
            event.clientX -
            lastX;


        rotation +=
            difference * .2;


        skyMap.style.transform =
            `rotateY(${rotation}deg)`;


        lastX =
            event.clientX;

    }
);


window.addEventListener(
    "pointerup",
    () => {

        dragging = false;

    }
);


/* =====================================================
   TIMELINE
===================================================== */

const times = [

    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00"

];


document
    .getElementById(
        "timeSlider"
    )
    .oninput =
    function() {

        document.getElementById(
            "selectedTime"
        ).textContent =
            times[
                Number(this.value)
            ];

    };


console.log(
    "🌌 COSMO VISION AR READY"
);

console.log(
    "⭐ Objects:",
    celestialObjects.length
);