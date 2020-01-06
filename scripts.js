$(document).ready(function () {

    var apiKey = "f4d0c08ac7ad557560dabd005df04fa8";
  
    const citylistStoreID = "citylist";
    var cityList = JSON.parse(localStorage.getItem(citylistStoreID));
    if(cityList === null){ cityList= []};

  
    function displaySearchHistory(){
      $("#searchHistory").empty();
      $.each(cityList, function (index, item){
        
        var listItem = $("<li class='list-group-item'>");
  
        listItem.text(item);
        listItem.attr("data-cityname",item);
        
        $("#searchHistory").prepend(listItem);
      });
    };


  
    
    function getWeather(lat, lon, city) {
  
      var baseURL = "https://api.openweathermap.org/data/2.5/";
  
      if (lat !== undefined && lon !== undefined) {
        var queryParam = "lat=" + lat + "&lon=" + lon;
      }
      else {
        var queryParam = "q=" + city;
      };
  
  
      var openWeatherUrl = baseURL + "weather?&units=imperial&" + queryParam + "&APPID=" + apiKey;
      openWeatherUrl = encodeURI(openWeatherUrl);
  

      $.ajax({
        url: openWeatherUrl,
        method: "GET"
  
  
      }).then(function (responseW) {
  
        $("#currentDate").html(" (" + moment().format("M/D/YYYY") + ")");
  
        $("#cityName").html(responseW.name); 
        $("#temperature").html("Temperature: "+ responseW.main.temp + " &#8457");
        $("#humidity").html("Humidity: "+ responseW.main.humidity + "%");
        $("#windSpeed").html("Wind Speed: "+ responseW.wind.speed + " MPH");

  
        var image_src = "https://openweathermap.org/img/wn/" + responseW.weather[0].icon +"@2x.png";
        $("#currentImg").attr("src",image_src);
        


        var uvIndexUrl = baseURL + "uvi?lat=" + responseW.coord.lat + "&lon=" + responseW.coord.lon + "&APPID=" + apiKey;
        $.ajax({
          url: uvIndexUrl,
          method: "GET"
  
        }).then(function (responseU) {
          $("#uvIndex").html("UV Index: <span class='bg-danger text-white py-1 px-2 rounded' >" + responseU.value +"</span>");
        })
  
      });
    };
    

    function getFiveDayWeather(lat, lon, city){
  

      var baseURL = "https://api.openweathermap.org/data/2.5/forecast?&cnt=5&units=imperial&";
      if (lat !== undefined && lon !== undefined) {
        var queryParam = "lat=" + lat + "&lon=" + lon;
      }
      else {
        var queryParam = "q=" + city;
      };
  
      var openWeatherUrl = baseURL + queryParam + "&APPID=" + apiKey;
      openWeatherUrl = encodeURI(openWeatherUrl);

  
      $.ajax({
        url: openWeatherUrl,
        method: "GET"
  
      }).then(function (response5DailyW) {
  
        
        $.each(response5DailyW.list, function(index, item){
          var dayField = "#day"+ (index+1); 
          var tempField = "#temperaturePlus"+ (index+1);
          var humidField = "#humidityPlus"+ (index+1);
          var imageField = "#imgDay"+ (index+1);
  
          $(dayField).text(moment().add(index+1, "days").format("M/D/YYYY"));
          $(tempField).html("Temp: "+ item.main.temp + " &#8457");
          $(humidField).html("Humidity: "+ item.main.humidity + "%");

  
          var image_src_forecast = "https://openweathermap.org/img/wn/" + item.weather[0].icon +"@2x.png";
          $(imageField).attr("src",image_src_forecast);
        });
  
  
  
      });
  
    };
    

    function init() {
  
      displaySearchHistory();
  
      navigator.geolocation.getCurrentPosition(locatePosition);
  
      function locatePosition(position) {
        getWeather(position.coords.latitude, position.coords.longitude,undefined);
        getFiveDayWeather(position.coords.latitude, position.coords.longitude,undefined);
      };
    };
    
    
    init();
  

    $("#searchButton").on("click", function (event) {
      event.preventDefault();

  
      var cityIndex = cityList.indexOf($("#citySearchTextField").val());
      if(cityIndex >= 0){ cityList.splice(cityIndex,1)};
      if(cityList.length >= 5){cityList.shift()};
      cityList.push($("#citySearchTextField").val());
      localStorage.setItem(citylistStoreID,JSON.stringify(cityList));
      displaySearchHistory();
  
      getWeather(undefined,undefined,$("#citySearchTextField").val());
      getFiveDayWeather(undefined,undefined,$("#citySearchTextField").val());
    });
  

    var input = document.getElementById('citySearchTextField');
    var options = {
      types: ["(cities)"]
    };
    new google.maps.places.Autocomplete(input, options);

  
    $("#searchHistory").on("click","li", function(){
      getWeather(undefined,undefined,this.dataset.cityname);
      getFiveDayWeather(undefined,undefined,this.dataset.cityname);
    });
  
  
    
  });