import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchForm: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryBox: document.querySelector('.country-info'),
};

refs.searchForm.addEventListener(
  'input',
  debounce(handleSearch, DEBOUNCE_DELAY)
);

function handleSearch(e) {
  e.preventDefault();

  const name = refs.searchForm.value.trim();

  fetchCountries(name)
    .then(countries => {
      refs.countryBox.innerHTML = '';
      refs.countryList.innerHTML = '';
      if (countries.length === 1) {
        refs.countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
        refs.countryBox.insertAdjacentHTML(
          'beforeend',
          renderCountryBox(countries)
        );
      } else if (countries.length >= 10) {
        warnAboutSpecificity();
      } else {
        refs.countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
      }
    })
    .catch(wrongName);
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag" width = 40px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })

    .join('');
  return markup;
}

function renderCountryBox(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__items">
            <li class="country-info__item"><p>Capital: ${capital}</p></li>
            <li class="country-info__item"><p>Population: ${population}</p></li>
            <li class="country-info__item"><p>Languages: ${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join('');
  return markup;
}

function warnAboutSpecificity() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function wrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name.');
}
