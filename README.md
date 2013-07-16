Unix command line utilities as web services
==
[![Build Status](https://travis-ci.org/ogt/webcommand.png)](https://travis-ci.org/ogt/webcommand)

## Synopsis

This module provides functions that allow the exposure of any unix command utility to node.js mapping the commands stdin and stdout to the webserver in out and the url's path to the uitilities arguments.
There are two functions  `webCommand` and `getCommandList`. 

#Description
To use this module, you need to first
```
var webcommand = require('webcommand')([commandList]);
```

The webcommand creates spawns a separate process, pipe-ing the input and output  streams as needed. It also accepts 
a ctrlStream to emit errors and signal the end of the command.
Command is sth that can be exec-ed so it has to be found in the current process's path
Arguments is the list of arguments that we are passing to the process.
```
webcommand.webCommand(command,arguments, inStream, outStream, ctrlStream);
```

To get the list of allowed commands for a CommandServer.
```
webcommand.getCommandList()
```
The 'normal' use case for this library is to expose the power of the unix command utilities within a more restricted enviorment, for example the browser. For example you can easily create an awk javascript function (replace sort above with awk..). Note that while these unix facilities are obtaining significant user access (even readonly) to the server, the server would probably be a rooted slug - e.g. a heroku app - whose disk is containing no user information besides the code it serves.

#Example with express
In this example a post of a form in index.html will call sort and stream the results back to browser.

```
var express = require('express'),
    webCommand = require('../')(),
    stream = require('event-stream');

var port = process.env.PORT || 8000;
var app = express();

app.get('/getCommands', function(req,res) {
      res.send(JSON.stringify(webCommand.getCommandList()));
    });

app.get('/', function(req,res) {
      res.sendfile('example.html');
    });

app.post('/*', function(req,res){
    var cmd = req.path.replace('/','');
        args = [].concat(req.query.args);
        cStream= stream.through();
    if (req.query.args === '') args = null;

    cStream.on('error', function(err) {
        console.error(err);
    });
    webCommand.webCommand(cmd,args, req, res, cStream);

});
```

## Installation 

To run locally the example:

    > hub clone ogt/webcommand && cd webcommand
    > npm install
    > make test
    > node example/example.js&
    > open localhost:8000/getCommands &
    > open localhost:8000 

You can test the default command (sort) or replace any command that is in your path. Remember that if if you are to use a command that doesn't need stdin you will need to clear the input textarea - otherwise you will get a pipe error.

