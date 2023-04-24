import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { cityName, getCityName, weatherFetch } from "/src/js/fetch.js";
import { searchInput, degreesValue, cityNameHtml, weatherDegreeHtml, likeHtml, favoritelocationLists, weatherFeels, weatherWeather, weatherSunrise, weatherSunset, weatherInfo } from "/src/js/vars.js";

export { changeDetails, changeCity };


let citySet = new Set();

if (localStorage.getItem('favoriteCity')) {
    citySet = new Set(JSON.parse(localStorage.getItem('favoriteCity')));

}

const currentCity = localStorage.getItem('getCurrentCity');

function checkLocalStorage() {
    if (localStorage.getItem('getCurrentCity') !== null) {
        weatherFetch(currentCity);
        weatherInfo.classList.remove('display-none');
    }
}

window.onload = function onLoad() {
    citySet.forEach((newCity) => render(newCity));
};

checkLocalStorage();


searchInput.addEventListener('keyup', function (event) {
    if (event.code === 'Enter' && searchInput.value !== '') {
        event.preventDefault();
        getCityName();
        clearInput();
        weatherFetch(cityName);
        weatherInfo.classList.remove('display-none');
    }
});

function clearInput() {
    searchInput.value = '';
    searchInput.focus();

}

function changeDetails(data) {
    degreesValue.textContent = `${Math.floor(data.main.temp)}`;
    degreesValue.insertAdjacentHTML('beforeend', '<span>&deg;</span>');
    const degreesResult = degreesValue.textContent;
    weatherDegreeHtml.textContent = degreesResult;

    weatherFeels.textContent = data.main.feels_like;
    weatherWeather.textContent = data.weather[0].main;


    const unixSunrise = ((data.sys.sunrise + data.timezone) * 1000);
    const sunriseTime = format(utcToZonedTime(new Date(unixSunrise)), 'HH:mm',);

    const unixSunset = ((data.sys.sunset + data.timezone) * 1000);
    const sunsetTime = format(utcToZonedTime(new Date(unixSunset)), 'HH:mm',);


    weatherSunrise.textContent = sunriseTime;
    weatherSunset.textContent = sunsetTime;
}

function changeCity(cityName) {
    // for (let i = 0; i < cityNameHtml.length; i++) {
    //     cityNameHtml[i].textContent = cityName;
    // }
    function setCityName(i) {
        if (i >= cityNameHtml.length) {
            return;
        } else {
            cityNameHtml[i].textContent = cityName;
            setCityName(i + 1);
        }
    }
    setCityName(0);
}

function addFavoriteCity() {

    function City(cityName) {
        this.id = Date.now(),
            this.name = cityName;
    }

    if (cityName !== undefined) {
        // favoriteCityList.push(newFavoriteCity);
        const newCity = new City(cityName);
        citySet.add(newCity);
        saveToLocalStorage();
        render(newCity);
    }
}

function deleteFavoriteCity(event) {
    let target = event.target;
    if (target.dataset.action === 'delete') {
        const parentNode = target.closest('li');
        const id = +parentNode.id;
        citySet.forEach(newCity => newCity.id === id ? citySet.delete(newCity) : newCity);
        // const index = favoriteCityList.findIndex((index) => index.id === id);
        // favoriteCityList.splice(index, 1);
        saveToLocalStorage();
        parentNode.remove();

        if (parentNode.firstChild.textContent === currentCity) {
            localStorage.removeItem('getCurrentCity');
        }
    }
}

function selectFavoriteCity(event) {
    const target = event.target;
    if (target.className === 'favoriteCity-name') {
        let weatherInfo = document.querySelector('.weather-info__main');
        weatherInfo.classList.remove('display-none');
        weatherFetch(event.target.textContent);
        localStorage.setItem('getCurrentCity', event.target.textContent);
    }
}

favoritelocationLists.addEventListener('click', deleteFavoriteCity);
favoritelocationLists.addEventListener('click', selectFavoriteCity);

if (document.querySelector('#like')) {
    likeHtml.addEventListener('click', addFavoriteCity);
}

function saveToLocalStorage() {
    localStorage.setItem('favoriteCity', JSON.stringify([...citySet]));
}

function render(newCity) {
    createElement(newCity);

}

function createElement(newCity) {
    const li = document.createElement('li');
    li.id = newCity.id;
    li.classList.add('favoriteCity-item');
    favoritelocationLists.append(li);

    const span = document.createElement('span');
    span.classList.add('favoriteCity-name');
    span.textContent = newCity.name;
    li.append(span);

    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-action', 'delete');
    button.classList.add('button');
    li.append(button);

    const img = document.createElement('img');

    img.alt = 'delete';
    img.width = '18';
    img.height = '18';
    img.src = new URL('/src/img/delete.svg', import.meta.url);
    button.append(img);
}