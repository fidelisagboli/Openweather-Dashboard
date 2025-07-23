require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/weather', async (req, res) => {
  const city = req.query.city || 'Miami';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          units: 'imperial',
          appid: apiKey
        }
      }
    );

    const data = response.data;
    res.json({
      city: data.name,
      temp: `${data.main.temp} °F`,
      condition: data.weather[0].description
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});