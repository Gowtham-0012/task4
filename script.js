const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const statusMessage = document.getElementById("statusMessage");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeather(cityInput.value);
});

// Main function: find the city, fetch its weather, and update the page.
async function getWeather(city) {
  const cityName = city.trim();

  if (!cityName) {
    showMessage("Please enter a city name.", "error");
    cityInput.focus();
    return;
  }

  setLoading(true);
  showMessage("Finding city and fetching live weather...", "");

  try {
    // Step 1: Convert the city name into latitude and longitude.
    const geocodingURL =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geocodingURL);

    if (!geoResponse.ok) {
      throw new Error("Could not contact the location service. Please try again.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`No city found for "${cityName}". Check the spelling and try again.`);
    }

    // Nested JSON: the first matching location is inside results[0].
    const location = geoData.results[0];

    // Step 2: Use the coordinates to request current weather.
    const weatherURL =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
      throw new Error("Could not retrieve weather data. Please try again.");
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current) {
      throw new Error("Weather information is currently unavailable for this city.");
    }

    // Step 3: Read values from the nested current object.
    displayWeather(location, weatherData.current);
    showMessage("Weather updated successfully.", "success");

  } catch (error) {
    showMessage(error.message || "Something went wrong. Please try again.", "error");
  } finally {
    // Runs whether the request succeeds or fails.
    setLoading(false);
  }
}

function displayWeather(location, current) {
  document.getElementById("cityName").textContent = location.name;
  document.getElementById("locationDetails").textContent =
    [location.admin1, location.country].filter(Boolean).join(", ");

  document.getElementById("temperature").innerHTML =
    `${Math.round(current.temperature_2m)}<span>°C</span>`;

  document.getElementById("condition").textContent =
    getWeatherDescription(current.weather_code);

  document.getElementById("humidity").innerHTML =
    `${current.relative_humidity_2m}<span>%</span>`;

  document.getElementById("wind").innerHTML =
    `${current.wind_speed_10m}<span> km/h</span>`;

  document.getElementById("feelsMetric").innerHTML =
    `${Math.round(current.apparent_temperature)}<span>°C</span>`;

  document.getElementById("feelsLike").textContent =
    `Feels like ${Math.round(current.apparent_temperature)}°C`;

  document.getElementById("weatherIcon").textContent =
    getWeatherIcon(current.weather_code, current.is_day);

  const localTime = current.time
    ? new Date(current.time).toLocaleString()
    : "Just now";

  document.getElementById("updatedAt").textContent =
    `Weather observation time: ${localTime}`;
}

// Open-Meteo uses WMO weather interpretation codes.
function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Mainly clear / cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([56, 57].includes(code)) return "Freezing drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather conditions unavailable";
}

function getWeatherIcon(code, isDay) {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if ([1, 2].includes(code)) return isDay ? "🌤️" : "☁️";
  if ([3, 45, 48].includes(code)) return "☁️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
}

function showMessage(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
}

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.textContent = isLoading ? "Loading..." : "Search";
}

// Load a default city when the page first opens.
getWeather("Chennai");
