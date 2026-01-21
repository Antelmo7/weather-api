import * as weatherService from '../services/weatherService.js';

export async function getWeatherCity(req, res) {
  try {
    const { city } = req.params;

    const data = await weatherService.getWeatherCity(city);
    res.status(200).json(data);
  } catch (error) {
    console.log('Error fetching weather');
  }
}