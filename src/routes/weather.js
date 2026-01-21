import { Router } from "express";
import { getWeatherCity } from "../controllers/weatherController.js";

const router = Router();

router.get('/:city', getWeatherCity);

export default router;