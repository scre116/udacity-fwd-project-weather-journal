/* Global Variables */

// Personal API Key for OpenWeatherMap API is not published for security reasons
const apiKey = '<your api key>';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();


//  Fetch weather data from OpenWeatherMap API
const getWeather = async (zipCode) => {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=imperial`);
    try {
        return await response.json();
    } catch (error) {
        console.log("error", error);
    }
}

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
    // await postData('/add', data);

    // updateUI();
}

// add listener to generate button
document.getElementById('generate').addEventListener('click', generateData);