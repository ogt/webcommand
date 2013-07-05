var createCommandServer = require('./index.js').createCommandServer,
    port = process.env.PORT || 8000;
createCommandServer(null, './test.html').listen(port);
console.log('Server running at http://localhost:'+port+'/');

