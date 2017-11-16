const express = require('express');
const SSE = require('sse-node');
const https = require('https');
const fs = require('fs');
const app = express();
global.clients = {};
global.nextID = 0;
global.currentClients = 0;

global.voteTitle = 'Tabs or spaces?';
global.voteData = [{name:'tabs', votes:0},{name:'spaces', votes:0}];
global.totalVotes = 0;



app.use(express.static(__dirname+'/frontend/'));
app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/frontend/index.html');
});
app.get('/updates', (req,res)=>{
	let client = SSE(req, res);
	global.clients[nextID] = client;
	((nextID)=>{
		client.onClose(()=>{
			delete global.clients[nextID];
			global.currentClients--;
			sendDataToAllClients(global.currentClients.toString(), 'connectedClients');
			// console.log(global.currentClients + ' client(s) connected');
		})
	})(global.nextID++);
	client.send(stringifyVoteData(),'init');
	global.currentClients++;
	sendDataToAllClients(global.currentClients.toString(), 'connectedClients');
	//console.log(global.currentClients + ' client(s) connected');

});

app.get('/vote', (req,res)=>{
	for (let option of global.voteData){
		if (option.name === req.query.option){
			option.votes++;
			global.totalVotes++;
		}
	}
	sendDataToAllClients(stringifyVoteData(),'update');
	res.sendStatus(200);
});
app.get('/updateChart', (req,res)=>{
	global.voteTitle = req.query.voteTitle;
	global.voteData = req.query.voteData;
	global.totalVotes = 0;
	sendDataToAllClients(stringifyVoteData(),'init');
	res.sendStatus(200);
});
app.get('/reset', (req,res)=>{
	for (let option of global.voteData){
		option.votes = 0;
	}
	global.totalVotes = 0;
	sendDataToAllClients(stringifyVoteData(),'update');
	res.sendStatus(200);
});

function stringifyVoteData () {
	return JSON.stringify({title:global.voteTitle, voteData: global.voteData, totalVotes: global.totalVotes});
}
function sendDataToAllClients(value, event){
	for (clientID in global.clients){
		global.clients[clientID].send(value, event);
	}
}
const options = {
	cert: fs.readFileSync('./server.crt'),
	key: fs.readFileSync('./server.key')
};
https.createServer(options, app).listen(443);