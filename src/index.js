// Використовуй публічний API Rest Countries v2, а саме ресурс name, який 
// повертає масив об'єктів країн, що задовольнили критерій пошуку. 
// Додай мінімальне оформлення елементів інтерфейсу.

// Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс name і 
// повертає проміс з масивом країн - результатом запиту.Винеси її в окремий файл 
// fetchCountries.js і зроби іменований експорт.

import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';


const DEBOUNCE_DELAY = 300;
const refs = {
    inputEl: document.querySelector('#search-box'),
    countryListEl: document.querySelector('.country-list'),
    countryInfoEl: document.querySelector('.country-info'),
}

refs.inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));


function searchCountry(event) {
    
// видаляємо пробіли:
  const inputValue = event.target.value.trim();
  if (!inputValue) {
    resetMarkup(refs.countryListEl);
    resetMarkup(refs.countryInfoEl);
    return;
  }
// використовуємо створену експортовану функцію для пошуку країни за назвою 
// на сайті 'https://restcountries.com/v3.1/'
  fetchCountries(inputValue)
    .then(dataCountry => {
      if (dataCountry.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (dataCountry.length >= 2 && dataCountry.length <= 10) {
        resetMarkup(refs.countryListEl);
        markupCountryListEl(dataCountry);
        resetMarkup(refs.countryInfoEl);
      } else {
        resetMarkup(refs.countryInfoEl);
        murkupCountryInfoEl(dataCountry);
        resetMarkup(refs.countryListEl);
      }
    })
    .catch(() => {
      resetMarkup(refs.countryListEl);
      resetMarkup(refs.countryInfoEl);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

// додаємо розмітку у список країн
function markupCountryListEl(country) {
    const markup = country
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    })
    .join('');
  return refs.countryListEl.insertAdjacentHTML('beforeend', markup);
}
// const countryListItemEl = document.querySelector('.country-list__item')
// countryListItemEl.addEventListener('click', addTextToInput);
// const valueTargetEl = countryListItemEl.value;
// function addTextToInput(valueTargetEl) {
//     refs.inputEl.value = valueTargetEl;
// }

// додаємо розмітку у контейнер для знайденої країни
function murkupCountryInfoEl(country) {
    const markup = country
    .map(({ name, flags, capital, population, languages  }) => {
      return `<div class="country-info__flag">
    <img class="country-info__img" src="${flags.svg}" alt="flag">
    <p class="country-info__name">${name.official}</p>
  </div>
  <ul class="country-info__list">
      <li class="country-info__item"> <b>Capital</b>:
    <span class="country-info__span">${capital}</span>
      </li>
      <li class="country-info__item"> <b>Population</b>:
    <span class="country-info__span">${population}</span>
      </li>
      <li class="country-info__item"> <b>Languages</b>:
    <span class="country-info__span">${Object.values(languages).join(', ')}</span>
      </li>
  </ul>`;
    })
    .join('');
  return refs.countryInfoEl.insertAdjacentHTML('beforeend', markup);
}

// очистка розмітки
function resetMarkup(element) {
    element.innerHTML = '';
}