Allows easy exposure of unix command line utilities as web services
==

## Synopsis

This module provides two functions that allow the exposure of any unix command utility as an HTTP server mapping the commands stdin and stdout to the webserver in out and the url's path to the uitilities arguments.

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

The code of the inner command (webCommand) is very simple just 4 lines are enough to do all that - given existing stream functionality:

    var args = parse(req.url,true, true).query.args,
    proc = child(spawn(cmd, args));
    req.pipe(proc)
       .pipe(res);


You can use the service using curl as follows ( assume a sort server):
```
>curl --data-binary @- "http://sorter.herokuapp.com/?args=-t&args=,&args=-k&args=3&args=-n"
boo,*,23
foo,*,32
poo,*,3
doo,*,2
^D
doo,*,2
poo,*,3
boo,*,23
foo,*,32
>
```
This simple facility is run as a free heroku app - this means that occassionally you may hit a 20 seconds delay - if there has been no activity for a while.
This also means that the resources available aren't much - if you run sort with large inputs - you will probably run the server out of memory and you will make the server unavailable for others. So I would appreciate if you make light use only for the service
