let apiKey = "a681fa21eaf47e3cd663d5b2d4a9cb14";
let cityName = "Copenhagen";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

function formatDate(timestamp) {
  let date = timestamp;

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

  console.log(date);

  return `${day}, ${month} ${dateNum} <br> Last updated: ${time}`;
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

  // Gets the date
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(new Date(response.data.dt * 1000));

  console.log(response.data);
  console.log(Date(response.data.dt * 1000));
}

axios.get(apiUrl).then(displayTemperature);
