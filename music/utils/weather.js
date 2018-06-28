const rp = require('request-promise');
const api = require('../config/api');

const getWeatherInfo = (city) => {
	return rp({
		uri: 'http://api.openweathermap.org/data/2.5/weather',
		method: 'GET',
		qs: {
			APPID: api.weather.key,
			q: city
		},
		json: true
	})
}

module.exports = getWeatherInfo;