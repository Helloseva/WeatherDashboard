var apiKey = "c930bf6f68b3d8e517378bd63f068cbb";
var searchBtn = document.querySelector("#btn-search");
var city = "";
var forecast = document.querySelector("#forecast-cards");
var windIndex = document.querySelector("#windIndex");
var cityName = document.querySelector("#city-name");
var historyArray = JSON.parse(localStorage.getItem("history")) || [];