class API {
	constructor() {
		this.baseURL = 'http://localhost:3000/api/v1';
	}
	getCities() {
		fetch(`${this.baseURL}/cities`)
			.then(res => res.json())
			.then(json => City.renderDropDown(json));
	}

	getHistoricWeather(current) {
		let cityId = Object.keys(current)[0];
		fetch(`${this.baseURL}/historical_conditions/${cityId}`)
			.then(res => res.json())
			.then(json => complexAlgorithm(json, current));
		// .then(json => console.log(json));
	}
}
