export async function getWeatherCity(city) {
  return {
    city,
    weather: {
      grades: 30
    }
  }
}