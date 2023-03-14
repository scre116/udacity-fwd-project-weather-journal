/* Global Variables */

// Personal API Key for OpenWeatherMap API is not published for security reasons
const apiKey = '9615621bc51a7f388f0f36ccbb6a4cdd';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

const SERVER_BASE_URL = 'http://localhost:8000';
const OPEN_WEATER_MAP_BASE_URL = `http://api.openweathermap.org/data/2.5/weather`;

async function generateData() {
    try {
        const zipCode = document.getElementById('zip').value;

        const feelings = document.getElementById('feelings').value;
        const temperature = await getTemperature(zipCode);

        console.log("received temperature: ", temperature);

        const data = {
            date: newDate,
            temperature: temperature,
            feelings: feelings
        }
        console.log("data to be sent to server: ", data);

        await sendToBackend(data);
        const dataFromBackend = await getFromBackend();
        console.log("data from backend: ", dataFromBackend);

        updateUI(dataFromBackend);
    } catch (error) {
        console.log("error", error);
    }

}

//  Fetch temperature from OpenWeatherMap API
async function getTemperature(zipCode) {
    const url = new URL(OPEN_WEATER_MAP_BASE_URL);
    url.searchParams.append('zip', zipCode);
    url.searchParams.append('appid', apiKey);
    url.searchParams.append('units', 'imperial');

    try {
        const result = await get(url);
        // if cod is 2xx, then result is a valid response
        if (result.cod >= 200 && result.cod < 300) {
            return result.main.temp;
        } else {
            console.error("could not fetch temperature from OpenWeatherMap", result);
            return "N/A";
        }
    } catch (error) {
        console.error("could not fetch temperature from OpenWeatherMap", error);
        return "N/A";
    }
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
    document.getElementById('temp').innerHTML = data.temperature + " °F";
    document.getElementById('content').innerHTML = data.feelings;
}

// add listener to generate button
document.getElementById('generate').addEventListener('click', generateData);