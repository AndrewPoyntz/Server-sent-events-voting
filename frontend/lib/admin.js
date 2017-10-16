$(document).ready(() => {
	let totalVotes = $('#total');
	let reset = $('#reset');
	let numClients = $('#numClients');
	let chartTitle = $('#title');
	let option1 = $('#option1');
	let option1Votes = $('#option1Votes');
	let option2 = $('#option2');
	let option2Votes = $('#option2Votes');
	let source = new EventSource('/updates');

	reset.click(()=>{

	});

	source.addEventListener('init', (e)=> {
		let chartData = JSON.parse(e.data);
		let labels = [];
		let data = [];
		for (let option of chartData.voteData) {
			labels.push(option.name);
			data.push(option.votes);
		}
		totalVotes.html(chartData.totalVotes);
		chartTitle.val(chartData.title);
		option1.val(labels[0]);
		option1Votes.val(data[0]);
		option2.val(labels[1]);
		option2Votes.val(data[1]);
	});

	source.addEventListener('update', (e)=> {
		let chartData = JSON.parse(e.data);
		let labels = [];
		let data = [];
		for (let option of chartData.voteData) {
			labels.push(option.name);
			data.push(option.votes);
		}
		totalVotes.html(chartData.totalVotes);
		option1.val(labels[0]);
		option1Votes.val(data[0]);
		option2.val(labels[1]);
		option2Votes.val(data[1]);
	});

	source.addEventListener('connectedClients', (e)=> {
		let data = JSON.parse(e.data);
		numClients.html(data);
	})
});