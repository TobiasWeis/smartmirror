var weather = {
  start: function() {
    // initialize weather
    this.update();

    // register an interval timer to update weather
    setInterval( function() {
      this.update();
    }.bind(this), config.weather.refreshIntervalMs);
  },

  update: function() {
    this.openweathermap.updateCurrent();
    this.openweathermap.updateForecast();
  },

  getWeatherIcon: function(id, iconCode) {
    var icon = config.weather.openweathermap.icons[id].icon;

    // add day/night prefix
    if (iconCode && (id < 700 || id > 799) && (id < 900 || id > 999)) {
      var prefix = "day";
      if (iconCode.match(/^[0-9]{2}n$/))
        prefix = "night";

      icon = prefix + "-" + icon;
    }

    // sunny doesn't exist only day-sunny
    if (icon == "sunny")
      icon = "day-" + icon;

    return "wi wi-" + icon;
  },

  getWeatherHtml: function(city, icon, temp, tempMin, tempMax, humidity, clouds) {
    var html = '<td class="weather-city">' + city + '</td>'
             + '<td class="weather-icon"><span class="' + icon + '"></span></td>';
    
    if (temp != null)
      html += '<td class="weather-temp">' + temp + '&deg;</td>';

    if (tempMin != null && tempMax != null) {
      html += '<td class="weather-temp-minmax"><table>'
              + '<tr class="weather-temp-max"><td>' + lang.weather.temperatureHighShort + ':</td><td class="weather-temp-max">' + tempMax + '&deg;</td></tr>'
              + '<tr class="weather-temp-min"><td>' + lang.weather.temperatureLowShort + ':</td><td class="weather-temp-min">' + tempMin + '&deg;</td></tr>'
            + '</table></td>';
    }

    if (humidity != null || clouds != null) {
      html += '<td class="weather-humidity-clouds"><table>'
              + '<tr class="weather-humidity"><td class="weather-icon"><span class="wi wi-' + (humidity != null ? 'humidity' : 'na') + '"></span></td><td class="weather-temp-max">' + (humidity != null ? (humidity + '%') : '') + '</td></tr>'
              + '<tr class="weather-clouds"><td class="weather-icon"><span class="wi wi-' + (clouds != null ? 'cloud' : 'na') + '"></span></td><td class="weather-temp-min">' + (clouds != null ? (clouds + '%') : '') + '</td></tr>'
            + '</table></td>';
    }

    return html;
  },

  openweathermap: {
    urlBase: "http://api.openweathermap.org/data/" + config.weather.openweathermap.apiVersion + "/",
    urlEndpointCurrent: "group",
    urlEndpointForecast: "forecast/daily",
    urlParams: {
      "lang": config.lang,
      "units": config.weather.units,
      "APPID": config.weather.openweathermap.apiKey
    },

    updateCurrent: function() {
      var ids = "";
      for (i = 0; i < config.weather.openweathermap.cities.length; i++) {
        if (ids.length > 0)
          ids += ",";

        ids += config.weather.openweathermap.cities[i].id;
      }
      
      requestData = this.urlParams;
      requestData["id"] = ids;

      $.ajax({
        type: "GET",
        url: this.urlBase + this.urlEndpointCurrent,
        data: requestData,
        dataType: 'json',

        success: function(result) {
          if (!result || !result.list || result.list.length <= 0)
            return;

          var html = "";
          for (i = 0; i < result.list.length; i++) {
            var city = result.list[i];

            var temp = helper.round(city.main.temp, 1);
            var tempMin = helper.round(city.main.temp_min, 1);
            var tempMax = helper.round(city.main.temp_max, 1);

            var sunrise = helper.toMillisecondsDate(city.sys.sunrise);
            var sunset = helper.toMillisecondsDate(city.sys.sunset);

            var humidity = city.main.humidity;
            var clouds = city.clouds.all;

            var icon = weather.getWeatherIcon(city.weather[0].id, city.weather[0].icon);

            if (html.length > 0)
              html += '<td class="weather-filler"></td>';

            html += '<td><table>'
                    + '<tr><td><table><tr>' + weather.getWeatherHtml(city.name, icon, temp, tempMin, tempMax, humidity, clouds) + '</tr></table></td></tr>'
                    + '<tr><td class="weather-sunrise-sunset"><table><tr><td class="weather-icon"><span class="wi wi-sunrise"></span></td><td class="weather-sunrise">' + moment(sunrise).format('HH:mm') + '</td><td class="weather-filler"></td><td class="weather-icon"><span class="wi wi-sunset"></span></td><td class="weather-sunset">' + moment(sunset).format('HH:mm') + '</td></tr></table></td></tr>'
                  + '</table></td>';
          }

          var weatherCurrentTag = $("#weather-current");
          weatherCurrentTag.html('<table><tr>' + html + '</tr></table>');
        }.bind(this),

        error: function() {
        }
      });
    },

    updateForecast: function() {
      requestData = this.urlParams;
      requestData["id"] = config.weather.openweathermap.cities[0].id;

      $.ajax({
        type: "GET",
        url: this.urlBase + this.urlEndpointForecast,
        data: requestData,
        dataType: 'jsonp',

        success: function(result) {
          if (!result || !result.list || result.list.length <= 0)
            return;

          var html = "";
          var forecastDays = Math.min(result.list.length, config.weather.forecastDays)
          for (i = 0; i < forecastDays; i++) {
            var day = result.list[i];

            var time = helper.toMillisecondsDate(day.dt);
            
            var tempMin = helper.round(day.temp.min, 1);
            var tempMax = helper.round(day.temp.max, 1);

            var humidity = day.humidity;
            var clouds = day.clouds;

            var icon = weather.getWeatherIcon(day.weather[0].id);

            html += "<tr>" + weather.getWeatherHtml(moment(time).format('ddd'), icon, null, tempMin, tempMax, humidity, clouds) + "</tr>";
          }

          var weatherForecastTag = $("#weather-forecast");
          weatherForecastTag.html('<table>' + html + '</table>');
        }.bind(this),

        error: function() {
        }
      });
    }
  }
};
