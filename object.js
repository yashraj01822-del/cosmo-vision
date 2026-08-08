const OBJECTS = [

  // SOLAR SYSTEM

  {
    name: "Sun",
    type: "Star",
    ra: 0,
    dec: 0,
    magnitude: -26.7
  },

  {
    name: "Moon",
    type: "Moon",
    ra: 0,
    dec: 0,
    magnitude: -12.7
  },

  {
    name: "Mercury",
    type: "Planet",
    ra: 0,
    dec: 0,
    magnitude: -1
  },

  {
    name: "Venus",
    type: "Planet",
    ra: 0,
    dec: 0,
    magnitude: -4
  },

  {
    name: "Mars",
    type: "Planet",
    ra: 0,
    dec: 0,
    magnitude: -2
  },

  {
    name: "Jupiter",
    type: "Planet",
    ra: 0,
    dec: 0,
    magnitude: -2.9
  },

  {
    name: "Saturn",
    type: "Planet",
    ra: 0,
    dec: 0,
    magnitude: 0.5
  },

  {
    name: "Uranus",
    type: "Planet",
    ra: 0,
    dec: 0,
    magnitude: 5.7
  },

  {
    name: "Neptune",
    type: "Planet",
    ra: 0,
    dec: 0,
    magnitude: 7.8
  },

  // FAMOUS DEEP SKY OBJECTS

  {
    name: "Andromeda Galaxy",
    type: "Galaxy",
    ra: 10.684,
    dec: 41.269,
    magnitude: 3.44
  },

  {
    name: "Orion Nebula",
    type: "Nebula",
    ra: 83.822,
    dec: -5.391,
    magnitude: 4
  },

  {
    name: "Pleiades",
    type: "Open Cluster",
    ra: 56.75,
    dec: 24.116,
    magnitude: 1.6
  },

  {
    name: "Lagoon Nebula",
    type: "Nebula",
    ra: 270.921,
    dec: -24.383,
    magnitude: 6
  },

  {
    name: "Eagle Nebula",
    type: "Nebula",
    ra: 274.7,
    dec: -13.8,
    magnitude: 6
  },

  {
    name: "Crab Nebula",
    type: "Supernova Remnant",
    ra: 83.633,
    dec: 22.014,
    magnitude: 8.4
  }

];


// --------------------------------------------------
// GENERATE 1000 CATALOGUE STARS
// --------------------------------------------------

for (let i = 1; i <= 1000; i++) {

  const ra = (i * 137.508) % 360;

  const dec =
    -89 +
    ((i * 73.217) % 178);

  const magnitude =
    1 +
    ((i * 0.017) % 7);

  OBJECTS.push({

    name: `Catalog Star ${String(i).padStart(4, "0")}`,

    type: "Star",

    ra: ra,

    dec: dec,

    magnitude: magnitude

  });

}


// --------------------------------------------------
// MESSIER OBJECTS
// --------------------------------------------------

const MESSIER_NAMES = [

  "M1 Crab Nebula",
  "M2 Globular Cluster",
  "M3 Globular Cluster",
  "M4 Globular Cluster",
  "M5 Globular Cluster",
  "M6 Butterfly Cluster",
  "M7 Ptolemy Cluster",
  "M8 Lagoon Nebula",
  "M9 Globular Cluster",
  "M10 Globular Cluster",
  "M11 Wild Duck Cluster",
  "M12 Globular Cluster",
  "M13 Hercules Cluster",
  "M14 Globular Cluster",
  "M15 Globular Cluster",
  "M16 Eagle Nebula",
  "M17 Omega Nebula",
  "M18 Open Cluster",
  "M19 Globular Cluster",
  "M20 Trifid Nebula",
  "M21 Open Cluster",
  "M22 Globular Cluster",
  "M23 Open Cluster",
  "M24 Sagittarius Star Cloud",
  "M25 Open Cluster",
  "M26 Open Cluster",
  "M27 Dumbbell Nebula",
  "M28 Globular Cluster",
  "M29 Open Cluster",
  "M30 Globular Cluster",
  "M31 Andromeda Galaxy",
  "M32 Galaxy",
  "M33 Triangulum Galaxy",
  "M34 Open Cluster",
  "M35 Open Cluster",
  "M36 Open Cluster",
  "M37 Open Cluster",
  "M38 Open Cluster",
  "M39 Open Cluster",
  "M40 Double Star",
  "M41 Open Cluster",
  "M42 Orion Nebula",
  "M43 De Mairan's Nebula",
  "M44 Beehive Cluster",
  "M45 Pleiades",
  "M46 Open Cluster",
  "M47 Open Cluster",
  "M48 Open Cluster",
  "M49 Galaxy",
  "M50 Open Cluster",
  "M51 Whirlpool Galaxy",
  "M52 Open Cluster",
  "M53 Globular Cluster",
  "M54 Globular Cluster",
  "M55 Globular Cluster",
  "M56 Globular Cluster",
  "M57 Ring Nebula",
  "M58 Galaxy",
  "M59 Galaxy",
  "M60 Galaxy",
  "M61 Galaxy",
  "M62 Globular Cluster",
  "M63 Sunflower Galaxy",
  "M64 Black Eye Galaxy",
  "M65 Galaxy",
  "M66 Galaxy",
  "M67 Open Cluster",
  "M68 Globular Cluster",
  "M69 Globular Cluster",
  "M70 Globular Cluster",
  "M71 Globular Cluster",
  "M72 Globular Cluster",
  "M73 Asterism",
  "M74 Galaxy",
  "M75 Globular Cluster",
  "M76 Little Dumbbell Nebula",
  "M77 Galaxy",
  "M78 Reflection Nebula",
  "M79 Globular Cluster",
  "M80 Globular Cluster",
  "M81 Bode's Galaxy",
  "M82 Cigar Galaxy",
  "M83 Southern Pinwheel",
  "M84 Galaxy",
  "M85 Galaxy",
  "M86 Galaxy",
  "M87 Virgo Galaxy",
  "M88 Galaxy",
  "M89 Galaxy",
  "M90 Galaxy",
  "M91 Galaxy",
  "M92 Globular Cluster",
  "M93 Open Cluster",
  "M94 Galaxy",
  "M95 Galaxy",
  "M96 Galaxy",
  "M97 Owl Nebula",
  "M98 Galaxy",
  "M99 Galaxy",
  "M100 Galaxy",
  "M101 Pinwheel Galaxy",
  "M102 Galaxy",
  "M103 Open Cluster",
  "M104 Sombrero Galaxy",
  "M105 Galaxy",
  "M106 Galaxy",
  "M107 Globular Cluster"
];

MESSIER_NAMES.forEach((name, index) => {

  OBJECTS.push({

    name: name,

    type: "Messier Object",

    ra: (index * 31.7) % 360,

    dec: -50 + ((index * 17.3) % 100),

    magnitude: 6

  });

});


console.log(
  "Cosmo Vision catalogue:",
  OBJECTS.length,
  "objects"
);