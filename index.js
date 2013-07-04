var spawn = require('child_process').spawn;
var child = require('event-stream').child;

createCommandServer = function(cmdList) {
	if(!cmdList){
		cmdList=['sort', 'awk', 'sed', 'grep', 'uniq', 'head', 'tail', 'cut', 'fmt', 'wc'];
	}

	function webCommand (cmd, args, ins, outs) {
		if(cmdList.indexOf(cmd)===-1){
			outs.emit('error', new Error('Illegal command'));
			outs.end();
		}else{

			var proc=spawn(cmd, args);
			var procStream = child(proc);
			proc.stderr.on('data', function (data) {
				outs.emit('error', new Error('Execution error'));
				outs.end();
			});
			/*procStream.on('exit', function(msg){
				console.log('exiting now!');
				console.log(msg);
				if(msg!==0){
					outs.emit('error', new Error('Spawn error'));
					outs.end();
				}
			});*/

			proc.on('uncaughtException', function (data) {
				outs.emit('error', new Error('Spawn error'));
				outs.end();
			});
			ins.pipe(procStream )
			.pipe(outs);

			
		}
	};

	function getCommandList(){
		return cmdList;
	}

	return {webCommand :webCommand,
		getCommandList:getCommandList
	};

};

exports.createCommandServer=createCommandServer; 
