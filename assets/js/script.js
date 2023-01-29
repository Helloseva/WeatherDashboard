var apiKey = "c930bf6f68b3d8e517378bd63f068cbb";
var searchBtn = document.querySelector("#btn-search");
var city = "";
var forecast = document.querySelector("#forecast-cards");
var windIndex = document.querySelector("#windIndex");
var cityName = document.querySelector("#city-name");
var historyArray = JSON.parse(localStorage.getItem("history")) || [];

// creates history buttons when city is searched //
function makeButtons(cityName) {
  var newButton = document.createElement("button");
  newButton.textContent = cityName;
  newButton.setAttribute("class", "historyBtns");
  newButton.addEventListener("click", function () {});

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


// click function to grab city entered in input box, search it in apiURL, and show hidden boxes//
searchBtn.onclick = function getCity() {
  forecast.className = "show";
  windIndex.className = "show";
  // creates the value for city to use in api url //
  city = document.getElementById("search-city").value.trim();
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
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
       "Temperature: " + weather.main.temp;
     document.getElementById("humidity").innerHTML =
       "Humidity: " + weather.main.humidity;
     document.getElementById("wind").innerHTML =
       "Wind Speed: " + weather.wind.speed;
     $("#icon1").empty();
     var icon1 = $("<img>").attr(
       "src",
       "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
     );
     $("#icon1").append(icon1);

     // sets variables to use in next 2 api URLs //
     var lat = weather.coord.lat;
     var lon = weather.coord.lon;
     // api url for UV index //
     var queryURL2 = `http://api.openweathermap.org/data/2.5/wind?appid=${apiKey}&lat=${lat}&lon=${lon}`;
     // api URL for 5 day forecast //
     var queryURL3 = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
