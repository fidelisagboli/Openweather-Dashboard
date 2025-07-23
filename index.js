require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/weather', async (req, res) => {
  const city = req.query.city || 'Miami';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    // Make two simultaneous requests: one in imperial, one in metric
    const [imperialRes, metricRes] = await Promise.all([
      axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          units: 'imperial',
          appid: apiKey
        }
      }),
      axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          units: 'metric',
          appid: apiKey
        }
      })
    ]);

    const imperialData = imperialRes.data;
    const metricData = metricRes.data;

    res.json({
      city: imperialData.name,
      country: imperialData.sys.country,
      temp_f: `${imperialData.main.temp} °F`,
      temp_c: `${metricData.main.temp} °C`,
      condition: imperialData.weather[0].description
    });

  } catch (error) {
    res.status(500).json({ error: 'Could not fetch weather data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});