api = new API();

window.addEventListener('onload', api.getCities());

function complexAlgorithm(historic, current) {
	let complaintArr = [];
	for (var key in current) current = current[key];
	let avgHigh = historic.valueOf().daily_avg_high;
	if (current.precipitation > 0) {
		complaintArr.push("It's raining!");
	}
	if (current.high - historic.daily_avg_high >= 10) {
		complaintArr.push("It's unseasonably hot!");
	}
	if (current.low - historic.daily_avg_low <= -10) {
		complaintArr.push("It's going to be so cold tonight");
	}
	if (current.high - historic.daily_avg_high <= 10) {
		complaintArr.push("It's going to be unseasonably cold today");
	}
	if (
		current.high - historic.daily_avg_high >= 10 &&
		current.precipitation > 0
	) {
		complaintArr.push("It's so muggy and gross!");
	}
	renderComplaints(complaintArr);
}

function renderComplaints(complaintArr) {
	const complaintList = document.getElementById('complaint-list');
	complaintList.innerHTML = '';
	complaintArr.forEach(complaint => {
		let li = document.createElement('li');
		li.innerText = complaint;
		complaintList.appendChild(li);
	});
}
