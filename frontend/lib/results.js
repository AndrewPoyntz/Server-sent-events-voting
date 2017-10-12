$(document).ready(() => {
	let myChart;
	let ctx = $('#results')[0].getContext('2d');
	let totalVotes = $('#total');
	let source = new EventSource('/updates');

	let tabsButton = $('#tabs');
	let spacesButton = $('#spaces');


	tabsButton.click(()=>{
		$.ajax({
			url: '/vote',
			data: {option:'tabs'},
			success: ()=>{}
		});
	});

	spacesButton.click(()=>{
		$.ajax({
			url: '/vote',
			data: {option:'spaces'},
			success: ()=>{}
		});
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
	})
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
