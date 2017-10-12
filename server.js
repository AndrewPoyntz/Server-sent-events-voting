const express = require('express');
const SSE = require('sse-node');
const app = express();
global.clients = {};
global.nextID = 0;

global.voteTitle = 'Tabs or spaces?';
global.voteData = [{name:'tabs', votes:0},{name:'spaces', votes:0}];
global.totalVotes = 0;



app.use(express.static(__dirname+'/frontend/'));
app.get('/',(req,res)=>{
	res.send('Hello World');
});
app.get('/updates', (req,res)=>{
	let client = SSE(req, res);
	global.clients[nextID] = client;
	((nextID)=>{
		client.onClose(()=>{
			delete global.clients[nextID]
		})
	})(global.nextID++);
	client.send(stringifyVoteData(),'init');

});

app.get('/vote', (req,res)=>{
	for (let option of global.voteData){
		if (option.name === req.query.option){
			option.votes++;
			global.totalVotes++;
		}
	}
	sendDataToClients();
	res.send(200);
});

function stringifyVoteData () {
	return JSON.stringify({title:global.voteTitle, voteData: global.voteData, totalVotes: global.totalVotes});
}
function sendDataToClients(){
	for (clientID in global.clients){
		global.clients[clientID].send(stringifyVoteData(),'update');
	}
}

const server = app.listen(8080, () =>{
	'use strict';
	let port = server.address().port;
	console.log(`server listening at http://localhost:${port}`);
})