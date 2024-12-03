import express from 'express';
import fetch from 'node-fetch';
import { API_KEY } from './sources/keys.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/weather', async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'Missing field: cityName' });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`,
    );

    if (!response.ok) {
      return res.status(500).json({
        weatherText: 'Failed to fetch weather data. Please try again later.',
      });
    }

    const data = await response.json();

    if (data.cod === 404) {
      return res.status(404).json({
        weatherText: `City '${cityName}' is not found!`,
      });
    }

    if (data.cod === 200) {
      const temperature = data.main.temp;
      const tempCelsius = (temperature - 273.15).toFixed(2);
      return res.json({
        weatherText: `Weather data for ${data.name}. The current temperature is ${tempCelsius}°C.`,
      });
    }

    return res.status(500).json({
      weatherText: 'Unexpected error occurred while fetching weather data.',
    });
  } catch (error) {
    return res.status(500).json({
      weatherText: 'Failed to fetch weather data. Please try again later.',
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
