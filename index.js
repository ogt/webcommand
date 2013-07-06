var spawn = require('child_process').spawn;
var child = require('event-stream').child;

module.exports = function(cmdList) {
    if(!cmdList){
        cmdList=['sort', 'awk', 'sed', 'grep', 'uniq', 'head', 'tail', 'cut', 'fmt', 'wc'];
    }
    function webCommand (cmd, args, ins, outs) {
        var result= require('event-stream').through();
        var proc, procStream;
        if(cmdList.indexOf(cmd)===-1){
            setTimeout(function(){
                result.emit('error', new Error('Illegal command'));
                result.end();
            },10);
        }else{
            try{            
                proc=spawn(cmd, args);
                procStream = child(proc);
            }catch(e){
                setTimeout(function(){
                    result.emit('error', new Error('error spawning command'));
                    result.end();
                },10);
                return result;
            }
            proc.stderr.on('data', function () {
            });
            proc.on('exit', function(msg){
                console.log('exiting now!');
                console.log(msg);
                if(msg!==0){
                    result.emit('error', new Error('Spawn error'));
                }
                result.end();
            });
            proc.on('uncaughtException', function () {
            });
            procStream.on('uncaughtException', function () {
            });
            outs.on('uncaughtException', function () {
            });
            ins.on('uncaughtException', function () {
            });
            proc.on('error', function () {
            });
            procStream.on('error', function () {
            });
            ins.pipe(procStream )
            .pipe(outs);
        }
        return result;
    }

    function getCommandList(){
        return cmdList;
    }

    return {webCommand :webCommand,
        getCommandList:getCommandList
    };
};

