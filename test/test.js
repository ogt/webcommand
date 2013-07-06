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
    t.deepEqual(commandList, ['sort', 'awk', 'sed', 'grep', 'uniq', 'head', 'tail', 'cut', 'fmt', 'wc'], "default command list is used ");
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
    var err=false;
    oStream.on('error', function(){
        err=true;
    });
    oStream.on('end', function(){
        t.equal(err,true, "error was emited");
        t.end();
    });
    commandServer.webCommand('tail',[],iStream, oStream);
    
    iStream.emit('close');
});
