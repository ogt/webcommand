var port = process.env.PORT || 8000;

var webcommand=require('./index.js');

webcommand.createCommandServer('sort').listen(port);
console.log('Server running at http://localhost:'+port+'/');
//sort, awk, sed, grep, uniq, head, tail, cut, fmt, wc