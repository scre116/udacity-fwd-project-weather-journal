/* Global Variables */

// API Key for OpenWeatherMap API
const apiKey = '9615621bc51a7f388f0f36ccbb6a4cdd';

const SERVER_BASE_URL = 'http://localhost:8000';
const OPEN_WEATHER_MAP_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

/* Functions */
// Listener for generate button
async function generateData() {
    try {
        const zipCode = document.getElementById('zip').value;
        const feelings = document.getElementById('feelings').value;

        const temperature = await getTemperature(zipCode);
        console.log("received temperature: ", temperature);

        const data = {
            date: getDate(),
            temperature: temperature,
            feelings: feelings
        }

        console.log("data to be sent to server: ", data);
        await sendToBackend(data);

        const dataFromBackend = await getFromBackend();
        console.log("data from backend: ", dataFromBackend);

        updateUI(dataFromBackend);
    } catch (error) {
        console.error("error", error);
    }

}

//  Fetch temperature from OpenWeatherMap API
async function getTemperature(zipCode) {
    const url = new URL(OPEN_WEATHER_MAP_BASE_URL);
    url.searchParams.append('zip', zipCode);
    url.searchParams.append('appid', apiKey);
    url.searchParams.append('units', 'imperial');

    try {
        const result = await get(url);
        // if code is 2xx, then result is a valid response
        if (result.cod >= 200 && result.cod < 300) {
            return result.main.temp + " °F";
        } else {
            console.error("could not fetch temperature from OpenWeatherMap", result);
            return "N/A";
        }
    } catch (error) {
        console.error("could not fetch temperature from OpenWeatherMap", error);
        return "N/A";
    }
}

function getDate() {
    const d = new Date();
    // format date as DD.MM.YYYY with leading zeros
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = d.getFullYear();

    return `${day}.${month}.${year}`;
}

async function get(url) {
    const response = await fetch(url);

    return await response.json();
}

async function sendToBackend(data) {
    await fetch(SERVER_BASE_URL + '/add', {
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

function updateUI(data) {
    document.getElementById('date').innerHTML = data.date;
    document.getElementById('temp').innerHTML = data.temperature;
    document.getElementById('content').innerHTML = data.feelings;
}

// add listener to generate button
document.getElementById('generate').addEventListener('click', generateData);