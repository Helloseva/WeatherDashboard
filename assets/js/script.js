// global variables //
var apiKey = "c930bf6f68b3d8e517378bd63f068cbb";
var searchBtn = document.querySelector("#btn-search");
var forecast = document.querySelector("#forecast-cards");
var city = "";
var cityName = document.querySelector("#city-name");
var windIndex = document.querySelector("#windIndex");
var historyArray = JSON.parse(localStorage.getItem("history")) || [];

// searching city with history button //
function makeButtons(cityName) {
  var newButton = document.createElement("button");
  newButton.textContent = cityName;
  newButton.setAttribute("class", "historyBtns");
  newButton.addEventListener("click", function () { });

  $(".history").append(newButton);
}

// clearing local storage and deleting history buttons with clear button //
for (var i = 0; i < historyArray.length; i++) {
  makeButtons(historyArray[i]);
}

$("#btn-clear").on("click", function () {
  $(".history").empty();
  localStorage.clear();
});

// click function to grab city entered in input box, search it in queryURL//
searchBtn.onclick = function getCity() {
  forecast.className = "show";
  windIndex.className = "show";
  // creates the value for city to use in query url //
  city = document.getElementById("search-city").value.trim();
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
  // using moment to show current date in top column and next 5 dates in each forecast card //
  document.getElementById("city-date").innerHTML = moment().format("L");
  makeButtons(city);
  historyArray.push(city);
  localStorage.setItem("history", JSON.stringify(historyArray));

  // first api fetch request //
  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var weather = data;

      // inserts current weather info into html for top column //
      document.getElementById("city-name").innerHTML = weather.name;
      document.getElementById("temp").innerHTML =
        "Temperature: " + weather.main.temp + " °C";
      document.getElementById("humidity").innerHTML =
        "Humidity: " + weather.main.humidity + "%";
      document.getElementById("wind").innerHTML =
        "Wind Speed: " + weather.wind.speed;
      $("#icon1").empty();
      var icon1 = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
      );
      $("#icon1").append(icon1);

      // variables to use in queryURLs //
      var lat = weather.coord.lat;
      var lon = weather.coord.lon;
      // api url for Wind index //
      var queryURL2 = `http://api.openweathermap.org/data/2.5/wind?appid=${apiKey}&lat=${lat}&lon=${lon}`;
      // api URL for 5 day forecast //
      var queryURL3 = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;


      // fetch request for Wind  //
      return fetch(queryURL2)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // sets Wind index into html//
          var span = document.getElementById("wind");
          span.textContent = data.value;

          // fetch request for 5 day forecast
          return fetch(queryURL3)
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
              $("#5DayForecast").empty();
              for (var i = 4; i < data.list.length; i += 8) {
                console.log(data.list[i]);
                var forecastCard = $("<div>").addClass("forecast-cards");
                var date = $("<p>")
                  .addClass("date")
                  .text(moment.unix(data.list[i].dt).format("l"));
                var temp = $("<p>")
                  .addClass("temp")
                  .text("temp: " + data.list[i].main.temp + " °C");
                var humidity = $("<p>")
                  .addClass("humidity")
                  .text("humidity: " + data.list[i].main.humidity + " %");
                var wind = $("<p>")
                  .addClass("wind")
                  .text("wind speed: " + data.list[i].wind.speed + " KPH");
                var icon = $("<img>").attr(
                  "src",
                  "http://openweathermap.org/img/w/" +
                  data.list[i].weather[0].icon +
                  ".png"
                );
                forecastCard.append(date, icon, temp, humidity, wind);
                $("#5DayForecast").append(forecastCard);
              }
            });
        });
    });
};