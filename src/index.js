import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import debounce from 'lodash.debounce';
import Notiflix, { Notify } from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');
const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(e => {
    e.preventDefault();
    if(searchBox.value) {
        const name = searchBox.value.trim();
        return fetchCountries(name).then(showCountries).catch(error);
    } else {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
    }
}, DEBOUNCE_DELAY));

function showCountries(countries) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    if(countries.length > 10) {
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.', {timeout: 1000})
    }
    if(countries.length >= 2){
        secondMarkup(countries);
    }
    if(countries.length === 1) {
        firstMarkup(countries);
    }
};

function secondMarkup(countries) {
    const secondMarkup = countries.map(({name, capital, population, flags, languages }) => {
        return `<li><img src="${flags.svg}" alt="Flag of ${name.official}" style="height: 30px; width: 50px"> ${name.official}</li>`
    }).join('');
    countryList.innerHTML = secondMarkup;
};

function firstMarkup(countries) {
    countries.map(({ name, capital, population, flags, languages }) => {
        const markup = 
        `<h1><img src="${flags.svg}" alt="Flag of ${name.official}" style="height: 60px; width: 60px; padding-top: 20px"> ${name.official}</h1>
        <li>Capital: ${capital} </li>
        <li>Population: ${population}</li>
        <li>Languages: ${Object.values(languages)}</li>`;
        countryInfo.innerHTML = markup;
    })
};

function error() {
    return Notiflix.Notify.failure('Oops, there is no country with that name', {timeout: 1000});
};
