Unix command line utilities as web services
==

## Synopsis

This module provides functions that allow the exposure of any unix command utility to node.js mapping the commands stdin and stdout to the webserver in out and the url's path to the uitilities arguments.
There are three functions `createCommandServer`, `webCommand` and `getCommandList`.

#Description
To create a command server call createCommandServer. You may provide an array with the allowed commands. 
```
createCommandServer([commandList]);
```

To execute commands call the webCommand method of the command server
```
webCommand(command,arguments, inStream, outStream);
```

To get the list of allowed commands for a CommandServer.
```
getCommandList()
```
The 'normal' use case for this library is to expose the power of the unix command utilities within a more restricted enviorment, for example the browser. For example you can easily create an awk javascript function (replace sort above with awk..). Note that while these unix facilities are obtaining significant user access (even readonly) to the server, the server would probably be a rooted slug - e.g. a heroku app - whose disk is containing no user information besides the code it serves.

#Example with express
In this example a post of a form in index.html will call sort and stream the results back to browser.

```
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
```

## Installation 

To run locally:

    > hub clone ogt/webcommand && cd webcommand
    > npm install
    > node test.js&
    > open localhost:8000

You can test the default command (sort) or replace any command that is in your path. Remember that if if you are to use a command that doesn't need stdin you will need to clear the input textarea - otherwise you will get a pipe error.


