REAL-TIME WEATHER DASHBOARD
============================

PROJECT FILES
-------------
index.html  - Page structure
style.css   - Dashboard design and responsive layout
script.js   - Fetch API, async/await, JSON processing and error handling

HOW TO RUN
----------
1. Extract weather-dashboard.zip.
2. Open the weather-dashboard folder in Visual Studio Code.
3. Open Extensions and install "Live Server" if it is not already installed.
4. Right-click index.html and choose "Open with Live Server".
5. Search for a city such as Madurai, Chennai, London or Tokyo.

ABOUT THE API
-------------
This project uses Open-Meteo:
https://open-meteo.com/

It uses two public endpoints:
1. Geocoding API: converts a city name into latitude and longitude.
2. Forecast API: returns current weather data for those coordinates.

No API key is required.

CONCEPTS USED
-------------
- Fetch API
- async / await
- Promises
- try / catch / finally
- JSON parsing
- DOM manipulation
- REST API
- Form submission and event handling

NOTE
----
An internet connection is required. Weather values are supplied by Open-Meteo
and may vary by location and observation time.
