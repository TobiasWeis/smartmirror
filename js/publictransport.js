var publictransport = {
  start: function() {
    // initialize public transport
    this.update();

    // register an interval timer to update public transport
    setInterval( function() {
      this.update();
    }.bind(this), config.publictransport.refreshIntervalMs);
  },
 
  update: function() {
    this.opendata.updateStationboard();
  },

  opendata: {
    urlBase: "http://transport.opendata.ch/" + config.publictransport.opendata.apiVersion + "/",
    urlEndpointStationboard: "stationboard",
    urlParams: {
      "limit": config.publictransport.maximumConnections,
      "id": config.publictransport.opendata.stations.from.id,
      "transportations": [
        "ice_tgv_rj",
        "ec_ic",
        "ir",
        "re_d"
      ]
    },

    updateStationboard: function() {
      requestData = this.urlParams;
      requestData["datetime"] = moment().add(config.publictransport.datetimeOffsetMin, 'minutes').format("YYYY-MM-DD HH:mm");

      $.ajax({
        type: "GET",
        url: this.urlBase + this.urlEndpointStationboard,
        data: requestData,
        dataType: 'json',

        success: function(result) {
          if (!result || !result.stationboard || result.stationboard.length <= 0)
            return;

          var html = "";
          for(i = 0; i < result.stationboard.length; i++) {
            var connection = result.stationboard[i];

            var matchingStations = [];
            for (j = 0; j < connection.passList.length; j++) {
              var passingStation = connection.passList[j];

              for (k = 0; k < config.publictransport.opendata.stations.to.length; k++) {
                var comparingStation = config.publictransport.opendata.stations.to[k];

                if (comparingStation.id == passingStation.station.id) {
                  matchingStations.push({
                    id: comparingStation.id,
                    name: comparingStation.name,
                    arrival: helper.toMillisecondsDate(passingStation.arrivalTimestamp)
                  });
                  break;
                }
              }
            }

            if (matchingStations.length <= 0)
              continue;
            
            var departure = helper.toMillisecondsDate(connection.stop.departureTimestamp);
            var delay = connection.stop.delay;
            var platform = connection.stop.platform;
            var name = connection.name;
            var destination = connection.to;
            var duration = matchingStations[matchingStations.length - 1].arrival - departure;

            var stations = "";
            for (j = 0; j < matchingStations.length; j++) {
              var station = matchingStations[j].name;
              if (station == destination)
                continue;

              if (stations.length > 0)
                stations += ", ";

              stations += matchingStations[j].name;
            }

            html += '<tr><td class="publictransport-departure widget-heading">' + moment(departure).format('HH:mm') + '</td>'
                    + '<td class="publictransport-destination widget-heading">' + destination + '</td>'
                    + '<td class="publictransport-platform widget-detail">' + platform + '</td>'
                  + '<tr><td class="publictransport-duration widget-detail">' + moment.utc(duration).format('HH:mm') + '</td>'
                    + '<td class="publictransport-stations widget-detail">' + stations + '</div></td>'
                    + '<td></td></tr>';
          }

          var publicTransportStationboardTag = $("#publictransport-stationboard");
          publicTransportStationboardTag.html('<table>' + html + '</table>');
          
          // TODO
        }.bind(this),

        error: function() {
        }
      });
    }
  }
}