const fButton = document.getElementById("fButton");
const weatherDiv = document.getElementById("weatherDiv");
const api_Key = "e561b02a734d429df42f17b3d08b41b0";

//function to fetch data from
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_Key}`
    );
    if (!response.ok) {
      throw new Error("City not Found");
    }
    const data = await response.json(); //we can convert using .json ar response declaration.
    const { name, main, weather, wind } = data;
    weatherDiv.innerHTML = `Temperature is: ${data.main.temp} <br> wind: ${data.wind.speed}`;
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
