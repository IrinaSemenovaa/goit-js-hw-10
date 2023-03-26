export function fetchCountries(name) {
  const params = new URLSearchParams({
    fields: 'name,capital,population,languages,flags',
  });
  const url = `https://restcountries.com/v3.1/name/${name}?${params.toString()}`;
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}
