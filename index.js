module = module.exports = _ = (function () {
var _ = {}

_.webCommand = function(cmd, args, ins, outs) {
  var spawn = require('child_process').spawn,
      child = require('event-stream').child,
      proc = child(spawn(cmd, args));
  ins.pipe(proc)
     .pipe(outs);
}


_.createCommandServer = function(cmd, htmlfile) {
  var parse = require('url').parse,
      createServer = require('http').createServer,
      createReadStream = require('fs').createReadStream;
  return createServer(function (req, res) {
    if (req.method == 'POST') {
      var parsedUrl = parse(req.url,true, true);
      if (!cmd)  cmd = parsedUrl.pathname.replace('/','');
      if (parsedUrl.query.args == '') args = null
      else args = [].concat(parsedUrl.query.args);
      if (args) console.log('Executing',cmd,' with args ', args);
      else console.log('Executing '+cmd);
      _.webCommand(cmd,args,req,res);
    }
    else // GET
      if (!htmlfile)  htmlfile = './index.html';
      createReadStream(htmlfile).pipe(res);
  });
}

return _;
})();
