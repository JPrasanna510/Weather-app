const fButton = document.getElementById("fButton");
const weatherDiv = document.getElementById("weatherDiv");
const api_Key = "e561b02a734d429df42f17b3d08b41b0";
const weatherIcon = document.getElementById("weatherIcon");
//function to fetch data from
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_Key}&units=metric`
    );
    if (!response.ok) {
      throw new Error("City not Found");
    }
    const data = await response.json(); //we can convert using .json ar response declaration.
    const { name, main, weather, wind } = data;
    const weatherData = `Temperature is: ${data.main.temp} <br> wind: ${data.wind.speed} <br> Humidity: ${data.main.humidity} <br> Condition: ${data.weather[0].description}`;

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
  } catch (error) {
    weatherDiv.innerHTML = `Error:${error.message}`;
  }
}

fButton.addEventListener("click", () => {
  const city = inputCity.value;
  if (city) {
    fetchWeatherByCity(city);
  }
});
