// Load initial dashboard data
window.addEventListener('DOMContentLoaded', () => {
  fetch('/dashboard')
    .then(res => res.json())
    .then(displayWeatherCards)
    .catch(err => console.error('Error loading dashboard:', err));
});

// Handle search form submission
document.getElementById('weatherForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const city = document.getElementById('cityInput').value.trim();

  if (!city) return;

  fetch(`/weather?city=${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }

      displayWeatherCards([data]);
    })
    .catch(err => {
      console.error('Error fetching city weather:', err);
      alert('Could not fetch weather for that city.');
    });
});

// Render weather cards to the page
function displayWeatherCards(cities) {
  const container = document.getElementById('weatherResults');
  container.innerHTML = ''; // clear old results

  cities.forEach(city => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h2>${city.city}${city.country ? `, ${city.country}` : ''}</h2>
      <p><strong>Condition:</strong> ${city.condition}</p>
      <p><strong>Temp:</strong> ${city.temp_f} / ${city.temp_c}</p>
    `;

    container.appendChild(card);
  });
}
