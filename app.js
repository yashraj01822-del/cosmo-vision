// ==========================================
// COSMO VISION
// WHAT CLOUDS HIDE, WE SHOW.
// ==========================================


const skyMap =
    document.getElementById("skyMap");

const stars =
    document.getElementById("stars");

const cloudLayer =
    document.getElementById("cloudLayer");


// ==========================================
// STARS
// ==========================================

function createStars() {

    stars.innerHTML = "";

    for (let i = 0; i < 300; i++) {

        const star =
            document.createElement("div");

        star.className = "star";


        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            Math.sqrt(Math.random()) *
            48;


        const x =
            50 +
            radius *
            Math.cos(angle);

        const y =
            50 +
            radius *
            Math.sin(angle);


        star.style.left =
            x + "%";

        star.style.top =
            y + "%";


        const size =
            Math.random() * 2.4 + .7;


        star.style.width =
            size + "px";

        star.style.height =
            size + "px";


        star.style.opacity =
            Math.random() * .8 + .2;


        stars.appendChild(star);
    }
}


createStars();


// ==========================================
// CLOUD TOGGLE
// ==========================================

let cloudsVisible = true;

const cloudBtn =
    document.getElementById("cloudBtn");


cloudBtn.onclick = () => {

    cloudsVisible =
        !cloudsVisible;


    cloudLayer.style.opacity =
        cloudsVisible
            ? "1"
            : "0";


    cloudBtn.textContent =
        cloudsVisible
            ? "☁ Clouds"
            : "☁ Clouds OFF";

};


// ==========================================
// LABEL TOGGLE
// ==========================================

let labelsVisible = true;

const labelsBtn =
    document.getElementById("labelsBtn");


labelsBtn.onclick = () => {

    labelsVisible =
        !labelsVisible;


    document
        .querySelectorAll(
            ".celestial, .constellation"
        )
        .forEach(element => {

            element.style.opacity =
                labelsVisible
                    ? "1"
                    : "0";

        });

};


// ==========================================
// MAXIMIZE
// ==========================================

const skyPanel =
    document.getElementById("skyPanel");

const maximizeBtn =
    document.getElementById("maximizeBtn");


maximizeBtn.onclick = () => {

    skyPanel.classList.toggle(
        "maximized"
    );


    maximizeBtn.textContent =
        skyPanel.classList.contains(
            "maximized"
        )
            ? "⛶ Exit"
            : "⛶";

};


// ==========================================
// DRAG SKY
// ==========================================

let dragging = false;

let lastX = 0;

let lastY = 0;

let rotationX = 0;

let rotationY = 0;

let zoom = 1;


skyMap.addEventListener(
    "pointerdown",
    event => {

        dragging = true;

        lastX =
            event.clientX;

        lastY =
            event.clientY;

        skyMap.setPointerCapture(
            event.pointerId
        );

    }
);


skyMap.addEventListener(
    "pointermove",
    event => {

        if (!dragging)
            return;


        const dx =
            event.clientX -
            lastX;

        const dy =
            event.clientY -
            lastY;


        rotationY +=
            dx * .25;

        rotationX -=
            dy * .12;


        lastX =
            event.clientX;

        lastY =
            event.clientY;


        updateTransform();

    }
);


skyMap.addEventListener(
    "pointerup",
    () => {

        dragging = false;

    }
);


function updateTransform() {

    skyMap.style.transform =

        `perspective(900px)
         scale(${zoom})
         rotateX(${rotationX}deg)
         rotateY(${rotationY}deg)`;

}


// ==========================================
// ZOOM
// ==========================================

skyMap.addEventListener(
    "wheel",
    event => {

        event.preventDefault();


        zoom +=
            event.deltaY < 0
                ? .05
                : -.05;


        zoom =
            Math.max(
                .8,
                Math.min(
                    1.6,
                    zoom
                )
            );


        updateTransform();

    },
    { passive:false }
);


// ==========================================
// ROTATION BUTTONS
// ==========================================

document
    .getElementById("rotateLeft")
    .onclick = () => {

        rotationY -= 15;

        updateTransform();

    };


document
    .getElementById("rotateRight")
    .onclick = () => {

        rotationY += 15;

        updateTransform();

    };


// ==========================================
// RESET
// ==========================================

document
    .getElementById("resetSky")
    .onclick = () => {

        rotationX = 0;

        rotationY = 0;

        zoom = 1;

        updateTransform();

    };


// ==========================================
// EXPLORE BUTTON
// ==========================================

document
    .getElementById("exploreBtn")
    .onclick = () => {

        document
            .getElementById("skyPanel")
            .scrollIntoView({
                behavior:"smooth"
            });

    };


// ==========================================
// TIMELINE
// ==========================================

const slider =
    document.getElementById(
        "timeSlider"
    );

