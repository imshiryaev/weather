import { weatherFetch, cityName, resultFetch } from "./fetch.js";
import { searchInput, degreesValue, cityNameHtml, weatherDegreeHtml, likeHtml, favoritelocationLists, listsCity } from "./vars.js";

export { changeDegrees, changeCity };


searchInput.addEventListener('keyup', function (event) {
	if (event.code === 'Enter' && searchInput.value !== '') {
		event.preventDefault();
		weatherFetch();

		let weatherInfo = document.querySelector('.weather-info__main');
		weatherInfo.classList.remove('display-none');
	}
});



function changeDegrees() {
	degreesValue.textContent = Math.floor(resultFetch.main.temp);

	degreesValue.insertAdjacentHTML('beforeend', '<span>&deg;</span>');
	const degreesResult = degreesValue.textContent;
	weatherDegreeHtml.textContent = degreesResult;
}


function changeCity() {

	for (let i = 0; i < cityNameHtml.length; i++) {
		cityNameHtml[i].textContent = cityName;
	}
}

likeHtml.addEventListener('click', addFavoriteCity);

function addFavoriteCity() {
	const cityHtml = `<li class="favoriteCity-item">
						<span class="favoriteCity-name">${cityName}</span>
						<div class="buttons">
							<button type="button" data-action="delete" class="button">
								<img src="/img/cross.svg" alt="test" width="18" height="18">
							</button>
						</div>
					</li>`;
	if (cityName !== undefined) {
			favoritelocationLists.insertAdjacentHTML('beforeend', cityHtml);

	}
}


function deleteFavoriteCity(event) {
	let target = event.target;
	if (target.dataset.action === 'delete') {
		const parentNode = target.closest('li');
		parentNode.remove();
	}
}



async function selectFavoriteCity(event) {
	const target = event.target;

	if (target.className === 'favoriteCity-name') {
		const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
		const apiKey = 'a8f903109391163589af2f4af05130f7';
		const url = `${serverUrl}?q=${event.target.textContent}&appid=${apiKey}&units=metric`;
		const sendFetch = await fetch(url);
		const resultFetch = await sendFetch.json();

		degreesValue.textContent = Math.floor(resultFetch.main.temp);
		degreesValue.insertAdjacentHTML('beforeend', '<span>&deg;</span>');
		const degreesResult = degreesValue.textContent;
		weatherDegreeHtml.textContent = degreesResult;

		for (let i = 0; i < cityNameHtml.length; i++) {
			cityNameHtml[i].textContent = event.target.textContent;
		}
	}

}

favoritelocationLists.addEventListener('click', deleteFavoriteCity);
favoritelocationLists.addEventListener('click', selectFavoriteCity)

