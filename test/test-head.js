var test = require("tap").test;
var commandServer= require('../index');
var stream = require('event-stream');

test("make sure head works", function (t) {
	var commandServer=createCommandServer();
	var iStream= stream.through();
	var oStream= stream.through();
	var err=false;
	oStream.on('error', function(error){
		err=true;
	});
	oStream.on('end', function(){
	    t.equal(err,false, "no error was emited");
	    t.end();
	});
	commandServer.webCommand('head',['-n', '5' ],iStream, oStream);
	iStream.write('boo,*,23\nfoo,*,32\npoo,*,3\ndoo,*,2');
	iStream.write(null);
});

test("make sure head doesn't work with the wrong parameters", function (t) {
	var commandServer=createCommandServer();
	var iStream= stream.through();
	var oStream= stream.through();
	var err=false;
	oStream.on('error', function(error){
		err=true;
	});
	oStream.on('end', function(){
	    t.equal(err,true, "error was emited");
	    t.end();
	});
	commandServer.webCommand('head',['-t', ',', '-klalala', '3', '-n', '-r'  ],iStream, oStream);
	iStream.write('boo,*,23\nfoo,*,32\npoo,*,3\ndoo,*,2');
	iStream.write(null);
});