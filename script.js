const fButton = document.getElementById("fButton");
const weatherDiv = document.getElementById("weatherDiv");
const api_Key = "e561b02a734d429df42f17b3d08b41b0";
const weatherIcon = document.getElementById("weatherIcon");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const recentCitiesList = document.getElementById("recentCities");
const forecastDiv = document.getElementById("forecastDiv");
//function to fetch data from
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_Key}&units=metric`
    );
    if (!response.ok) {
      throw new Error("City not Found");
    }
    const data = await response.json(); //we can convert using .json at response declaration.
    displayWeather(data);
    fetchForecast(city);
    updateRecentCities(city);
  } catch (error) {
    showError(error.message);
  }
}
//function to fetch the weather by current location
const fetchWeatherByLocation = async () => {
  if (!navigator.geolocation) {
    showError("Location is not available");
    return;
  }
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_Key}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Unable to fetch the weather");
      }
      const data = await response.json();
      displayWeather(data);
      fetchForecastByLocation(latitude, longitude);
    } catch (error) {
      showError(error.message);
    }
  });
};
const displayWeather = (data) => {
  const { name, main, weather, wind } = data;

  const weatherData = ` City name: ${data.name}<br> Temperature is: ${data.main.temp} <br> wind: ${data.wind.speed} <br> Humidity: ${data.main.humidity} <br> Condition: ${data.weather[0].description}`;

  if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "images/cloud.png";
  }
  if (data.weather[0].main == "Clear") {
    weatherIcon.src = "images/clear-sky.png";
  }
  if (data.weather[0].main == "Rain") {
    weatherIcon.src = "images/rain.png";
  }
  if (data.weather[0].main == "Drizzle") {
    weatherIcon.src = "images/drizzle.png";
  }
  if (data.weather[0].main == "Snow") {
    weatherIcon.src = "images/snow.png";
  }
  if (data.weather[0].main == "Mist") {
    weatherIcon.src = "images/mist.png";
  }
  if (data.weather[0].main == "Haze") {
    weatherIcon.src = "images/haze.png";
  }
  inputCity.value = ""; //Empty the input field as soon as we click on the button to get the weather. It deleted the input value after async operations.
  weatherDiv.classList.remove("hidden");
  weatherDiv.classList.add("flex");
  weatherDiv.innerHTML = `${weatherData} <img id="weatherIcon" class="w-10 mt-3" src="${weatherIcon.src}" alt="Weather-icon">`;
};

let savedCities = JSON.parse(sessionStorage.getItem("savedCities")) || [];
//Fetched the cities from session storage, if no cities available empty array will be saved.
const updateRecentCities = (city) => {
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    if (savedCities.length > 5) {
      savedCities.shift(); //removes the 1st city when the length is >5.
    }
    sessionStorage.setItem("savedCities", JSON.stringify(savedCities));
    dropDown(); //after updating the cities from session storage it call the dropDown method to show the cities in dropdown.
  }
};
const dropDown = () => {
  recentCitiesList.innerHTML = ""; //initially no cities
  savedCities.forEach((city) => {
    const listItem = document.createElement("option"); //Created the list dynamically
    listItem.textContent = city;
    listItem.className = "cursor-pointer p-2 hover:bg-gray-200";
    listItem.addEventListener("click", () => fetchWeatherByCity(city));
    recentCitiesList.appendChild(listItem);
  });
};
//Event listener to the button "Show Weather" by city name.
fButton.addEventListener("click", () => {
  const city = inputCity.value;
  if (city) {
    fetchWeatherByCity(city);
    // inputCity.value = ""; Empty the input field as soon as we click on the button to get the weather. Can also use here. But it is removing the city name quickly.
  } else if (city == "") {
    showError("Please enter city name");
  }
});
//highlight the error message with color red.
const showError = (message) => {
  weatherDiv.innerHTML = `<p class="text-red-500">${message}</p>`;
};
currentLocationBtn.addEventListener("click", fetchWeatherByLocation);
dropDown();

//Fetches the 5-day forecast by using city name.
async function fetchForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_Key}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch forecast data");
    }
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    showError(error.message);
  }
}
//fetching the forecast by using current location.

async function fetchForecastByLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_Key}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch forecast data");
    }
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    showError(error.message);
  }
}

const displayForecast = (data) => {
  const forecasts = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  ); // Capturing the Afternoon forecasts
  //map will be used to manipulate the array and returns the same array.
  const forecastHTML = forecasts
    .map((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      const temp = forecast.main.temp;
      const condition = forecast.weather[0].description;
      const windSpeed = forecast.wind.speed;
      const humidity = forecast.main.humidity;
      const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

      return `
        <div class="bg-blue-200 p-1 rounded shadow text-center ">
          <p class="font-bold">${date}</p>
          <img src="${icon}" alt="Forecast Icon" class="mx-auto">
          <p>${condition}</p>
          <p>Temp: ${temp}°C</p>
          <p>Wind: ${windSpeed} m/s</p>
          <p>Humidity: ${humidity}%</p>
        </div>`;
    })
    .join("");
  //Divisions to be created to print forecast data.
  forecastDiv.classList.remove("hidden");
  forecastDiv.innerHTML = `
    <h2 class="text-lg mt-6 bg-blue-400 text-center">5-Day Forecast</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-4">
      ${forecastHTML}
    </div>`;
};
