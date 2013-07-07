var spawn = require('child_process').spawn;
var child = require('event-stream').child;

module.exports = function(cmdList) {
    cmdList = cmdList || ['sort', 'awk', 'sed', 'grep', 'uniq', 'head', 'tail', 'cut', 'fmt', 'wc'];
    function webCommand (cmd, args, ins, outs) {
        var proc, procStream;
        if(cmdList.indexOf(cmd)===-1){
            outs.emit('error', new Error('Illegal command'));
            outs.end();
        }else{
            try{            
                proc=spawn(cmd, args);
                procStream = child(proc);
            }catch(e){
                outs.emit('error', new Error('Error spawning command: '+cmd));
                outs.end();
            }
            proc.stderr.on('data', function () {
            });
            proc.on('exit', function(msg){
                console.log('exiting now!');
                console.log(msg);
                if(msg!==0){
                    outs.emit('error', new Error('Spawn error'));
                }
                outs.end();
            });
            process.on('uncaughtException', function(error) {
                outs.emit('error', error);
                outs.end();
            });
            ins.pipe(procStream )
               .pipe(outs);
        }
    }

    function getCommandList(){
        return cmdList;
    }

    return {webCommand :webCommand,
        getCommandList:getCommandList
    };
};

