const axios = require("axios");

const tempConverter = require("./tempConverter");

function getWeather(inputAddress) {

    return new Promise((resolve, reject) => {

        var locationFormatted;

        var encodedAddress = encodeURIComponent(inputAddress);
        var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

        axios.get(geocodeUrl)
        .then((response) => {

            if (response.data.status === "ZERO_RESULTS") {

                reject("Unable to find that address.");
            }

            var lat = response.data.results[0].geometry.location.lat;
            var lng = response.data.results[0].geometry.location.lng;

            var weatherUrl = `https://api.darksky.net/forecast/d4ff896c0d7ca1ac989846b45ac6daf7/${lat},${lng}`;

            console.log("---------------------------");

            locationFormatted = response.data.results[0].formatted_address;

            console.log(locationFormatted);

            return axios.get(weatherUrl);
        })
        .then((response) => {

            var temperature  = ((response.data.currently.temperature - 32) * 5 / 9).toFixed(1);
            var apparentTemperature = ((response.data.currently.apparentTemperature - 32) * 5 / 9).toFixed(1);

            weatherFormatted = {

                currentTemp: `Current temperature: ${temperature} \u00B0C`,
                apparentTemp: `It feels like: ${apparentTemperature} \u00B0C`,
                precipProb: `Precipitation probability: ${response.data.currently.precipProbability}%`,
                windSpeed: `Wind speed: ${(response.data.currently.windSpeed * 1.61).toFixed(1)} km/h`,
                humidity: `Humidity: ${(response.data.currently.humidity * 100).toFixed(1)}%`,
                forecast: `Forecast: ${tempConverter.convertFtoC(response.data.daily.summary)}`

            };

            console.log(weatherFormatted);

            resolve({locationFormatted, weatherFormatted});

        })
        .catch((err) => {

            if (err.code === "ENOTFOUND") {

                reject("Unable to connect to API servers.");
            
            }
            else {

                reject(err.message);
            }

        });




            });

}


module.exports.getWeather = getWeather;

