var test = require("tap").test;
var commandServer= require('../')();
var stream = require('event-stream');

test("make sure tail works", function (t) {
    var iStream= stream.through();
    var oStream= stream.through();
    var eStream= stream.through();
    var cStream= stream.through();
    var err=false;
    
    cStream.on('error', function(){
        err=true;
    });
    cStream.on('end', function(){
        t.equal(err,false, "no error was emited");
        t.end();
    });
    commandServer.webCommand('tail',['-n', '1' ],iStream, oStream, eStream, cStream);
    iStream.write('boo,*,23\nfoo,*,32\npoo,*,3\ndoo,*,2');
    iStream.write(null);
});

test("make sure tail doesn't work with the wrong parameters", function (t) {
    var iStream= stream.through();
    var oStream= stream.through();
    var eStream= stream.through();
    var cStream= stream.through();
    var err=false;
    cStream.on('error', function(){
        err=true;
    });
    cStream.on('end', function(){
        t.equal(err,true, "error was emited");
        t.end();
    });
    commandServer.webCommand('tail',['-t', ',', '-klalala', '3', '-n', '-r'  ],iStream, oStream, eStream, cStream);
    iStream.write('boo,*,23\nfoo,*,32\npoo,*,3\ndoo,*,2');
    iStream.write(null);
});
