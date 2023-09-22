let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednsday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let currentTime = document.querySelector(".time");
currentTime.innerHTML = `${day} ${now.getHours()}:${now.getMinutes()}`;

let apiKey = "4c793b8eo9b3d0t44df8b567ab4d7f60";
let apiUrl = `https://api.shecodes.io/weather/v1/current?`;

function getForecast(coordinates) {
  let apiUrl = ` https://api.shecodes.io/weather/v1/forecast?query={query}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
function displayForecastDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = date.getDay();
  return days[day];
}
function weatherInfo(response) {
  let h1 = document.querySelector("h1");
  let description = document.querySelector(".description");
  let iconElement = document.querySelector("#icon");
  let temperature = document.querySelector(".temp");
  let humidity = document.querySelector(".humidity");
  let wind = document.querySelector(".wind");
  h1.innerHTML = response.data.city;
  description.innerHTML = response.data.condition.description;
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
  let tempC = Math.round(response.data.temperature.current);
  temperature.innerHTML = tempC;

  function tempconverterCelsius(event) {
    event.preventDefault();
    temperature.innerHTML = tempC;
    Celsius.classList.add("active");
    fahrenheitTemperature.classList.remove("active");
  }
  function tempconverterFahrenheit(event) {
    event.preventDefault();
    temperature.innerHTML = Math.round(
      (response.data.temperature.current * 9) / 5 + 32
    );
    Celsius.classList.remove("active");
    fahrenheitTemperature.classList.add("active");
  }
  let Celsius = document.querySelector("#tempC");
  Celsius.addEventListener("click", tempconverterCelsius);
  let fahrenheitTemperature = document.querySelector("#tempF");
  fahrenheitTemperature.addEventListener("click", tempconverterFahrenheit);

  humidity.innerHTML = response.data.temperature.humidity;
  wind.innerHTML = response.data.wind.speed;
  getForecast(response.data.coordinates);
}
axios
  .get(`${apiUrl}&lat=9.0107934&lon=38.7612525&key=${apiKey}&units=metric`)
  .then(weatherInfo);

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = response.data.daily;
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${displayForecastDays(
          forecastDay.time
        )}</div>
        <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDay.condition.icon
          }.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(
            forecastDay.temperature.maximum
          )}° </span>
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temperature.minimum
          )}°</span>
        </div>
      </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function searchingCountry(event) {
  event.preventDefault();
  let searching = document.querySelector("#searchForm");
  let city = searching.value;
  axios
    .get(`${apiUrl}&query=${city}&key=${apiKey}&units=metric`)
    .then(weatherInfo);
}

let searchField = document.querySelector(".search-form");
searchField.addEventListener("submit", searchingCountry);
