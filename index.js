// Setup
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

// City list
const cities = [
  'Miami,US', 'Vacaville,US', 'Los Angeles,US', 'New York,US', 'Chicago,US',
  'Playa Del Carmen,MX', 'Mexico City,MX', 'San José del Cabo,MX', 'Monterrey,MX', 'Guadalajara,MX',
  'Rio de Janeiro,BR', 'Fortaleza,BR', 'Sao Paulo,BR', 'Salvador,BR',
  'Madrid,ES', 'Barcelona,ES', 'Malaga,ES',
  'Paris,FR', 'Saint-Tropez,FR',
  'Munich,DE', 'Berlin,DE',
  'Istanbul,TR', 'Izmir,TR', 'Bodrum,TR',
  'Beijing,CN', 'Shanghai,CN',
  'Tokyo,JP', 'Kyoto,JP',
  'Bangkok,TH', 'Phuket,TH',
  'Tel Aviv,IL', 'Jerusalem,IL',
  'Dubai,AE', 'Abu Dhabi,AE'
];

// weather route
app.get('/weather', async (req, res) => {
  const city = req.query.city || 'Miami';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    // two simultaneous requests: one in imperial, one in metric
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

// dashboard route
app.get('/dashboard', async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const results = await Promise.all(
      cities.map(async (city) => {
        try {
          const [imperialRes, metricRes] = await Promise.all([
            axios.get('https://api.openweathermap.org/data/2.5/weather', {
              params: { q: city, units: 'imperial', appid: apiKey }
            }),
            axios.get('https://api.openweathermap.org/data/2.5/weather', {
              params: { q: city, units: 'metric', appid: apiKey }
            })
          ]);

          return {
            city: imperialRes.data.name,
            country: imperialRes.data.sys.country,
            temp_f: `${imperialRes.data.main.temp} °F`,
            temp_c: `${metricRes.data.main.temp} °C`,
            condition: imperialRes.data.weather[0].description
          };
        } catch (err) {
          return { city, error: 'Failed to fetch data' };
        }
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Dashboard weather fetch failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});