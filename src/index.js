import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import listCountries from './parsel/listCountries.hbs';
import infoContries from './parsel/infoContries.hbs';

const DEBOUNCE_DELAY = 300;

const textInput = document.querySelector('#search-box');
const infiCountryEl = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

const addHtmlInfoCountry = data => {
  console.log(data);
  const { capital, flags, languages, name, population } = data[0];
  const objectInfo = {
    capital: capital[0],
    flags: flags.svg,
    languages: Object.values(languages).join(', '),
    name: name.official,
    population: population,
  };
  infiCountryEl.innerHTML = infoContries(objectInfo);
};

const addHtmlCountryList = data => {
  infiCountryEl.innerHTML = listCountries(data);
};



function ewentTargetValue(evt) {
  const outputTextInput = evt.target.value.trim();
  if (outputTextInput === '') {
    clearEl.all();
    return;
  }

  if (outputTextInput !== 0) {
    fetchCountries(outputTextInput)
      .then(data => {
        if (data.length >= 10) {
          clearEl.all();
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }

        if (data.length >= 2 && data.length <= 10) {
          clearEl.info();

          addHtmlCountryList(data);
          return;
        }
        if (data.length === 1) {
          clearEl.info();
          addHtmlInfoCountry(data);
          return;
        }
      })
      .catch(error => {
        clearEl.all();

        Notify.failure(error);
      });
  } else {
    clearEl.all();
  }
}
const clearEl = {
  all() {
    infiCountryEl.innerHTML = '';
      countryList.innerHTML = '';
    },
  
    list() {
      countryList.innerHTML = '';
    },
  
    info() {
      infiCountryEl.innerHTML = '';
    },
  };

textInput.addEventListener('input', debounce(ewentTargetValue, DEBOUNCE_DELAY));