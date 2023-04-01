import { changeCity, changeDegrees } from "./main.js";
import { searchInput, degreesValue, cityNameHtml, weatherDegreeHtml } from "./vars.js";
export { weatherFetch, cityName, resultFetch };


let resultFetch;
let cityName;

async function weatherFetch() {
	const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
	cityName = searchInput.value;
	const apiKey = 'a8f903109391163589af2f4af05130f7';
	const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

	const sendFetch = await fetch(url);

	resultFetch = await sendFetch.json();

	changeDegrees();
	changeCity();
}