const express = require('express');
const { API_KEY } = require('./keys/keys.js');
const fetch = require('node-fetch');

const app = express();

if (!API_KEY && process.env.NODE_ENV !== 'test') {
  console.error(
    'Error: API_KEY is missing. Please provide a valid API_KEY in ../keys/keys.js.',
  );
  process.exit(1);
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello! Weather API is up and running.');
});

app.post('/weather', async (req, res) => {
  try {
    const { cityName } = req.body;

    if (!cityName || typeof cityName !== 'string' || cityName.trim() === '') {
      return res.status(400).json({
        error: 'City name cannot be empty.',
      });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName.trim()}&appid=${API_KEY}&units=metric`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'City not found.' });
      }
      console.error(`API error: Received status ${response.status}`);
      return res.status(500).json({
        error: 'Failed to fetch weather data. Please try again later.',
      });
    }

    const data = await response.json();

    const temperature = data.main?.temp;
    if (typeof temperature !== 'number') {
      return res.status(500).json({
        error: 'Unexpected data format from Weather API.',
      });
    }

    res.json({
      weatherText: `The current temperature in ${
        data.name
      } is ${temperature.toFixed(0)}°C.`,
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again later.',
    });
  }
});

module.exports = app;
