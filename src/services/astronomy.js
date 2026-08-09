import * as Astronomy from "astronomy-engine";

const PLANETS = [
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn"
];

export function getSkyObjects(
  latitude,
  longitude,
  date = new Date()
) {
  const observer = new Astronomy.Observer(
    latitude,
    longitude,
    0
  );

  const objects = [];

  // Sun
  objects.push(
    getBodyPosition(
      "Sun",
      Astronomy.Body.Sun,
      observer,
      date
    )
  );

  // Moon
  objects.push(
    getBodyPosition(
      "Moon",
      Astronomy.Body.Moon,
      observer,
      date
    )
  );

  // Planets
  for (const name of PLANETS) {
    objects.push(
      getBodyPosition(
        name,
        Astronomy.Body[name],
        observer,
        date
      )
    );
  }

  return objects;
}


function getBodyPosition(
  name,
  body,
  observer,
  date
) {
  const equator =
    Astronomy.Equator(
      body,
      date,
      observer,
      true,
      true
    );

  const horizontal =
    Astronomy.Horizon(
      date,
      observer,
      equator.ra,
      equator.dec,
      "normal"
    );

  return {
    name,

    azimuth:
      normalizeAngle(horizontal.azimuth),

    altitude:
      horizontal.altitude,

    ra:
      equator.ra,

    dec:
      equator.dec,

    visible:
      horizontal.altitude > 0
  };
}


function normalizeAngle(angle) {
  return (
    (angle % 360) +
    360
  ) % 360;
}
