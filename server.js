const express = require('express');
const SSE = require('sse-node');
const https = require('https');
const fs = require('fs');
const app = express();

/// # ---------- voting ----------------------------
global.voteClients = {};
global.voteNextID = 0;
global.voteCurrentClients = 0;
global.voteTitle = 'Tabs or spaces?';
global.voteData = [{name:'tabs', votes:0},{name:'spaces', votes:0}];
global.totalVotes = 0;

app.get('/updates', (req,res)=>{
	let client = SSE(req, res, {ping:45000});
	global.voteClients[voteNextID] = client;
	((nextID)=>{
		client.onClose(()=>{
			delete global.voteClients[voteNextID];
			global.voteCurrentClients--;
			sendDataToAllVoteClients(global.voteCurrentClients.toString(), 'connectedClients');
			// console.log(global.voteCurrentClients + ' client(s) connected');
		})
	})(global.voteNextID++);
	client.send(stringifyVoteData(),'init');
	global.voteCurrentClients++;
	sendDataToAllVoteClients(global.voteCurrentClients.toString(), 'connectedClients');
	//console.log(global.voteCurrentClients + ' client(s) connected');
});

app.get('/vote', (req,res)=>{
	for (let option of global.voteData){
		if (option.name === req.query.option){
			option.votes++;
			global.totalVotes++;
		}
	}
	sendDataToAllVoteClients(stringifyVoteData(),'update');
	res.sendStatus(200);
});
app.get('/updateChart', (req,res)=>{
	global.voteTitle = req.query.voteTitle;
	global.voteData = req.query.voteData;
	global.totalVotes = 0;
	sendDataToAllVoteClients(stringifyVoteData(),'init');
	res.sendStatus(200);
});
app.get('/reset', (req,res)=>{
	for (let option of global.voteData){
		option.votes = 0;
	}
	global.totalVotes = 0;
	sendDataToAllVoteClients(stringifyVoteData(),'update');
	res.sendStatus(200);
});

function stringifyVoteData () {
	return JSON.stringify({title:global.voteTitle, voteData: global.voteData, totalVotes: global.totalVotes});
}
function sendDataToAllVoteClients(value, event){
	for (let clientID in global.voteClients){
		global.voteClients[clientID].send(value, event);
	}
}
/// # ---------- voting ----------------------------


/// # ---------- game -------------------------------
global.gameClients = {};
global.gameNextID = 0;
global.xTaken = false;
global.oTaken = false;
global.squares = {'1':false,'2':false,'3':false,'4':false,'5':false,'6':false,'7':false,'8':false,'9':false};
app.get('/gameUpdates', (req,res)=> {
	let client = SSE(req, res, {ping: 45000});
	global.gameClients[gameNextID] = client;
	((nextID) => {
		client.onClose(() => {
			delete global.gameClients[gameNextID];
		})
	})(global.gameNextID++);
	client.send(stringifyGameData(), 'gameState');
});
app.get('/resetGame', (req,res)=>{
	global.xTaken = false;
	global.oTaken = false;
	global.squares = {'1':false,'2':false,'3':false,'4':false,'5':false,'6':false,'7':false,'8':false,'9':false};
	sendDataToAllGameClients({}, 'resetGame');
	sendDataToAllGameClients(stringifyGameData(), 'gameState');
});
app.get('/claim', (req,res)=>{
	let err = false;
	if (req.query.choice === 'x'){
		global.xTaken = true;
	} else if (req.query.choice === 'o'){
		global.oTaken = true;
	} else {
		err= true;
	}
	sendDataToAllGameClients(stringifyGameData(), 'gameState');
	res.sendStatus((!err)?200:410);
});
app.get('/updateGameState', (req,res)=>{
	let err = false;
	if (!global.squares[req.query.square]) {
		global.squares[req.query.square] = req.query.val;
	} else {
		err = true;
	}
	sendDataToAllGameClients(stringifyGameData(), 'gameState');
	res.sendStatus((!err)?200:423);
});
function stringifyGameData () {
	return JSON.stringify({xTaken:global.xTaken, oTaken: global.oTaken, squares: global.squares});
}
function sendDataToAllGameClients(value, event){
	for (let clientID in global.gameClients){
		global.gameClients[clientID].send(value, event);
	}
}
/// # ---------- game -------------------------------

app.use(express.static(__dirname+'/frontend/'));
app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/frontend/index.html');
});

const options = {
	cert: fs.readFileSync('./server.crt'),
	key: fs.readFileSync('./server.key')
};
https.createServer(options, app).listen(443);