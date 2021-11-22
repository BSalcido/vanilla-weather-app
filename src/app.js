let cityInputElement = "New York";
let units = "metric";

function formatDate(timestamp) {
  let date = new Date(timestamp);

  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekDays[date.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];

  let dateNum = date.getDate();

  let timeString = date.toTimeString();
  let time = timeString.slice(0, 5);

  return `${day}, ${month} ${dateNum} <br> Last updated: ${time}`;
}

function getDailyForecast(coord, units) {
  let apiKey = "a681fa21eaf47e3cd663d5b2d4a9cb14";
  let lon = coord.lon;
  let lat = coord.lat;
  let unit = units;
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrlForecast).then(displayWeekForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayWeekForecast(response) {
  let weekForecastElement = document.querySelector("#forecast-container");
  let weekForecastHTML = `<div class="row">`;

  let days = response.data.daily;

  days.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      let maxTemp = Math.round(day.temp.max);
      let minTemp = Math.round(day.temp.min);
      let dailyIcon = day.weather[0].icon;
      let srcUrl = `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`;

      weekForecastHTML =
        weekForecastHTML +
        `
      <div class="col">
            <div class="dayName">${formatDay(day.dt)}</div>
            <img
              src="${srcUrl}"
              alt="Forecast icon"
              id="day-forecast-img"
              class="dayForecastImage"
            />
            <div class="forecastDay">
              <span class="maxForecast">${maxTemp}</span>°/<span class="minForecast"
                >${minTemp}</span
              >°
            </div>
          </div>
        `;
    }
  });

  weekForecastHTML = weekForecastHTML + `</div>`;

  weekForecastElement.innerHTML = weekForecastHTML;
}

function displayTemperature(response, newUnits) {
  // Gets city header
  let cityElement = document.querySelector("#city");
  cityInputElement = response.data.name;
  cityElement.innerHTML = cityInputElement;

  // Gets description phrase
  let descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  // Gets the temperature status
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);

  let realFeelElement = document.querySelector("#feels-like-temp");
  realFeelElement.innerHTML = Math.round(response.data.main.feels_like);

  let maxTempElement = document.querySelector("#todays-max-temp");
  maxTempElement.innerHTML = Math.round(response.data.main.temp_max);
  let minTempElement = document.querySelector("#todays-min-temp");
  minTempElement.innerHTML = Math.round(response.data.main.temp_min);

  // Gets other conditions
  let humidityElement = document.querySelector("#humidity-per");
  humidityElement.innerHTML = response.data.main.humidity;
  let windElement = document.querySelector("#wind-speed");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let windUnitsElement = document.querySelector("#wind-units");
  if (units === "metric") {
    windUnitsElement.innerHTML = "m/s";
  } else {
    windUnitsElement.innerHTML = "mph";
  }

  // Gets weather icon
  let iconElement = document.querySelector("#current-weather-icon");
  let iconID = response.data.weather[0].icon;
  iconElement.src = `http://openweathermap.org/img/wn/${iconID}@2x.png`;

  // Gets the date
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(new Date(response.data.dt * 1000));

  getDailyForecast(response.data.coord, newUnits);
}

function search(city, units) {
  let apiKey = "a681fa21eaf47e3cd663d5b2d4a9cb14";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then((response) => displayTemperature(response, units));
}

// Search engine
function handleSubmit(event, units) {
  cityInputElement = document.querySelector("#search-input").value;
  event.preventDefault();
  units = "metric";

  // Reset links style
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");

  search(cityInputElement, units);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

// Units conversion

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  units = "imperial";
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  search(cityInputElement, units);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  units = "metric";
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  search(cityInputElement, units);
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

search(cityInputElement, units);

function getCoords(position) {
  // Reset links style
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  units = "metric";
  let apiKey = "a681fa21eaf47e3cd663d5b2d4a9cb14";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then((response) => displayTemperature(response, units));
}
function retrieveLocalData(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoords);
}

let searchCurrent = document.querySelector("#current-button");
searchCurrent.addEventListener("click", retrieveLocalData);
