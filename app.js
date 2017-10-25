api = new API();

window.addEventListener('onload', api.getCities());

function complexAlgorithm(historic, current) {
	let complaintArr = [];
	for (var key in current) current = current[key];
	let avgHigh = historic.valueOf().daily_avg_high;
	if (current.precipitation > 0.15) {
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
	if (
		current.high - historic.daily_avg_high >= 10 &&
		current.precipitation > 0.05
	) {
		complaintArr.push("It's so muggy and gross!");
	}
	if (complaintArr.length === 0) {
		complaintArr.push(
			'I have nothing to complain about, but I still feel sad.'
		);
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
