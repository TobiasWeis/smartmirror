var calendar = {
  start: function() {
    window.setTimeout(calendar.google.checkAuth, 1000);
  },

  google : {
    events: [],

    updateEvents: function(events) {
      if (events.length > 0) {
        // append the events to the list of all events
        this.events = this.events.concat(events);

        // sort the events by date
        this.events.sort(function(a, b) {
          var aDates = this.getEventDates(a);
          var bDates = this.getEventDates(b);

          if (aDates.start < bDates.start)
            return -1;
          if (aDates.start > bDates.start)
            return 1;

          if (aDates.fullDay)
            return -1;
          if (bDates.fullDay)
            return 1;

          return 0;
        }.bind(this));

        // make sure that we don't display too many events
        if (this.events.length > config.calendar.maximumEvents) {
          this.events.splice(config.calendar.maximumEvents, this.events.length - config.calendar.maximumEvents);
        }
      }

      // clear all previously loaded events
      var tag = $("#calendar-events");
      tag.html("");

      // if there are no events we show a special message
      if (this.events.length <= 0) {
        tag.html(lang.calendar.noEvents);

        return;
      }

      // display all events
      tag.append("<table></table>")
      for (i = 0; i < this.events.length; i++) {
        var event = this.events[i];

        var dates = this.getEventDates(event);
        calendar.appendEvent(event.summary, dates.start, dates.end, dates.fullday);
      }
    },

    getEventDates: function(event) {
      var dates = {
        start: null,
        end: null,
        fullday: false
      };

      if (event.start.dateTime) {
        dates.start = new Date(event.start.dateTime);
        dates.end = new Date(event.end.dateTime);
      }
      else {
        dates.fullday = true;
        dates.start = new Date(event.start.date);
        dates.end = new Date(event.end.date);
      }

      return dates;
    },

    /**
     * Check if current user has authorized this application.
     */
    checkAuth: function(immediate) {
      immediate = typeof immediate !== "undefined" ? immediate : true;
      gapi.auth.authorize(
        {
          'client_id': config.calendar.google.clientId,
          'scope': config.calendar.google.scopes.join(' '),
          'immediate': immediate
        },
        calendar.google.handleAuthResult);
    },

    /**
     * Handle response from authorization server.
     *
     * @param {Object} authResult Authorization result.
     */
    handleAuthResult: function(authResult) {
      var authorizeUi = document.getElementById("calendar-authorization");
      if (authResult && !authResult.error) {
        // hide auth UI
        if (authorizeUi)
          authorizeUi.style.display = "none";

        // refresh the 
        calendar.google.loadCalendarEvents();
        setInterval( function() {
          this.loadCalendarEvents();
        }.bind(this), config.calendar.refreshIntervalMs);
      }
      else if (authorizeUi) {
        // show auth UI allowing the user to initiate authorization by clicking authorize button
        authorizeUi.style.display = "inline";
      }
    },

    /**
     * Initiate auth flow in response to user clicking authorize button.
     *
     * @param {Event} event Button click event.
     */
    handleAuthClick: function(event) {
      calendar.google.checkAuth(false);
      return false;
    },

    /**
     * Load Google Calendar client library. List upcoming events
     * once client library is loaded.
     */
    loadCalendarEvents: function() {
      gapi.client.load('calendar', 'v3', calendar.google.listEvents);
    },

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    listEvents: function() {
      // clear all current events
      this.events = [];

      calendarIds = config.calendar.google.calendars;
      if (!calendarIds || calendarIds.length <= 0)
        calendarIds = [ "primary" ];

      var startDate = (new Date()).toISOString();
      var endDate = (new Date().addDays(config.calendar.maximumDays)).toISOString();

      for (i = 0; i < calendarIds.length; i++) {
        var request = gapi.client.calendar.events.list({
          'calendarId': calendarIds[i],
          'timeMin': startDate,
          'timeMax': endDate,
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': config.calendar.maximumEvents,
          'orderBy': 'startTime'
        });

        request.execute(function(resp) {
          calendar.google.updateEvents(resp.items);
        }.bind(this));
      }
    }
  },

  appendEvent: function(summary, start, end, fullday) {
    var startend = lang.calendar.fullDay;
    if (!fullday)
      startend = moment(start).format('HH:mm') + ' - ' + moment(end).format('HH:mm');

    $("#calendar-events table").append('<tr><td class="date widget-heading">' + moment(start).format('D. MMM') + '</td><td class="summary widget-heading">' + summary + '</td></tr><tr><td class="weekday widget-detail">' + moment(start).format('ddd') + '</td><td class="startend widget-detail">' + startend + '</td></tr>');
  }
};
