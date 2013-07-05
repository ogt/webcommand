var test = require("tap").test;
var commandServer= require('../index');
var stream = require('event-stream');

test("make sure sort works", function (t) {
	var commandServer=createCommandServer();
	var iStream= stream.through();
	var oStream= stream.through();
	var err=false;
	var cStream=commandServer.webCommand('sort',['-t', ',', '-k', '3', '-n', '-r'  ],iStream, oStream);
	cStream.on('error', function(error){
		err=true;
	});
	cStream.on('end', function(){
	    t.equal(err,false, "no error was emited");
	    t.end();
	});
	
	iStream.write('boo,*,23\nfoo,*,32\npoo,*,3\ndoo,*,2');
	iStream.write(null);
});

test("make sure sort doesn't work with the wrong parameters", function (t) {
	var commandServer=createCommandServer();
	var iStream= stream.through();
	var oStream= stream.through();
	var err=false;
	var cStream=commandServer.webCommand('sort',['-t', ',', '-klalala', '3', '-n', '-r'  ],iStream, oStream);
	cStream.on('error', function(error){
		err=true;
	});
	cStream.on('end', function(){
	    t.equal(err,true, "no error was emited");
	    t.end();
	});
	
	iStream.write('boo,*,23\nfoo,*,32\npoo,*,3\ndoo,*,2');
	iStream.write(null);
});