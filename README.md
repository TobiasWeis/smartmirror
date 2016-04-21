This repo contains the necessary www-files and scripts for my Smart(er) Mirror project:
![SmartMirror](http://blog.tobias-weis.de/wp-content/uploads/2016/04/watermarked_DSC_0731.jpg)

More details of the project can be found at http://blog.tobias-weis.de

# Structure
- www contains necessary files for displaying the page of the mirror
- scripts contains necessary programs that run via autostart or cronjob
- autostart contains .desktop-files that I used to autostart the scripts 

# www
This code has been mostly taken from http://github.com/Montellese/home-smart-mirror.git,
but due to my changes to the index-file I did not place a pull request and instead forked my own branch.

- For the weather, get an API key for openweathermap, then put it in js/config.js
- For the bitcoin api, get an API key from bitcoin.de, and put it in php/get_bitcoin.php

# Original README.md
# Home: Smart Mirror
Home: Smart Mirror is a web frontend for a smart mirror written in HTML, CSS and JavaScript. It supports a very basic configuration, localization and a few widgets.

## Configuration
The configuration is done in [config.js](js/config.js) and contains the possibility to change the localization and a few properties of the different widgets.

## Localization
Support for localization is achieved through a single JavaScript file in the [lang](lang/) directory for every language. Simply copy an existing localization file and adjust the strings.
Localization of all date and time formats is achieved directly through [Moment.js](http://momentjs.com/). Please see their website for a list of supported languages.

## Widgets
### Current date and time
This widget displays the current date in long format (weekday, day, month and year) and the current time (in 24-hour format with seconds).

### Weather
The weather data is retrieved from [OpenWeatherMap](http://openweathermap.org/) which requires a personal application API key.
#### Current weather
The current weather can be displayed for multiple locations. The displayed information is the city name, a [weather icon](http://erikflowers.github.io/weather-icons/), the current, highest and lowest temperature, the current humidity and cloud coverage and today's sunrise and sunset time.

#### Weather forecast
The weather forecast is displayed for the primary location for the next seven days. The displayed information is the weekday, a [weather icon](http://erikflowers.github.io/weather-icons/), the highest and lowest temperature, the current humidity and cloud coverage.

### Google calendar events
The calendar events are retrieved from [Google Calendar](https://www.google.com/calendar) using their public [Google Calendar API](https://developers.google.com/google-apps/calendar/) and their [JavaScript client](https://developers.google.com/google-apps/calendar/quickstart/js). Accessing your personal calendars is achieved through a personal and project specific OAuth 2.0 client ID.
The displayed events can come from multiple calendars (from the same Google account) and can be limited to a specific amount of events. For every event the displayed information contains the date (day, month and weekday), the summary and the start and end time.

### Public transport
The current public transport data is retrieved from [Transport](https://transport.opendata.ch/) providing access to the swiss public transport API. The displayed information contains the next 5 connections leaving from a specific train station which will pass and stop at a configurable list of other train stations. For every connection the display information contains the departure time, the duration to the last configured stop, the final destination and the platform on which the train will be leaving.

## Libraries
Home: Smart Mirror relies on a few external libraries to make coding easier:
* [jQuery](https://jquery.com/)
* [Moment.js](http://momentjs.com/)
