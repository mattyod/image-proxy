var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    log = require('col');

var files,
    length,
    directory = path.join(__dirname, '/images'),
    types = ['jpg', 'jpeg', 'png', 'gif'];

function isImage(url) {
  return (types.indexOf(url.split('.').pop()) >= 0);
}

function randomFile() {
  return files[Math.round(Math.random(10) * (length - 1))];
}

function server(req, res) {
  if (isImage(req.url)) {
    fs.readFile(path.join(directory, randomFile()), function (err, file) {
      if (err) {
        log.error(err);
        res.end();
      }

      res.writeHead(200, {
        'Content-Type' : req.headers['Content-Type']
      });

      res.end(file);
    });
  }
}

fs.readdir(directory, function (err, dir) {
  if (err) {
    log.error(err);
  }

  files = dir;
  length = files.length;

  http
    .createServer(server)
    .listen(80);

  log.success('Proxying', length, 'files on port 80.');
});
