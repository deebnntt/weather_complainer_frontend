class API {
	constructor() {
		this.baseURL = 'http://localhost:3000/api/v1';
	}
	getCities() {
		fetch(`${this.baseURL}/cities`)
			.then(res => res.json())
			.then(json => City.renderDropDown(json));
	}

	checkTodaysData() {
		fetch(`${this.baseURL}/historical_conditions/`)
			.then(res => res.json())
			.then(json => {
				if (json === false) getTodaysData();
			});
	}

	getHistoricWeather(current) {
		let cityId = Object.keys(current)[0];
		fetch(`${this.baseURL}/historical_conditions/${cityId}`)
			.then(res => res.json())
			.then(json => complexAlgorithm(json, current))
			.then(obj => renderStats(obj));
	}

	postNewHistoricData(postData) {
		let newPostData = {};
		newPostData['results'] = postData;
		let jsonPostData = JSON.stringify(newPostData);
		fetch(`${this.baseURL}/historical_conditions/update`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accepts: 'application/json'
			},
			body: jsonPostData
		});
	}
}
