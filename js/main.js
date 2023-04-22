import { weatherFetch, cityName, getCityName } from "./fetch.js";
import { searchInput, degreesValue, cityNameHtml, weatherDegreeHtml, likeHtml, favoritelocationLists, weatherDegree, weatherFeels, weatherWeather, weatherSunrise, weatherSunset } from "./vars.js";
export { changeDetails, changeCity };

let citySet = new Set();

if (localStorage.getItem('favoriteCity')) {
	citySet = new Set(JSON.parse(localStorage.getItem('favoriteCity')));
}
citySet.forEach((newCity) => render(newCity));

searchInput.addEventListener('keyup', function (event) {
	if (event.code === 'Enter' && searchInput.value !== '') {
		event.preventDefault();
		getCityName();
		weatherFetch(cityName);
		let weatherInfo = document.querySelector('.weather-info__main');
		weatherInfo.classList.remove('display-none');
	}
});

function changeDetails(resultFetch) {
	degreesValue.textContent = `${Math.floor(resultFetch.main.temp)}`;
	degreesValue.insertAdjacentHTML('beforeend', '<span>&deg;</span>');
	const degreesResult = degreesValue.textContent;
	weatherDegreeHtml.textContent = degreesResult;

	weatherFeels.textContent = resultFetch.main.feels_like;
	weatherWeather.textContent = resultFetch.weather[0].main;

	const unixSunrise = resultFetch.sys.sunrise;
	const sunrise = new Date((unixSunrise) * 1000);
	const sunriseTime = sunrise.getUTCHours() + ':' + sunrise.getUTCMinutes();

	const unixSunset = resultFetch.sys.sunset;
	const sunset = new Date((unixSunset) * 1000);
	const sunsetTime = sunset.getUTCHours() + ':' + sunset.getUTCMinutes();
	weatherSunrise.textContent = sunriseTime;
	weatherSunset.textContent = sunsetTime;
}

function changeCity(cityName) {

	for (let i = 0; i < cityNameHtml.length; i++) {
		cityNameHtml[i].textContent = cityName;
	}
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
	}
}

function selectFavoriteCity(event) {
	const target = event.target;
	if (target.className === 'favoriteCity-name') {
		let weatherInfo = document.querySelector('.weather-info__main');
		weatherInfo.classList.remove('display-none');
		weatherFetch(event.target.textContent);
	}
}

favoritelocationLists.addEventListener('click', deleteFavoriteCity);
favoritelocationLists.addEventListener('click', selectFavoriteCity);
likeHtml.addEventListener('click', addFavoriteCity);

function saveToLocalStorage() {
	localStorage.setItem('favoriteCity', JSON.stringify([...citySet]));
}

function render(newCity) {
	const cityHtml = `<li id="${newCity.id}" class="favoriteCity-item">
	<span class="favoriteCity-name">${newCity.name}</span>
	<div class="buttons">
		<button type="button" data-action="delete" class="button">
			<img src="/img/cross.svg" alt="test" width="18" height="18">
		</button>
	</div>
</li>`;
	favoritelocationLists.insertAdjacentHTML('beforeend', cityHtml);
}