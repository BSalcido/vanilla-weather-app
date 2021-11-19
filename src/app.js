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

function displayWeekForecast() {
  let weekForecastElement = document.querySelector("#forecast-container");

  let weekForecastHTML = `<div class="row">`;

  let days = ["Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(function (day) {
    weekForecastHTML =
      weekForecastHTML +
      `
      <div class="col">
            <div class="dayName">${day}</div>
            <img
              src="https://ssl.gstatic.com/onebox/weather/48/rain_s_cloudy.png"
              alt="Forecast icon"
              id="day-forecast-img"
              class="dayForecastImage"
            />
            <div class="forecastDay">
              <span class="maxForecast">10</span>°/<span class="minForecast"
                >6</span
              >°
            </div>
          </div>
        `;
  });

  weekForecastHTML = weekForecastHTML + `</div>`;

  weekForecastElement.innerHTML = weekForecastHTML;
}

function displayTemperature(response) {
  // Gets city header
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

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

  // Gets weather icon
  let iconElement = document.querySelector("#current-weather-icon");
  let iconID = response.data.weather[0].icon;
  iconElement.src = `http://openweathermap.org/img/wn/${iconID}@2x.png`;

  // Gets the date
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(new Date(response.data.dt * 1000));

  let windUnitsElement = document.querySelector("#wind-units");
  if (units === "metric") {
    windUnitsElement.innerHTML = "m/s";
  } else {
    windUnitsElement.innerHTML = "mph";
  }

  console.log(response.data);
}

function search(city, units) {
  let cityName = city;
  let apiKey = "a681fa21eaf47e3cd663d5b2d4a9cb14";
  let unit = units;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayTemperature);
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

let cityInputElement = "New York";
let units = "metric";

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

search(cityInputElement, units);
displayWeekForecast();
