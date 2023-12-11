var http = require('http');

http.createServer(function (req, res) {
	var rest={};
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(`{
	"method" : "${req.method}",
	"url": "${req.url}"
}`);

}).listen(3000);
