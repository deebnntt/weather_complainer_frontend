const cities = [];

class City {
	constructor(obj) {
		this.id = obj.id;
		this.name = obj.name;
		this.state = obj.state;
		cities.push(this);
	}
	static all() {
		return cities;
	}
	static renderDropDown(json) {
		json.forEach(city => {
			let cityOption = document.createElement('option');
			let cityName = city.name.replace(/_/g, ' ');
			cityOption.innerText = `${cityName}, ${city.state}`;
			cityOption.dataset.id = city.id;
			document.getElementById('city-list').add(cityOption);
		});
		document
			.getElementById('city-list')
			.addEventListener('change', ev => this.getCurrentWeather(ev));
	}

	static getCurrentWeather(ev) {
		let city = ev.target.value.split(', ');
		let cityId = ev.target.selectedIndex;
		let cityName = city[0];
		let state = city[1];
		const key = '1cc8bc5312ac5267';
		const URL = `http://api.wunderground.com/api/${key}/forecast/q/${state}/${cityName}.json`;
		fetch(URL)
			.then(res => res.json())
			.then(json => {
				return City.currentWeatherValues(json, cityId);
			})
			.then(current => api.getHistoricWeather(current));
	}

	static currentWeatherValues(json, cityId) {
		let highTemp = json.forecast.simpleforecast.forecastday[0].high.fahrenheit;
		let lowTemp = json.forecast.simpleforecast.forecastday[0].low.fahrenheit;
		let prec = json.forecast.simpleforecast.forecastday[0].qpf_allday.in;
		let conditions = json.forecast.simpleforecast.forecastday[0].conditions;
		let avehumidity = json.forecast.simpleforecast.forecastday[0].avehumidity;
		let avewind = json.forecast.simpleforecast.forecastday[0].avewind.mph;
		let myObj = {};
		myObj[cityId] = {
			high: parseInt(highTemp),
			low: parseInt(lowTemp),
			precipitation: prec,
			conditions: conditions,
			avg_humidity: avehumidity,
			avg_wind: avewind
		};
		return myObj;
	}
}
