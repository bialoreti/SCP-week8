function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

function search(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");

  callApi(cityInput.value);
}

function callApi(cityName) {
  axios.get(`${apiCall}?query=${cityName}&key=${apiKey}`).then(showWeather);
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let apiKey = "932b0cf59t619af0fb48c1o3bb3c2680";
let apiCall = "https://api.shecodes.io/weather/v1/current";

function showWeather(response) {
  if (response.data.status !== "not_found") {
    let temperature = Math.round(response.data.temperature.current);
    let h2 = document.querySelector("#temp");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidElement = document.querySelector("#humid");
    let windElement = document.querySelector("#wind");
    let iconElement = document.querySelector("#icon");

    h2.innerHTML = `${temperature}`;
    cityElement.innerHTML = response.data.city;
    descriptionElement.innerHTML = response.data.condition.description;
    humidElement.innerHTML = `${response.data.temperature.humidity}%`;
    windElement.innerHTML = `${response.data.wind.speed}km/h`;
    iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-icon" id="weather-icon"/>`;

    getForecast(response.data.city);
  }
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apikey = "932b0cf59t619af0fb48c1o3bb3c2680";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&untis=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {

  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
<div class="forecast">
<div class="forecast-block">
  <div class="forecast-day">${formatDay(day.time)}</div>
  <img src="${day.condition.icon_url}" class="forecast-icon" />
  <div class="forecast-temperature">
    <div class="forecast-temp-max">
    ${Math.round(day.temperature.maximum)}º
    </div> 
    <div class="forecast-temp-min">
    ${Math.round(day.temperature.minimum)}º
    </div>
  </div>
  </div>
</div>
 `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

callApi("Lisbon");
