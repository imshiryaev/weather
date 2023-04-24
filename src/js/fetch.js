import { changeCity, changeDetails } from "./main.js";
import { searchInput } from "./vars.js";
export { weatherFetch, cityName, data, getCityName };

let data;
let cityName;

function getCityName() {
    cityName = searchInput.value;
}

async function weatherFetch(cityName) {

    const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
    const apiKey = 'a8f903109391163589af2f4af05130f7';
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

    const sendFetch = await fetch(url);
    data = await sendFetch.json();


    changeDetails(data);
    changeCity(cityName);
}