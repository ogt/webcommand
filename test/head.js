var test = require("tap").test;
var commandServer= require('../')();
var stream = require('event-stream');

test("make sure head works", function (t) {
    var iStream= stream.through();
    var oStream= stream.through();
    var err=false;
    oStream.on('error', function(){
        err=true;
    });
    oStream.on('end', function(){
        t.equal(err,false, "no error was emited");
        t.end();
    });
    commandServer.webCommand('head',['-n', '1' ],iStream, oStream);
    iStream.write('boo,*,23\nfoo,*,32\npoo,*,3\ndoo,*,2');
    iStream.write(null);
});

test("make sure head doesn't work with the wrong parameters", function (t) {
    var iStream= stream.through();
    var oStream= stream.through();
    var err=false;
    oStream.on('error', function(){
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
