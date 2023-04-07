import { weatherFetch, cityName, resultFetch, getCityName } from "./fetch.js";
import { searchInput, degreesValue, cityNameHtml, weatherDegreeHtml, likeHtml, favoritelocationLists, listsCity } from "./vars.js";
export { changeDegrees, changeCity };

let citySet = new Set();

if (localStorage.getItem('favoriteCity')) {
	citySet = new Set(JSON.parse(localStorage.getItem('favoriteCity')));
}
citySet.forEach((city) => render(city));


searchInput.addEventListener('keyup', function (event) {
	if (event.code === 'Enter' && searchInput.value !== '') {
		event.preventDefault();
		getCityName();
		weatherFetch(cityName);
		let weatherInfo = document.querySelector('.weather-info__main');
		weatherInfo.classList.remove('display-none');
	}
});

function changeDegrees(resultFetch) {
	degreesValue.textContent = Math.floor(resultFetch.main.temp);
	degreesValue.insertAdjacentHTML('beforeend', '<span>&deg;</span>');
	const degreesResult = degreesValue.textContent;
	weatherDegreeHtml.textContent = degreesResult;
}

function changeCity(cityName) {

	for (let i = 0; i < cityNameHtml.length; i++) {
		cityNameHtml[i].textContent = cityName;
	}
}

function addFavoriteCity() {

	function City(cityName) {
		this.id = Date.now(),
		this.name = cityName
	}

	if (cityName !== undefined) {
		// favoriteCityList.push(newFavoriteCity);
		const newCity = new City(cityName)
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
		citySet.forEach(city => city.id === id ? citySet.delete(city) : city);
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

function render(city) {
	const cityHtml = `<li id="${city.id}" class="favoriteCity-item">
	<span class="favoriteCity-name">${city.name}</span>
	<div class="buttons">
		<button type="button" data-action="delete" class="button">
			<img src="/img/cross.svg" alt="test" width="18" height="18">
		</button>
	</div>
</li>`;
	favoritelocationLists.insertAdjacentHTML('beforeend', cityHtml);
}