import * as weatherService from '../services/weatherService.js';

export async function getWeatherCity(req, res) {
  try {
    const { city } = req.params;

    const cache = await weatherService.getCachedWeather(city);
    if (!cache) {
      const data = await weatherService.getWeatherCity(city);
      await weatherService.saveWeatherToCache(city, data);

      return res.status(200).json(data);
    }
    res.status(200).json(cache);
  } catch (error) {
    console.log(error);
  }
}