const selectedTime =
    document.getElementById(
        "selectedTime"
    );


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


slider.oninput = () => {

    const index =
        Number(slider.value);


    selectedTime.textContent =
        times[index];


    updateWeather(index);

};


// ==========================================
// DEMO TIME-BASED WEATHER
// ==========================================

const weatherTimeline = [

    {
        low: 20,
        mid: 15,
        high: 20,
        clarity: 8.5
    },

    {
        low: 18,
        mid: 16,
        high: 22,
        clarity: 8.4
    },

    {
        low: 15,
        mid: 18,
        high: 24,
        clarity: 8.2
    },

    {
        low: 12,
        mid: 22,
        high: 20,
        clarity: 8.0
    },

    {
        low: 12,
        mid: 25,
        high: 18,
        clarity: 7.9
    },

    {
        low: 18,
        mid: 28,
        high: 22,
        clarity: 7.3
    },

    {
        low: 30,
        mid: 35,
        high: 25,
        clarity: 5.9
    },

    {
        low: 40,
        mid: 38,
        high: 30,
        clarity: 4.8
    },

    {
        low: 48,
        mid: 42,
        high: 35,
        clarity: 3.9
    },

    {
        low: 45,
        mid: 40,
        high: 38,
        clarity: 4.2
    },

    {
        low: 35,
        mid: 32,
        high: 30,
        clarity: 5.5
    },

    {
        low: 25,
        mid: 25,
        high: 25,
        clarity: 6.7
    },

    {
        low: 20,
        mid: 20,
        high: 22,
        clarity: 7.5
    }

];


function updateWeather(index) {

    const data =
        weatherTimeline[index];


    document
        .getElementById("lowCloud")
        .textContent =
        data.low + "%";


    document
        .getElementById("midCloud")
        .textContent =
        data.mid + "%";


    document
        .getElementById("highCloud")
        .textContent =
        data.high + "%";


    document
        .getElementById("clarity")
        .textContent =
        data.clarity.toFixed(1);


    document
        .getElementById("clarityBar")
        .style.width =
        (data.clarity * 10) + "%";


    const text =
        document.getElementById(
            "clarityText"
        );


    if (data.clarity >= 8) {

        text.textContent =
            "Excellent conditions for stargazing.";

    }

    else if (data.clarity >= 6) {

        text.textContent =
            "Good conditions for stargazing.";

    }

    else if (data.clarity >= 4) {

        text.textContent =
            "Some clouds may obstruct the sky.";

    }

    else {

        text.textContent =
            "Heavy cloud cover may hide many objects.";

    }

}


// ==========================================
// OBJECT SEARCH
// ==========================================

document
    .getElementById("searchBtn")
    .onclick = () => {

        const query =
            prompt(
                "Search for:\n\nMoon\nJupiter\nVenus\nOrion"
            );


        if (!query)
            return;


        const name =
            query.toLowerCase();


        let target = null;


        if (name.includes("moon"))
            target =
                document.getElementById("moon");


        else if (
            name.includes("jupiter")
        )
            target =
                document.getElementById("jupiter");


        else if (
            name.includes("venus")
        )
            target =
                document.getElementById("venus");


        else if (
            name.includes("orion")
        )
            target =
                document.getElementById("orion");


        if (!target) {

            alert(
                "Object not available in this prototype."
            );

            return;
        }


        target.style.transform =
            "scale(1.6)";


        setTimeout(() => {

            target.style.transform =
                "scale(1)";

        }, 1500);

    };


// ==========================================
// OBJECT BUTTONS
// ==========================================

document
    .querySelectorAll(".object")
    .forEach(button => {

        button.onclick = () => {

            const id =
                button.dataset.object;


            const target =
                document.getElementById(id);


            if (!target)
                return;


            target.scrollIntoView({
                behavior:"smooth",
                block:"center"
            });


            target.style.transform =
                "scale(1.7)";


            setTimeout(() => {

                target.style.transform =
                    "scale(1)";

            }, 1200);

        };

    });


// ==========================================
// LOCATION
// ==========================================

document
    .getElementById("locationBtn")
    .onclick = () => {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported."
            );

            return;

        }


        navigator.geolocation.getCurrentPosition(

            position => {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;


                alert(
                    `Location detected!\n\nLatitude: ${lat.toFixed(4)}\nLongitude: ${lon.toFixed(4)}`
                );

            },

            () => {

                alert(
                    "Location permission was denied."
                );

            }

        );

    };


// ==========================================
// INITIAL STATE
// ==========================================

updateWeather(6);

console.log(
    "🌌 COSMO VISION ONLINE"
);

console.log(
    "☁ CLOUD MAPPING: DEMO MODE"
);

console.log(
    "⭐ STELLARIUM-STYLE SKY: ACTIVE"
);