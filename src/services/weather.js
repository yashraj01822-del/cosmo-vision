const API =
  "https://api.open-meteo.com/v1/forecast";


export async function getWeather(
  latitude,
  longitude
) {

  const params = new URLSearchParams({

    latitude,

    longitude,

    current:
      "temperature_2m,relative_humidity_2m," +
      "cloud_cover,wind_speed_10m," +
      "wind_direction_10m",

    hourly:
      "cloud_cover," +
      "cloud_cover_low," +
      "cloud_cover_mid," +
      "cloud_cover_high," +
      "visibility," +
      "precipitation_probability",

    forecast_days: "1",

    timezone: "auto"

  });


  const response =
    await fetch(
      `${API}?${params}`
    );


  if (!response.ok) {

    throw new Error(
      "Unable to get weather data"
    );

  }


  return response.json();
}
