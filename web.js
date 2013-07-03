var express = require('express');
var app = express();
var webcommand=require('./lib/index.js');

var port = process.env.PORT || 8000;

var commandServer=webcommand.createCommandServer();

app.get('/getCommands', function(req,res) {
	  res.send(JSON.stringify(commandServer.getCommandList()));
	});

app.get('/', function(req,res) {
	  res.sendfile('index.html');
	});

app.post('/index.html', function(req,res){
	res.on('error', function(error){
		    console.log(error);
		});
	commandServer.webCommand('sort',req.query.args.split(' '), req, res);
});

app.listen(port);
console.log('Listening on port: '+port);
