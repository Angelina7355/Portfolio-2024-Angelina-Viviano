// Require the functionality we need to use:
var http = require('http'),
	url = require('url'),
	mime = require('mime'),
	path = require('path'),
	fs = require('fs');

// Make a simple fileserver for all of our static content.
// Everything underneath <STATIC DIRECTORY NAME> will be served.
var app = http.createServer(function(req, resp){	// http.createServer function takes a callback function with request and response parameters
													// essentially a miniature static file server that only serves files in our folder called "static"
	var filename = path.join(__dirname, "static", url.parse(req.url).pathname);	// constructs the full filepath of the requested file and puts it in filename variable
	(fs.exists || path.exists)(filename, function(exists){
		
		if (exists) {
			fs.readFile(filename, function(err, data){
				if (err) {
					// File exists but is not readable (permissions issue?)
					resp.writeHead(500, {
						"Content-Type": "text/plain"
					});
					resp.write("Internal server error: could not read file");
					resp.end();
					return;
				}
				
				// File exists and is readable
				var mimetype = mime.getType(filename);
				resp.writeHead(200, {
					"Content-Type": mimetype
				});
				resp.write(data);
				resp.end();
				return;
			});
		}else{
			// File does not exist
			resp.writeHead(404, {
				"Content-Type": "text/plain"
			});
			resp.write("Requested file not found: "+filename);
			resp.end();
			return;
		}
	});
});
app.listen(3456);