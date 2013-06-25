_ = (function () {
var _ = {}

_.webCommand = function(cmd, args, ins, outs) {
  var spawn = require('child_process').spawn,
      child = require('event-stream').child,
      proc = child(spawn(cmd, args));
  ins.pipe(proc)
     .pipe(outs);
}

_.createCommandServer = function(cmd, htmlfile) {
  var parse = require('url').parse;
  return createServer(function(req,res) {
    var parsedUrl = parse(req.url,true, true);
    if (parsedUrl.method == 'POST') {
      var args = parsedUrl.query.args,
      webCommand(cmd,args,req,res);
      console.log('Executing',cmd,args);
    }
    else if (htmlfile)// GET
      createReadStream(htmlfile).pipe(res);
  });
}

_.createCommandClient = function(options, args, cb)
  var request = require('http').request;
  options.method = 'POST';
  options.path = '/?'+args.map(function(a) { return 'args='+a;}).join('&');
  return req = request(options, cb)
});


return _;
})();
