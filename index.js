var spawn = require('child_process').spawn;
var child = require('event-stream').child;

module.exports = function(cmdList) {
    cmdList = cmdList || ['sort', 'awk', 'sed', 'grep', 'uniq', 'head', 'tail', 'cut', 'fmt', 'wc'];
    function webCommand (cmd, args, ins, outs, ctrls) {
        var proc, procStream;
        if(cmdList.indexOf(cmd)===-1){
            ctrls.emit('error', new Error('Illegal command'));
            ctrls.end();
        }else{
            if (args) console.log('Executing',cmd,' with args ', args);
            else console.log('Executing '+cmd);
            try{            
                proc=spawn(cmd, args);
                procStream = child(proc);
            }catch(e){
                ctrls.emit('error', new Error('Error spawning command: '+cmd));
                ctrls.end();
            }
            proc.on('exit', function(msg){
                if(msg!==0) {
                    ctrls.emit('error', new Error('Command '+cmd+' exiting with code '+msg));
                }
                ctrls.end();
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

