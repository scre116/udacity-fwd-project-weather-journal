/* Global Variables */

// Personal API Key for OpenWeatherMap API is not published for security reasons
const apiKey = '9615621bc51a7f388f0f36ccbb6a4cdd';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

const SERVER_BASE_URL = 'http://localhost:8000';
const OPEN_WEATER_MAP_BASE_URL = `http://api.openweathermap.org/data/2.5/weather`;

async function generateData() {
    const zipCode = document.getElementById('zip').value;

    const feelings = document.getElementById('feelings').value;
    const weatherData = await getWeather(zipCode);

    console.log("received weather data: ", weatherData);
    const temperature = weatherData.main.temp;

    const data = {
        date: newDate,
        temperature: temperature,
        feelings: feelings
    }
    console.log("data to be sent to server: ", data);

    await sendToBackend(data);
    const dataFromBackend = await getFromBackend();
    console.log("data from backend: ", dataFromBackend);

    // updateUI();

}

//  Fetch weather data from OpenWeatherMap API
const getWeather = async (zipCode) => {
    const url = new URL(OPEN_WEATER_MAP_BASE_URL);
    url.searchParams.append('zip', zipCode);
    url.searchParams.append('appid', apiKey);
    url.searchParams.append('units', 'imperial');

    return await get(url);
}

async function get(url) {
    const response = await fetch(url);
    try {
        return await response.json();
    } catch (error) {
        console.log("error", error);
    }
}

async function sendToBackend(data) {
    await post('/add', data);
}

async function post(endpoint, data) {
    return await fetch(SERVER_BASE_URL + endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

async function getFromBackend() {
    return await get(SERVER_BASE_URL + '/all');
}

// add listener to generate button
document.getElementById('generate').addEventListener('click', generateData);