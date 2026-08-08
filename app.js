/* =========================================================
   COSMO VISION
   "What clouds hide, we show."
   
   Main application JavaScript
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     CONFIGURATION
  --------------------------------------------------------- */

  const OBJECT_COUNT = 1200;

  const PLANETS = [
    {
      id: "sun",
      name: "Sun",
      type: "Star",
      ra: 12,
      dec: 0,
      magnitude: -26.7,
      color: "#ffd86b"
    },
    {
      id: "moon",
      name: "Moon",
      type: "Moon",
      ra: 14,
      dec: 5,
      magnitude: -12.7,
      color: "#eeeeee"
    },
    {
      id: "mercury",
      name: "Mercury",
      type: "Planet",
      ra: 8,
      dec: 10,
      magnitude: -1,
      color: "#d8b08a"
    },
    {
      id: "venus",
      name: "Venus",
      type: "Planet",
      ra: 11,
      dec: 8,
      magnitude: -4.5,
      color: "#ffe29b"
    },
    {
      id: "mars",
      name: "Mars",
      type: "Planet",
      ra: 5,
      dec: 20,
      magnitude: 1,
      color: "#e8735b"
    },
    {
      id: "jupiter",
      name: "Jupiter",
      type: "Planet",
      ra: 2,
      dec: -5,
      magnitude: -2.5,
      color: "#d8b17b"
    },
    {
      id: "saturn",
      name: "Saturn",
      type: "Planet",
      ra: 22,
      dec: -12,
      magnitude: 0.5,
      color: "#d9c28d"
    },
    {
      id: "uranus",
      name: "Uranus",
      type: "Planet",
      ra: 3,
      dec: 5,
      magnitude: 5.7,
      color: "#8ce5e8"
    },
    {
      id: "neptune",
      name: "Neptune",
      type: "Planet",
      ra: 0,
      dec: -10,
      magnitude: 7.8,
      color: "#5577ff"
    }
  ];

  /* ---------------------------------------------------------
     CONSTELLATIONS
  --------------------------------------------------------- */

  const CONSTELLATIONS = [
    {
      name: "Orion",
      stars: [
        ["Betelgeuse", 5.92, 7.4],
        ["Bellatrix", 5.42, 6.3],
        ["Alnilam", 5.60, -1.2],
        ["Alnitak", 5.68, -1.9],
        ["Mintaka", 5.53, -0.3],
        ["Rigel", 5.24, -8.2],
        ["Saiph", 5.80, -9.7]
      ]
    },

    {
      name: "Ursa Major",
      stars: [
        ["Dubhe", 11.06, 61.7],
        ["Merak", 11.03, 56.4],
        ["Phecda", 11.90, 53.7],
        ["Megrez", 12.26, 57.0],
        ["Alioth", 12.90, 55.9],
        ["Mizar", 13.40, 54.9],
        ["Alkaid", 13.79, 49.3]
      ]
    },

    {
      name: "Cassiopeia",
      stars: [
        ["Schedar", 0.67, 56.5],
        ["Caph", 0.15, 59.1],
        ["Gamma Cas", 0.95, 60.7],
        ["Ruchbah", 1.43, 60.2],
        ["Segin", 1.91, 63.7]
      ]
    },

    {
      name: "Scorpius",
      stars: [
        ["Antares", 16.49, -26.4],
        ["Shaula", 17.56, -37.1],
        ["Sargas", 17.62, -42.9],
        ["Dschubba", 16.00, -22.6]
      ]
    }
  ];

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */

  const state = {
    objects: [],
    searchResults: [],
    selectedObject: null,

    yaw: 0,
    pitch: 0,

    targetYaw: 0,
    targetPitch: 0,

    zoom: 1,

    dragging: false,
    lastX: 0,
    lastY: 0,

    motionEnabled: false,
    motionPermissionAsked: false,

    timeMinutes: 22 * 60,

    location: {
      lat: 20.0,
      lon: 75.0
    },

    clouds: {
      north: 45,
      south: 25,
      east: 70,
      west: 15
    },

    fullscreen: false
  };

  /* ---------------------------------------------------------
     DOM
  --------------------------------------------------------- */

  const canvas =
    document.querySelector("#skyCanvas") ||
    document.querySelector("canvas");

  if (!canvas) {
    console.error("Cosmo Vision: sky canvas not found.");
    return;
  }

  const ctx = canvas.getContext("2d");

  /* ---------------------------------------------------------
     CANVAS RESIZING
  --------------------------------------------------------- */

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    draw();
  }

  window.addEventListener("resize", resizeCanvas);

  /* ---------------------------------------------------------
     CELESTIAL OBJECT GENERATOR
     
     Generates more than 1000 objects so the application
     contains a large searchable sky catalogue.
  --------------------------------------------------------- */

  function generateObjects() {
    const objects = [];

    /* Real/highlighted objects first */
    PLANETS.forEach(p => {
      objects.push({
        ...p,
        x: raToAngle(p.ra),
        y: decToAngle(p.dec),
        real: true
      });
    });

    /* Constellation stars */
    CONSTELLATIONS.forEach(constellation => {
      constellation.stars.forEach(star => {
        objects.push({
          id: slugify(star[0]),
          name: star[0],
          type: "Star",
          constellation: constellation.name,
          ra: star[1],
          dec: star[2],
          magnitude: 1 + Math.random() * 4,
          color: "#ffffff",
          x: raToAngle(star[1]),
          y: decToAngle(star[2]),
          real: true
        });
      });
    });

    /* Synthetic catalogue */
    for (let i = objects.length; i < OBJECT_COUNT; i++) {
      const ra = Math.random() * 24;
      const dec = -85 + Math.random() * 170;

      const magnitude =
        1.5 + Math.random() * 6;

      objects.push({
        id: `star-${i}`,
        name: `Star ${String(i + 1).padStart(4, "0")}`,
        type: "Star",
        ra,
        dec,
        magnitude,
        color: "#ffffff",
        x: raToAngle(ra),
        y: decToAngle(dec),
        real: false
      });
    }

    state.objects = objects;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
  }

  function raToAngle(ra) {
    return (ra / 24) * Math.PI * 2;
  }

  function decToAngle(dec) {
    return (dec / 90) * (Math.PI / 2);
  }

  /* ---------------------------------------------------------
     COORDINATE PROJECTION
  --------------------------------------------------------- */

  function projectObject(object, width, height) {
    const horizontal =
      object.x - state.yaw;

    const vertical =
      object.y - state.pitch;

    let x =
      width / 2 +
      Math.sin(horizontal) *
        width *
        0.48 *
       