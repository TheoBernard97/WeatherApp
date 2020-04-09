const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const months = [
    "Janvier",
    "Fevrier",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Decembre",
  ];
  const date = new Date();
  const weekDay = days[date.getDay()];
  const numberDay = date.getDate();
  const month = months[date.getMonth()];
  const currentDay = weekDay + " " + numberDay + " " + month;
  res.render("index", { currentDay: currentDay });
});

app.post("/", function (req, res) {
  const apiKey = "1f6f5986763c0de8cf5133ef6670b28a";
  const query = req.body.cityName;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?units=" +
    unit +
    "&q=" +
    query +
    "&appid=" +
    apiKey;

  https.get(url, function (response) {
    if (response.statusCode === 200) {
      console.log("No problem.");

      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const iconTag = weatherData.weather[0].icon;
        const imgURL =
          "http://openweathermap.org/img/wn/" + iconTag + "@2x.png";
        res.write(
          "<h1>Il fait actuellement " +
            Math.floor(temp) +
            " C a " +
            query +
            ".</h1>"
        );
        res.write("<img src='" + imgURL + "'/>");
        res.send();
      });
    } else if (response.statusCode === 404) {
      console.log("Error 404 !");
    } else {
      console.log(response.statusCode);
    }
  });
});

app.listen(3000, function () {
  console.log("Weather app listening on port 3000!");
});
