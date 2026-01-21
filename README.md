# weather-api

Weather API to practice 3rd party APIs, caching and environment variables.

This API allows the user to fetch weather data from a specific city, using Visual Crossing API. The data is cached in redis with and expiration time of 6 hours, it reduce the calls to the API and improve the response time. Also express-rate-limiter is used to prevent abuse of the API.

## Installation and use

1. Clone the repository from GitHub using `git clone https://github.com/Antelmo7/weather-api`
2. Change to the new folder and run `npm install`
3. Create a .env file with the template from .env-example file and fill the variables with your credentiales from de Visual Crossing API and Redis Database
4. Run `npm run dev`
5. Make a Get request to `http://localhost:3000/api/weather/:city`


## Tech Stack
- Node.js
- Express.js
- Redis
- express-rate-limit
- Visual Crossing API

## Explanation
**Environment Variables**

We save the environment variables inside an .env file

```env
PORT=3000
WEATHER_API_KEY=
REDIS_USER=default
REDIS_KEY=
REDIS_HOST=
REDIS_PORT=
```

Use: `const PORT = process.env.PORT || 3000;`

To use them inside Node.js and do not use libraries you can use the `--env-file` flag on the dev command: `node --env-file .env --watch ./src/server.js`, also the `--watch` flag allows us to do not need to restart the server any time we change the code.

**Express Rate Limiter**

The 'windowMs' property sets the period of time to limit the request quantity for the window in miliseconds.

The limit 'property' sets the limit o request in the period of time choosen.


```javascript
// ...your code
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 20,
});

app.use(limiter);
// ...your code
```

**Redis**

To connect to redis you have to install the 'redis' client for node with 'npm install redis', then create a client a set the configuration with the environment variables, and connect the client.

```javascript
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
```

To get and save data you can use `get` and `set` functions of the client, but they only save strings, so in this case we save the data using `JSON.strigify()` and `JSON.parse()` to return the data in an array, to set the expiration time pass the expiration property inside an options object whith `type` and `value` properties to the `set` function.

```javascript
export async function getCachedWeather(city) {
  try {
    const response = await client.get(city);
    const data = JSON.parse(response);

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function saveWeatherToCache(city, data) {
  try {
    await client.set(city, JSON.stringify(data), {
      expiration: {
        type: "EX", // time in seconds
        value: 6 * 60 * 60, // expire in 6 hours
      }
    });
    console.log(`${city} weather stored on redis cache`);
  } catch (error) {
    console.log(error);
  }
}
```

Solution for the [Wheather API](https://roadmap.sh/projects/weather-api-wrapper-service) challenge from [roadmap.sh](https://roadmap.sh)
