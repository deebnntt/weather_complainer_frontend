api = new API();

window.addEventListener('onload', api.getCities());
window.addEventListener('onload', api.checkTodaysData());

function complexAlgorithm(historic, current) {
	historic = historic.filter(his => {
		let dayString = getToday();
		return his.date.includes(dayString);
	})[0];
	let complaintArr = [];
	for (var key in current) current = current[key];
	let avgHigh = historic.valueOf().daily_avg_high;
	if (current.precipitation > 0.15 || current.conditions === 'Rain') {
		complaintArr.push("It's going to rain!");
	}
	if (current.high - historic.daily_avg_high >= 10) {
		complaintArr.push("It's unseasonably hot!");
	}
	if (historic.daily_avg_low - current.low >= 10) {
		complaintArr.push("It's going to be so cold tonight");
	}
	if (historic.daily_avg_high - current.high >= 10) {
		complaintArr.push("It's going to be unseasonably cold today");
	}
	if (current.avg_humidity > 75) {
		complaintArr.push("It's so humid!");
	}
	if (
		current.high - historic.daily_avg_high >= 10 &&
		current.avg_humidity > 75
	) {
		complaintArr.push("It's so muggy and gross!");
	}
	if (complaintArr.length === 0) {
		complaintArr.push(
			'I have nothing to complain about, but I still feel sad.'
		);
	}
	renderComplaints(complaintArr);
	let obj = { current: current, historic: historic };
	return obj;
}

function renderComplaints(complaintArr) {
	document.getElementById('complaint-div').style.display = 'block';
	const complaintList = document.getElementById('complaint-list');
	complaintList.innerHTML = '';
	complaintArr.forEach(complaint => {
		let li = document.createElement('li');
		li.innerText = complaint;
		complaintList.appendChild(li);
	});
}

function renderStats(obj) {
	document.getElementById('stats-div').style.display = 'block';

	const conditionstd = document.getElementById('conditions');
	const hitemptd = document.getElementById('hi-temp');
	const lowtemptd = document.getElementById('lo-temp');
	const humiditytd = document.getElementById('humidity');
	const windtd = document.getElementById('wind');

	conditionstd.innerText = `${obj.current.conditions}`;
	hitemptd.innerText = `${obj.current.high.toString()}°`;
	lowtemptd.innerText = `${obj.current.low.toString()}°`;
	humiditytd.innerText = `${obj.current.avg_humidity.toString()}%`;
	windtd.innerText = `${obj.current.avg_wind.toString()} mph`;

	document.getElementById('hist-div').style.display = 'block';

	const histhitemptd = document.getElementById('hist-hi-temp');
	const histlowtemptd = document.getElementById('hist-lo-temp');

	histhitemptd.innerText = `${obj.historic.daily_avg_high
		.toFixed()
		.toString()}°`;
	histlowtemptd.innerText = `${obj.historic.daily_avg_low
		.toFixed()
		.toString()}°`;
}

function getToday() {
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() + 1;
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	today = mm + '-' + dd;
	return today;
}

// THESE ARE THE FUNCTIONS TO GET DATA FROM NOAA API

function getTodaysData() {
	fetch(url, myInit)
		.then(res => res.json())
		.then(json => json.results)
		.then(results => buildApiResults(results))
		.then(results => api.postNewHistoricData(results));
}
let stationIDs = {
	New_York: 'USW00094728',
	Boston: 'USW00014739',
	Chicago: 'USC00111497',
	Austin: 'USC00410433',
	Phoenix: 'USW00023183',
	Los_Angeles: 'USW00093134',
	Honolulu: 'USW00022521'
};
let dataTypeIDs = {
	daily_avg_high: 'dly-tmax-normal',
	daily_avg_low: 'dly-tmin-normal',
	month_to_date_avg_precip: 'mtd-prcp-normal'
};
let myResults = {};
let baseUrl = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/';
let token = 'SNDyBzJpjOQADLEIZJQUMsectrMzILGQ';
let myHeaders = new Headers();
myHeaders.append('token', `${token}`);
var myInit = {
	method: 'GET',
	headers: myHeaders
};
let appendDataID = `data?datasetid=NORMAL_DLY`;
let appendStartDate = `&startdate=${todaysDateIn2010()}`;
let appendEndDate = `&enddate=${todaysDateIn2010()}`;
let appendUnitType = `&units=standard`;
let appendStationIDs = convertStationIDsToURLs(stationIDs);
let appendDataTypeIDs = convertDateTypesToURLs(dataTypeIDs);
let url =
	baseUrl +
	appendDataID +
	appendStationIDs +
	appendDataTypeIDs +
	appendStartDate +
	appendEndDate +
	appendUnitType;
console.log(url);
console.log(myInit);
function todaysDateIn2010() {
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() + 1;
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	today = '2010-' + mm + '-' + dd;
	return today;
}
function convertDateTypesToURLs(dataTypeIDs) {
	let str = '';
	for (var key in dataTypeIDs) {
		str = str + `&datatypeid=${dataTypeIDs[key]}`;
	}
	return str;
}
function convertStationIDsToURLs(stationIDs) {
	let str = '';
	for (var key in stationIDs) {
		str = str + `&stationid=GHCND:${stationIDs[key]}`;
	}
	return str;
}
function buildApiResults(results) {
	myObj = {};
	results.forEach(el => {
		let city = findCityByStation(el.station);
		let datatype = findDataTypeByID(el.datatype);
		let dateVal = el.date.substring(0, 10);
		let value = el.value;
		if (!myObj[city]) myObj[city] = {};
		myObj[city]['date'] = dateVal;
		myObj[city][datatype] = value;
	});
	for (var city in myObj) {
		if (myObj[city].month_to_date_avg_precip) {
			let dayOfMonth = parseInt(myObj[city].date.substring(8, 10));
			myObj[city]['daily_avg_precip'] =
				myObj[city].month_to_date_avg_precip / dayOfMonth;
			delete myObj[city].month_to_date_avg_precip;
		}
	}
	console.log(myObj)
	return myObj;
}
function findCityByStation(stationID) {
	for (var key in stationIDs) {
		if (`GHCND:${stationIDs[key]}` === stationID) {
			return key;
		}
	}
}
function findDataTypeByID(dataTypeID) {
	for (var key in dataTypeIDs) {
		if (dataTypeIDs[key] === dataTypeID.toLowerCase()) {
			return key;
		}
	}
}
