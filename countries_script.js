const resultsContainer = document.getElementById('results');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

// Mostrar 10 países aleatorios al cargar
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const allCountries = await res.json();

    // Mezclar aleatoriamente y seleccionar 10
    const random10 = allCountries.sort(() => 0.5 - Math.random()).slice(0, 10);
    displayCountries(random10);
  } catch (err) {
    resultsContainer.innerHTML = 'Error al cargar países.';
  }
});

// Buscar país por nombre
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  resultsContainer.innerHTML = 'Buscando...';

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=false`);
    if (!res.ok) throw new Error('País no encontrado');
    const data = await res.json();
    displayCountries(data);
  } catch (err) {
    resultsContainer.innerHTML = 'No se encontró ningún país.';
  }
});

// Mostrar países
function displayCountries(countries) {
  resultsContainer.innerHTML = '';
  countries.forEach(country => {
    const card = document.createElement('div');
    card.className = 'country-card';
    card.innerHTML = `
      <h2>${country.name.official}</h2>
      <img src="${country.flags.svg}" alt="Bandera de ${country.name.common}">
      <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
      <p><strong>Región:</strong> ${country.region}</p>
      <p><strong>Población:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Idiomas:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
    `;
    resultsContainer.appendChild(card);
  });
}
