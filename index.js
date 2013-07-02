var spawn = require('child_process').spawn;
var child = require('event-stream').child;


module = module.exports = _ = (function () {
	var _ = {};

	_.webCommand = function(cmd, args, ins, outs) {
		var proc = child(spawn(cmd, args));
		ins.pipe(proc)
		.pipe(outs);
	};

	_.createCommandServer = function(cmd, htmlfile) {
		var parse = require('url').parse,
		createServer = require('http').createServer,
		createReadStream = require('fs').createReadStream;
		return createServer(function (req, res) {
			if (req.method == 'POST') {
				var parsedUrl = parse(req.url,true, true);
				if (!cmd) { 
					cmd = parsedUrl.pathname.replace('/','');
				}
				if (parsedUrl.query.args == '') {
					args = [];
				}else {
					console.log(parsedUrl.query.args);
					//args = [].concat(parsedUrl.query.args);
					args = parsedUrl.query.args.split(' ');
				}
				if (args){ 
					console.log('Executing',cmd,' with args ', args);
				}else {
					console.log('Executing '+cmd);
				}
				_.webCommand(cmd,args,req,res);
			}else{ // GET
				if (!htmlfile){  
					htmlfile = './index.html';
					createReadStream(htmlfile).pipe(res);
				}
			}
		});
	};
	
	_.createCommandClient= function(){};

	return _;
})();