$(document).ready(() => {
	let totalVotes = $('#total');
	let reset = $('#reset');
	let chartForm = $('#chartForm');
	let chartFormTable = chartForm.find('table')
	let numClients = $('#numClients');
	let currentTitle = $('#currentTitle');
	let chartTitle = $('#title');
	let addNewOption = $('#addNewOption');
	let source = new EventSource('/updates');
	let currentLabels = [];
	let currentData = [];
	let currentChart = $('#currentChart');
	let updateChartInfo = (chartData) =>{
		currentLabels = [];
		currentData = [];
		for (let option of chartData.voteData) {
			currentLabels.push(option.name);
			currentData.push(option.votes);
		}
		currentTitle.html(chartData.title);
		totalVotes.html(chartData.totalVotes);
	};

	reset.click(()=>{
		$.get('/reset')
	});
	addNewOption.click(()=>{
		chartFormTable.append($('<tr><td><input type="text" name="option' + (currentData.length-1) + '" class="option"></td>'));
	});
	chartForm.submit(function() {
		let newOptions = [];
		chartFormTable.find('input').each(function (){
			newOptions.push({name:$(this).val(), votes:0});
		});
		$.ajax({
			url: '/updateChart',
			data: {voteTitle:chartTitle.val(), voteData:newOptions},
			success: ()=>{}
		});
		return false;
	});

	source.addEventListener('init', (e)=> {
		let chartData = JSON.parse(e.data);
		updateChartInfo(chartData);
		currentChart.html('');
		chartFormTable.html('');
		currentChart.append($(`<tr>
			<th>Value</th>
			<th># of votes</th>
		</tr>`));
		chartFormTable.append($(`<tr>
				<th>Value</th>
			</tr>`));
		for (let i=0; i < currentData.length; i++) {
			currentChart.append($('<tr><td class="name' + i + '">' + currentLabels[i] + '</td><td class="votes_' + i + '">' + currentData[i] + '</td></tr>'));
			chartFormTable.append($('<tr><td><input type="text" name="option' + i + '" class="option" value="'+currentLabels[i]+'"></td>'));
		}
		chartTitle.val(chartData.title);
	});

	source.addEventListener('update', (e)=> {
		let chartData = JSON.parse(e.data);
		updateChartInfo(chartData);
		for (let i=0; i < currentData.length; i++) {
			$('.votes_'+i).html(currentData[i]);
		}
	});

	source.addEventListener('connectedClients', (e)=> {
		let data = JSON.parse(e.data);
		numClients.html(data);
	})
});