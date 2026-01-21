import { createClient } from "redis";
const client = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_KEY,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

export async function getWeatherCity(city) {
  const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/?key=${process.env.WEATHER_API_KEY}`);
  if (response.status === 400) throw new Error('City not found');
  if (response.ok) {
    const data = await response.json();

    await saveWeatherToCache(city, data);
    return data;
  }
}

export async function getCachedWeather(city) {
  const response = await client.get(city);
  const data = JSON.parse(response);

  return data;
}

export async function saveWeatherToCache(city, data) {
  await client.set(city, JSON.stringify(data), {
    expiration: {
      type: "EX", // time in seconds
      value: 6 * 60 * 60, // expire in 6 hours
    }
  });
  console.log(`${city} weather stored on redis cache`);
}