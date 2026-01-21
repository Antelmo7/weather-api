export async function getWeatherCity(city) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/?key=${process.env.WEATHER_API_KEY}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}