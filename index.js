var spawn = require('child_process').spawn;
var child = require('event-stream').child;

exports = module.exports = function(cmdList) {
    cmdList = cmdList || ['cat', 'sort', 'awk', 'sed', 'grep', 'uniq', 'head', 'tail', 'cut', 'fmt', 'wc'];
    function webCommand (cmd, args, ins, outs, ctrls) {
        var proc, procStream, err;
        if(cmdList.indexOf(cmd)===-1){
            err = new Error('Illegal command');
            err.name = 'COMMAND_NOT_ALLOWED';
            ctrls.emit('error', err);
            ctrls.end();
        }else{
            if (args) console.log('Executing',cmd,' with args ', args);
            else console.log('Executing '+cmd);
            try{            
                proc=spawn(cmd, args);
                procStream = child(proc);
            }catch(e){
                err = new Error('Error spawning command');
                err.name = 'COMMAND_NOT_FOUND';
                ctrls.emit('error', err);
                ctrls.end();
            }
            proc.on('exit', function(msg){
                if(msg!==0) {
                    err = new Error('Command '+cmd+' exiting with code '+msg);
                    err.name = 'COMMAND_EXITED_ABNORMALLY';
                    ctrls.emit('error', err);
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

// the basics of the webcommand protocol (ie how a url in mapped to commands, arguments and pipes) is captured here
// the rest is part of the routing logic captured in the webcommand-express module 
// in summary 
//   the command is the pathname
//   the commands arguments are the values passed of the url parameter 'args' 
//        multiple arguments use multiple args, ie args is a multi-valued url parameter. order of course is important
//   the imput stream is provided as the POSTed data stream against the above URL
//   the output stream is provided as the complete data ouput of the HTTP request (after the successful headers)
//   the error stream for now is ignored
//   if the command exits with <> 0 
//   the above portion of the uri (host, pathname, args parameter) are sufficient to describe any single command running in any server.

var url = require('url');
exports.parseUrl = parseUrl;
exports.generateUrl = generateUrl;

function parseUrlBase(aurl) {
    var parsedUrl = url.parse(aurl,1);
    var obj = {
        base : parsedUrl.href.substr(0,parsedUrl.href.length-parsedUrl.path.length),
        cmd : parsedUrl.pathname.replace('/',''),
        parsedUrl : parsedUrl,
    };
    if (parsedUrl.query.args)   obj.args = [].concat(parsedUrl.query.args) ; 
    return obj;
}

function parseUrl(aurl) {
    var obj = parseUrlBase(aurl); 
    var pipes = obj.parsedUrl.query.pipes ? [].concat(obj.parsedUrl.query.pipes) : null;
    obj.pipes = pipes ? pipes.map(function(pipe) { return parseUrlBase(pipe); }) : null;
    if (!obj.pipes) delete obj.pipes;
    if (!obj.args) delete obj.args;
    return obj;
}

function generateUrl(obj) {
    function encodeParam(list,name) { 
        return list.map(function(e) { return name+'='+encodeURIComponent(e);}).join('&') ; 
    }
    var url =  obj.base + '/' + obj.cmd ;
    var args = obj.args ? encodeParam(obj.args,'args') : null,
        pipes = obj.pipes ? encodeParam(obj.pipes.map(function(e) { return generateUrl(e);}),'pipes') : null,
        params = [];
    if (args) params = params.concat(args);
    if (pipes) params = params.concat(pipes);
    url += params.length ? '?' + params.join('&') : '';
    return url;
}

