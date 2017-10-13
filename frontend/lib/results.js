$(document).ready(() => {
	let myChart;
	let ctx = $('#results')[0].getContext('2d');
	let totalVotes = $('#total');
	let source = new EventSource('/updates');
	let buttonContainer = $('#buttons');
	let tabsButton = $('#tabs');
	let spacesButton = $('#spaces');

	let vote = (value) => {
		$.ajax({
			url: '/vote',
			data: {option:value},
			success: ()=>{}
		});
	};
	tabsButton.click(()=>{
		vote('tabs');
	});

	spacesButton.click(()=>{
		vote('spaces');
	});

	source.addEventListener('init', (e)=>{
		let chartData = JSON.parse(e.data);
		let labels = [];
		let data = [];
		for (let option of chartData.voteData){
			labels.push(option.name);
			data.push(option.votes);
		}
		totalVotes.html(chartData.totalVotes);
		myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					label: chartData.title,
					data: data
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			}
		});
		buttonContainer.html('');
		for (let option of labels){
			let newButton = $('<button>').html(option).click(()=>{vote(option)});
			buttonContainer.append(newButton);
		}
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
		myChart.data.datasets[0].data = data;
		myChart.update();
	});


})
