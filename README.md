Unix command line utilities as web services
==

## Synopsis

This module provides functions that allow the exposure of any unix command utility as an HTTP server mapping the commands stdin and stdout to the webserver in out and the url's path to the uitilities arguments.
There are three functions `createCommandServer`, `webCommand` and `createCommandClient`.

#Description
Here is a silly example to sort /etc/passwd by the user number (3rd column) by 

```
> cat index.js
var createCommandServer = require('webcommand').createCommandServer;
createCmdServer('sort').listen(8000);
console.log('Sorting Server running at http://localhost:'+port+'/');
> node index.js &
Sorting Server running at http://localhost:8000/

> cat client.js
var createCommandClient = require('webcommand').createCommandClient;
var options = {
  hostname : 'localhost',
  port : 8000
};
req  = createCommandClient(options, ['-n', '-r', '-k', 3, '-t', ':'], function(res) {
  res.pipe(process.stdout);
});
process.stdin.pipe(req);
> node client.js < /etc/passwd
....

```
The more normal use cases for this library is to expose the power of the unix command utilities within a more restricted enviorment, for example the browser. For example you can easily create an awk javascript function (replace sort above with awk..). Note that while these unix facilities are obtaining significant user access (even readonly) to the server, the server would probably be a rooted slug - e.g. a heroku app - whose disk is containing no user information besides the code it serves.

The logic is very simple : the function creates a web server which for every requests spawns a process that executes the unix command feeding the request's POST input stream to the standard input of that process and taking the standard output of the process and making it the POST request's result stream.
The request's path is used to extract an "args" parameter which is assumed to be a multi-value parameter, so we map its values into the sort program's argument list.

The code of the inner command (webCommand) is very simple just 5 lines are enough to do all that - given existing stream functionality:
```
_.webCommand = function(cmd, args, ins, outs) {
  var spawn = require('child_process').spawn,
      child = require('event-stream').child,
      proc = child(spawn(cmd, args));
  ins.pipe(proc)
     .pipe(outs);
}
```

## Installation 

To run locally:

    > hub clone ogt/webcommand && cd webcommand
    > npm install
    > node test.js&
    > open localhost:8000

You can test the default command (sort) or replace any command that is in your path. Remember that if if you are to use a command that doesn't need stdin you will need to clear the input textarea - otherwise you will get a pipe error.


