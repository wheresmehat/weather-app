const express = require("express");
const hbs = require("hbs");
const fs = require("fs");
const path = require('path');

const {getWeather} = require("./weather-app/app-promise"); 

const port = process.env.PORT || 3000;
 
var app = express();

var inputAddress;
var errorCaught;

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, '/weather-app')));

hbs.registerHelper("getCurrentYear", () => {

    return new Date().getFullYear();
});


app.get("/", (req, res) => {

    res.render("weather.hbs");
    
});


app.get("/place", (req, res) => {

    inputAddress = req.query.loc;
    
    getWeather(inputAddress)
    .then((objFormatted) => {

        res.render("weather.hbs", {

            locationReport: objFormatted.locationFormatted,
            weatherReport: objFormatted.weatherFormatted
        });

    })
    .catch((err) => {

        console.log("Final catch:", err);

        var catchError = "Something went wrong. Please try again."

        if (err === "Unable to find that address." || err === "Unable to connect to API servers.") {

            catchError = err;
        }

        res.render("weather.hbs", {

            error: catchError
        });
    });
  
});


app.listen(port, () => {

    console.log(`Server is up on port ${port}`);
});