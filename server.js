// Setup empty JS object to act as endpoint for all routes
const projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross-origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8000;
app.listen(port, function () {
    console.log(`running on localhost: ${port}`);
});

// GET route
app.get('/all', function (request, response) {
    console.log('GET all');
    response.send(projectData);
});

// POST route
// request example:
// {
//     "date": "01.01.2020",
//     "temperature": 20,
//     "feelings": "I am feeling good"
// }
app.post('/add', function (request, response) {
    console.log('POST add');
    projectData['date'] = request.body.date;
    projectData['temperature'] = request.body.temperature;
    projectData['feelings'] = request.body.feelings;
    console.log(projectData);
    response.send("OK");

});

