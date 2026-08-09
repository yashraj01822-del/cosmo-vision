import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import { getSkyObjects } from "./services/astronomy";
import { getWeather } from "./services/weather";

import "./styles.css";

const STAR_FIELD = Array.from({ length: 180 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.7 + 0.3,
}));

function App() {
  const [location, setLocation] = useState(null);
  const [skyObjects, setSkyObjects] = useState([]);
  const [weather, setWeather] = useState(null);

  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(0);

  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [labels, setLabels] = useState(true);
  const [clouds, setClouds] = useState(true);
  const [panel, setPanel] = useState(false);

  const drag = useRef(null);

  // -----------------------------------------
  // GET USER LOCATION + LOAD DATA
  // -----------------------------------------

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("GPS is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });

        try {
          const astronomicalData = getSkyObjects(
            latitude,
            longitude,
            new Date()
          );

          const weatherData = await getWeather(
            latitude,
            longitude
          );

          setSkyObjects(astronomicalData);
          setWeather(weatherData);
        } catch (err) {
          console.error(err);
          setError("Unable to load sky/weather data.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);

        setError(
          "Location permission was denied or unavailable."
        );

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // -----------------------------------------
  // UPDATE ASTRONOMICAL POSITIONS
  // -----------------------------------------

  useEffect(() => {
    if (!location) return;

    const updateSky = () => {
      try {
        const objects = getSkyObjects(
          location.latitude,
          location.longitude,
          new Date()
        );

        setSkyObjects(objects);
      } catch (err) {
        console.error("Astronomy update failed:", err);
      }
    };

    updateSky();

    const timer = setInterval(
      updateSky,
      60000
    );

    return () => clearInterval(timer);
  }, [location]);

  // -----------------------------------------
  // PHONE ORIENTATION
  // -----------------------------------------

  useEffect(() => {
    if (!tracking) return;

    const handleOrientation = (event) => {
      if (typeof event.alpha === "number") {
        setHeading(event.alpha);
      }

      if (typeof event.beta === "number") {
        const newPitch = event.beta - 45;

        setPitch(
          Math.max(
            -45,
            Math.min(45, newPitch)
          )
        );
      }
    };

    window.addEventListener(
      "deviceorientation",
      handleOrientation,
      true
    );

    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleOrientation,
        true
      );
    };
  }, [tracking]);

  // -----------------------------------------
  // ENABLE PHONE MOTION
  // -----------------------------------------

  async function enableMotion() {
    try {
      if (
        typeof DeviceOrientationEvent !==
          "undefined" &&
        typeof DeviceOrientationEvent
          .requestPermission === "function"
      ) {
        const permission =
          await DeviceOrientationEvent.requestPermission();

        if (permission !== "granted") {
          setError(
            "Motion permission was not granted."
          );
          return;
        }
      }

      setError("");
      setTracking(true);
    } catch (err) {
      console.error(err);
      setTracking(true);
    }
  }

  // -----------------------------------------
  // DRAG SKY MAP
  // -----------------------------------------

  function pointerDown(event) {
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      heading,
      pitch,
    };
  }

  function pointerMove(event) {
    if (!drag.current) return;

    const dx =
      event.clientX - drag.current.x;

    const dy =
      event.clientY - drag.current.y;

    const newHeading =
      (
        drag.current.heading -
        dx * 0.25 +
        360
      ) % 360;

    const newPitch =
      Math.max(
        -45,
        Math.min(
          45,
          drag.current.pitch +
            dy * 0.18
        )
      );

    setHeading(newHeading);
    setPitch(newPitch);
  }

  function pointerUp() {
    drag.current = null;
  }

  // -----------------------------------------
  // WEATHER DATA
  // -----------------------------------------

  const current = weather?.current;

  const cloud = current?.cloud_cover ?? 0;

  const low =
    weather?.hourly?.cloud_cover_low?.[0] ?? 0;

  const mid =
    weather?.hourly?.cloud_cover_mid?.[0] ?? 0;

  const high =
    weather?.hourly?.cloud_cover_high?.[0] ?? 0;

  const clarity = Math.max(
    0,
    Math.min(
      10,
      Math.round((100 - cloud) / 10)
    )
  );

  // -----------------------------------------
  // OBJECT POSITION
  // -----------------------------------------

  function getObjectPosition(object) {
    const x =
      50 +
      (
        (
          object.azimuth -
          heading +
          540
        ) % 360 -
        180
      ) *
        0.45;

    const y =
      62 -
      object.altitude * 0.7 +
      pitch;

    return {
      left: `${x}%`,
      top: `${y}%`,
    };
  }

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <main className="app">
      <section
        className="sky"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        style={{
          "--pitch": `${pitch}px`,
        }}
      >
        {/* STARS */}

        <div className="stars">
          {STAR_FIELD.map((star) => (
            <span
              key={star.id}
              className="star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        {/* CELESTIAL OBJECTS */}

        <div className="objects">
          {skyObjects.map((object) => {
            if (!object.visible) {
              return null;
            }

            return (
              <div
                key={object.name}
                className={`object ${object.name}`}
                style={getObjectPosition(object)}
              >
                <div className="object-dot" />

                {labels && (
                  <span>
                    {object.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* NORTHERN CLOUD PROTOTYPE */}

        {clouds && (
          <div
            className="northern-clouds"
            style={{
              "--cloud-opacity": Math.max(
                0.08,
                Math.min(0.85, cloud / 100)
              ),
            }}
          >
            <div className="cloud cloud1" />
            <div className="cloud cloud2" />
            <div className="cloud cloud3" />
            <div className="cloud cloud4" />

            <div className="cloud-info">
              <span>☁ NORTHERN SKY</span>
              <strong>
                {Math.round(cloud)}%
              </strong>
            </div>
          </div>
        )}

        {/* TOP BAR */}

        <header className="topbar">
          <button
            className="compass"
            onClick={enableMotion}
          >
            {Math.round(heading)
              .toString()
              .padStart(3, "0")}
            °
          </button>

          <div className="title">
            <strong>Cosmo Vision</strong>
            <small>LIVE SKY MAP</small>
          </div>

          <button
            className="cloud-button"
            onClick={() =>
              setClouds((value) => !value)
            }
          >
            ☁
            <span>
              {Math.round(cloud)}%
            </span>
          </button>
        </header>

        {/* CENTER RETICLE */}

        <div className="reticle">
          <div />
          <span>
            {Math.round(heading)}°
          </span>
        </div>

        {/* DIRECTIONS */}

        <span className="direction north">
          N
        </span>

        <span className="direction east">
          E
        </span>

        <span className="direction south">
          S
        </span>

        <span className="direction west">
          W
        </span>

        {/* BOTTOM WEATHER DATA */}

        <div className="bottom">
          <div>
            <small>CLOUDS</small>
            <strong>
              {Math.round(cloud)}%
            </strong>
          </div>

          <div>
            <small>LOW</small>
            <strong>
              {Math.round(low)}%
            </strong>
          </div>

          <div>
            <small>MID</small>
            <strong>
              {Math.round(mid)}%
            </strong>
          </div>

          <div>
            <small>HIGH</small>
            <strong>
              {Math.round(high)}%
            </strong>
          </div>

          <div>
            <small>CLARITY</small>
            <strong>
              {clarity}/10
            </strong>
          </div>
        </div>

        {/* CONTROLS */}

        <div className="controls">
          <button
            onClick={() =>
              setLabels((value) => !value)
            }
          >
            ◉
          </button>

          <button onClick={enableMotion}>
            ✦
          </button>

          <button
            onClick={() =>
              setPanel((value) => !value)
            }
          >
            ☰
          </button>
        </div>

        {/* SETTINGS */}

        {panel && (
          <aside className="panel">
            <h3>Cosmo Vision</h3>

            <p>
              Astronomy calculations +
              weather cloud prototype.
            </p>

            <label>
              <input
                type="checkbox"
                checked={clouds}
                onChange={(event) =>
                  setClouds(
                    event.target.checked
                  )
                }
              />
              Cloud overlay
            </label>

            <label>
              <input
                type="checkbox"
                checked={labels}
                onChange={(event) =>
                  setLabels(
                    event.target.checked
                  )
                }
              />
              Object labels
            </label>

            <button onClick={enableMotion}>
              {tracking
                ? "Motion Enabled"
                : "Enable Phone Motion"}
            </button>

            {location && (
              <p className="location">
                📍{" "}
                {location.latitude.toFixed(3)}
                {" , "}
                {location.longitude.toFixed(3)}
              </p>
            )}
          </aside>
        )}

        {/* LOADING */}

        {loading && (
          <div className="loading">
            <div className="loader" />
            <span>
              Calculating your sky...
            </span>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="error">
            {error}
          </div>
        )}
      </section>
    </main>
  );
}

const rootElement =
  document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element was not found."
  );
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);