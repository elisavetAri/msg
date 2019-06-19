const fs = Npm.require('fs');
const path = Npm.require('path');
const URL = Npm.require('url');
const http = Npm.require('http');
const formidable = Npm.require('formidable');

var basePath = path.resolve('.').split('.meteor')[0];
var defaultPath = path.resolve(basePath, '../files');

http.createServer(function (req, res) {
  var url = URL.parse(req.url, true);
  var query = url.query;
  if(url.pathname == "/"){
    var file = Object.keys(query)[0];
    if(file.indexOf('.') > 0){
      // res.writeHead(200,{'content-type':'image/png'});
      res.setHeader('Content-disposition', 'attachment; filename='+file);
      return fs.createReadStream(path.resolve(defaultPath, "img", file)).pipe(res);
    }
  }
  if(url.pathname.indexOf("upload")>-1){
    var form = new formidable.IncomingForm({maxFieldsSize:2042220174, maxFileSize:2042220174});
    form.parse(req, function (err, fields, files) {
      if (!files.file)return res.end(JSON.stringify({status : "err"}));
      var oldpath = files.file.path;
      var newpath = path.resolve(defaultPath, "img", files.file.name);
      fs.rename(oldpath, newpath, function (err) {
        if (err) return res.end(JSON.stringify({status : "err", msg : "Unexpected error"}));
        res.end(JSON.stringify({status : "ok"}));
      });
    });
  }
  // function httpHandler(request, response) {
  //     var uri = url.parse(request.url).pathname,
  //         filename = path.join(process.cwd(), uri);
  //
  //     fs.exists(filename, function(exists) {
  //         if (!exists) {
  //             response.writeHead(404, {
  //                 'Content-Type': 'text/plain'
  //             });
  //             response.write('404 Not Found: ' + filename + '\n');
  //             response.end();
  //             return;
  //         }
  //
  //         if (filename.indexOf('video') !== -1) {
  //           res.setHeader('Content-disposition', 'attachment; filename='+file);
  //           return fs.createReadStream(path.resolve(defaultPath, "mp3", file)).pipe(res);;
  //         }
  //
  //         var isWin = !!process.platform.match(/^win/);
  //
  //         if (fs.statSync(filename).isDirectory() && !isWin) {
  //             filename += '/index.html';
  //         } else if (fs.statSync(filename).isDirectory() && !!isWin) {
  //             filename += '\\index.html';
  //         }
  //
  //         fs.readFile(filename, 'binary', function(err, file) {
  //             if (err) {
  //                 response.writeHead(500, {
  //                     'Content-Type': 'text/plain'
  //                 });
  //                 response.write(err + '\n');
  //                 response.end();
  //                 return;
  //             }
  //
  //             var contentType;
  //
  //             if (filename.indexOf('video') !== -1) {
  //                 contentType = 'text/html';
  //             }
  //
  //             if (filename.indexOf('video') !== -1) {
  //                 contentType = 'application/javascript';
  //             }
  //
  //             if (contentType) {
  //                 response.writeHead(200, {
  //                     'Content-Type': contentType
  //                 });
  //             } else response.writeHead(200);
  //
  //             response.write(file, 'binary');
  //             response.end();
  //         });
  //     });
  // }

  res.writeHead(200,{'content-type':'text/json'});
  res.end(JSON.stringify(url));
}).listen(3333);
console.log("File Server running at http://localhost:3333/");
