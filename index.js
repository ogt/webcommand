var spawn = require('child_process').spawn;
var child = require('event-stream').child;

createCommandServer = function(cmdList) {
	if(!cmdList){
		cmdList=['sort', 'awk', 'sed', 'grep', 'uniq', 'head', 'tail', 'cut', 'fmt', 'wc'];
	}

	function webCommand (cmd, args, ins, outs) {
		var result= require('event-stream').through();
		if(cmdList.indexOf(cmd)===-1){
			setTimeout(function(){
				result.emit('error', new Error('Illegal command'));
				result.end();
		},10);
		}else{
//<<<<<<< HEAD
//	    var proc=spawn(cmd, args);
//			var procStream = child(proc);
/*		    }catch(e){
                        outs.emit('error', new Error('Execution error'));
                        outs.end();
   
}
			proc.stderr.on('data', function (data) {
				outs.emit('error', new Error('Execution error'));
				outs.end();
			});
		    proc.on('exit', function(msg){
			if(msg!==0){
			    outs.emit('error', new Error('lala'));
			    outs.end();
			}
})*/

//			proc.on('uncaughtException', function (data) {
//				outs.emit('error', new Error('Spawn error'));
//				outs.end();
//=======
			
		    try{			
var proc=spawn(cmd, args);
			var procStream = child(proc);
		    }catch(e){
                        setTimeout(function(){
                            result.emit('error', new Error('error spawning command'));
                            result.end();
			},10);
			return result;

		    }
			proc.stderr.on('data', function (data) {
				//outs.emit('error', new Error('Execution error'));
				//outs.end();
			});
			proc.on('exit', function(msg){
				console.log('exiting now!');
				console.log(msg);
				if(msg!==0){
					result.emit('error', new Error('Spawn error'));
				}
				result.end();
//>>>>>>> c5fb5c2da8241a4a2d3874518bbb08680b9ccbd9
			});
		    /*all.on('error', function(){

                        outs.emit('error', new Error('Spawn error'));
                        outs.end();
  
})*/

			proc.on('uncaughtException', function (data) {
			});
			procStream.on('uncaughtException', function (data) {
			});
			outs.on('uncaughtException', function (data) {
			});
			ins.on('uncaughtException', function (data) {
			});
			proc.on('error', function (data) {
			});
			procStream.on('error', function (data) {
			});
			/*outs.on('error', function (data) {
			});
			ins.on('error', function (data) {
			});*/
			ins.pipe(procStream )
			.pipe(outs);
		}
		return result;
	};

	function getCommandList(){
		return cmdList;
	}

	return {webCommand :webCommand,
		getCommandList:getCommandList
	};

};

exports.createCommandServer=createCommandServer; 
