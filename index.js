_ = (function () {
var _ = {}

_.webCommand = function(cmd, req, res) {
  var parse = require('url').parse,
      spawn = require('child_process').spawn,
      child = require('event-stream').child;
  var args = parse(req.url,true, true).query.args,
      proc = child(spawn(cmd, args));
  req.pipe(proc)
     .pipe(res);
}

_.createCommandServer = function(cmd, htmlfile) {
  var parse = require('url').parse;
  return createServer(function(req,res) {
    if (parse(req.url).method == 'POST') {
      webCommand(cmd,req,res);
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
