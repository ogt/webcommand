var test = require("tap").test;
var stream = require('event-stream');

test("make sure the createCommandServer returns an object with the proper methodes", function (t) {
    var commandServer= require('../')();
    t.type(commandServer, "object", "type of commandServer is object");
    t.type(commandServer.webCommand, "function", "type of commandServer.webCommand is function");
    t.type(commandServer.getCommandList, "function", "type of commandServer.getCommandList is function");
    t.end();
});

test("make sure the createCommandServer has a default list of commands", function (t) {
    var commandServer= require('../')();
    var commandList=commandServer.getCommandList();
    t.ok(commandList.indexOf('sort')!== -1);
    t.end();
});

test("make sure the createCommandServer has uses the suplied command list", function (t) {
    var customCommandList=['sort', 'wc'];
    var commandServer= require('../')(customCommandList);
    var commandList=commandServer.getCommandList();
    t.deepEqual(commandList, customCommandList, "uses the suplied command list");
    t.end();
});

test("make sure the createCommandServer doesn't allow unlisted commands", function (t) {
    var customCommandList=['sort', 'wc'];
    var commandServer= require('../')(customCommandList);
    var iStream= stream.through();
    var oStream= stream.through();
    var cStream= stream.through();
    var err=false;
    cStream.on('error', function(){
        err=true;
    });
    cStream.on('end', function(){
        t.equal(err,true, "error was emited");
        t.end();
    });
    commandServer.webCommand('tail',[],iStream, oStream, cStream);
    
    iStream.emit('close');
});

var commandServer=require('../')();

test("make sure oStream can be used to detect end for normal operation", function (t) {
    var iStream= stream.through();
    var oStream= stream.through();
    var cStream= stream.through();
    var err=false;
    cStream.on('error', function(){
        err=true;
    });
// note that here we use oStream instead of cStream to detect end
    oStream.on('end', function(){
        t.equal(err,false, "no error was emited");
        t.end();
    });
    commandServer.webCommand('awk',['-F:', '{ print $1 }'  ],iStream, oStream, cStream);
    //commandServer.webCommand('awk',['-F:', '{ print $1 }'  ],iStream, oStream);
    iStream.write('boo,*,23\nfoo,*,32\npoo,*,3\ndoo,*,2');
    iStream.emit('close');
});
