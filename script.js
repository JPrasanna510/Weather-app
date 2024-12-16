const fButton = document.getElementById("fButton");
const weatherDiv = document.getElementById("weatherDiv");
const api_Key = "e561b02a734d429df42f17b3d08b41b0";
const weatherIcon = document.getElementById("weatherIcon");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const recentCitiesList = document.getElementById("recentCities");
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

fButton.addEventListener("click", () => {
  const city = inputCity.value;
  if (city) {
    fetchWeatherByCity(city);
  } else if (city == "") {
    showError("Please enter city name");
  }
});
//highlight the error message with color red.
const showError = (message) => {
  weatherDiv.innerHTML = `<p class="text-red-500">${message}</p>`;
};
currentLocationBtn.addEventListener("click", fetchWeatherByLocation);
// dropDown();
