var require = meteorInstall({"imports":{"api":{"groupMessenger":{"groupMessage.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// imports/api/groupMessenger/groupMessage.js                                                 //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
module.export({
  GroupMessage: () => GroupMessage
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const GroupMessage = new Mongo.Collection('groupMessage');

if (Meteor.isServer) {
  Meteor.publish('groupMessage', function () {
    return GroupMessage.find();
  });
}

Meteor.methods({
  "groupMessage.insert"(name, users) {
    const uid = GroupMessage.insert({
      name: name,
      users: users,
      options: {},
      created_at: moment().valueOf()
    });
    return uid;
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////

}},"messages":{"messages.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// imports/api/messages/messages.js                                                           //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
module.export({
  Message: () => Message
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const Message = new Mongo.Collection('message');

if (Meteor.isServer) {
  Meteor.publish('messages', function () {
    return Message.find();
  });
}

Meteor.methods({
  "message.insert"(sid, rid, message, type, group) {
    const uid = Message.insert({
      sid: sid,
      rid: rid,
      group: group,
      message: message,
      viewed: false,
      type: type,
      // last_login:moment().valueOf(),
      created_at: moment().valueOf()
    });
    return uid;
  },

  "message.remove"(messageId) {
    return Message.remove(messageId);
  },

  "message.update"(messageId, update) {
    return Message.update(messageId, {
      $set: update
    });
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////

}},"user":{"user.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// imports/api/user/user.js                                                                   //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
module.export({
  User: () => User
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const User = new Mongo.Collection('user');

if (Meteor.isServer) {
  Meteor.publish('users', function () {
    return User.find();
  });
}

Meteor.methods({
  "user.insert"(name, lastName, password, phone, email) {
    const uid = User.insert({
      name: name,
      lastName: lastName,
      password: password,
      phone: phone,
      email: email,
      created_at: moment().valueOf(),
      last_login: moment().valueOf()
    });
    return uid;
  },

  "user.remove"(userId) {
    return User.remove(userId);
  },

  "user.update"(userId, update) {
    return User.update(userId, {
      $set: update
    });
  },

  "user.changePassword"(userId, oldPassword, newPassword) {
    var user = User.findOne({
      _id: userId,
      password: oldPassword
    });

    if (user) {
      return User.update(userId, {
        $set: {
          password: newPassword
        }
      });
    }
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"email":{"index.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// imports/startup/email/index.js                                                             //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
process.env.MAIL_URL = 'smtps://elisavetar638@gmail.com:ELISAVET1311@smtp.gmail.com:465';
Meteor.methods({
  "email.send"(to, subject, text) {
    Email.send({
      from: "from@mailinator.com",
      to: to,
      subject: subject,
      text: text
    });
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////

}},"files":{"index.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// imports/startup/files/index.js                                                             //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
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

  if (url.pathname == "/") {
    var file = Object.keys(query)[0];

    if (file.indexOf('.') > 0) {
      // res.writeHead(200,{'content-type':'image/png'});
      res.setHeader('Content-disposition', 'attachment; filename=' + file);
      return fs.createReadStream(path.resolve(defaultPath, "img", file)).pipe(res);
    }
  }

  if (url.pathname.indexOf("upload") > -1) {
    var form = new formidable.IncomingForm({
      maxFieldsSize: 2042220174,
      maxFileSize: 2042220174
    });
    form.parse(req, function (err, fields, files) {
      if (!files.file) return res.end(JSON.stringify({
        status: "err"
      }));
      var oldpath = files.file.path;
      var newpath = path.resolve(defaultPath, "img", files.file.name);
      fs.rename(oldpath, newpath, function (err) {
        if (err) return res.end(JSON.stringify({
          status: "err",
          msg: "Unexpected error"
        }));
        res.end(JSON.stringify({
          status: "ok"
        }));
      });
    });
  } // function httpHandler(request, response) {
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


  res.writeHead(200, {
    'content-type': 'text/json'
  });
  res.end(JSON.stringify(url));
}).listen(3333);
console.log("File Server running at http://localhost:3333/");
////////////////////////////////////////////////////////////////////////////////////////////////

}},"rest":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// imports/startup/rest/index.js                                                              //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
let User;
module.link("/imports/api/user/user.js", {
  User(v) {
    User = v;
  }

}, 0);
var Api = new Restivus({
  useDefaultAuth: false,
  prettyJson: false,
  enableCors: true
});
Api.addRoute('test', {
  get: function (req, res) {
    var name = this.bodyParams.name;
    var name1 = User.findOne({
      name: name
    });
    var userId = this.queryParams.userId;
    return {
      status: "OK",
      name: this.queryParams.name
    };
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// imports/startup/server/index.js                                                            //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
module.link("/imports/api/user/user.js");
module.link("/imports/api/messages/messages.js");
module.link("/imports/api/groupMessenger/groupMessage.js");
let User;
module.link("/imports/api/user/user.js", {
  User(v) {
    User = v;
  }

}, 0);
let Message;
module.link("/imports/api/messages/messages.js", {
  Message(v) {
    Message = v;
  }

}, 1);
Meteor.methods({
  Login(name, password, country, phone, email) {
    var user = User.findOne({
      name: name,
      password: password,
      phone: phone,
      email: email
    });
    if (user) return user._id;
    return false;
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// server/main.js                                                                             //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
module.link("/imports/startup/server");
module.link("/imports/startup/rest");
module.link("/imports/startup/email");
module.link("/imports/startup/files");
////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvZ3JvdXBNZXNzZW5nZXIvZ3JvdXBNZXNzYWdlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tZXNzYWdlcy9tZXNzYWdlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdXNlci91c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvZW1haWwvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9maWxlcy9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3Jlc3QvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tYWluLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIkdyb3VwTWVzc2FnZSIsIk1ldGVvciIsImxpbmsiLCJ2IiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiaXNTZXJ2ZXIiLCJwdWJsaXNoIiwiZmluZCIsIm1ldGhvZHMiLCJuYW1lIiwidXNlcnMiLCJ1aWQiLCJpbnNlcnQiLCJvcHRpb25zIiwiY3JlYXRlZF9hdCIsIm1vbWVudCIsInZhbHVlT2YiLCJNZXNzYWdlIiwic2lkIiwicmlkIiwibWVzc2FnZSIsInR5cGUiLCJncm91cCIsInZpZXdlZCIsIm1lc3NhZ2VJZCIsInJlbW92ZSIsInVwZGF0ZSIsIiRzZXQiLCJVc2VyIiwibGFzdE5hbWUiLCJwYXNzd29yZCIsInBob25lIiwiZW1haWwiLCJsYXN0X2xvZ2luIiwidXNlcklkIiwib2xkUGFzc3dvcmQiLCJuZXdQYXNzd29yZCIsInVzZXIiLCJmaW5kT25lIiwiX2lkIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwidG8iLCJzdWJqZWN0IiwidGV4dCIsIkVtYWlsIiwic2VuZCIsImZyb20iLCJmcyIsIk5wbSIsInJlcXVpcmUiLCJwYXRoIiwiVVJMIiwiaHR0cCIsImZvcm1pZGFibGUiLCJiYXNlUGF0aCIsInJlc29sdmUiLCJzcGxpdCIsImRlZmF1bHRQYXRoIiwiY3JlYXRlU2VydmVyIiwicmVxIiwicmVzIiwidXJsIiwicGFyc2UiLCJxdWVyeSIsInBhdGhuYW1lIiwiZmlsZSIsIk9iamVjdCIsImtleXMiLCJpbmRleE9mIiwic2V0SGVhZGVyIiwiY3JlYXRlUmVhZFN0cmVhbSIsInBpcGUiLCJmb3JtIiwiSW5jb21pbmdGb3JtIiwibWF4RmllbGRzU2l6ZSIsIm1heEZpbGVTaXplIiwiZXJyIiwiZmllbGRzIiwiZmlsZXMiLCJlbmQiLCJKU09OIiwic3RyaW5naWZ5Iiwic3RhdHVzIiwib2xkcGF0aCIsIm5ld3BhdGgiLCJyZW5hbWUiLCJtc2ciLCJ3cml0ZUhlYWQiLCJsaXN0ZW4iLCJjb25zb2xlIiwibG9nIiwiQXBpIiwiUmVzdGl2dXMiLCJ1c2VEZWZhdWx0QXV0aCIsInByZXR0eUpzb24iLCJlbmFibGVDb3JzIiwiYWRkUm91dGUiLCJnZXQiLCJib2R5UGFyYW1zIiwibmFtZTEiLCJxdWVyeVBhcmFtcyIsIkxvZ2luIiwiY291bnRyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0MsY0FBWSxFQUFDLE1BQUlBO0FBQWxCLENBQWQ7QUFBK0MsSUFBSUMsTUFBSjtBQUFXSCxNQUFNLENBQUNJLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNELFFBQU0sQ0FBQ0UsQ0FBRCxFQUFHO0FBQUNGLFVBQU0sR0FBQ0UsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJQyxLQUFKO0FBQVVOLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsT0FBSyxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsU0FBSyxHQUFDRCxDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DO0FBR2xILE1BQU1ILFlBQVksR0FB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SSxJQUFQLENBQVksNkNBQVo7QUFBMkQsSUFBSTJCLElBQUo7QUFBUy9CLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLDJCQUFaLEVBQXdDO0FBQUMyQixNQUFJLENBQUMxQixDQUFELEVBQUc7QUFBQzBCLFFBQUksR0FBQzFCLENBQUw7QUFBTzs7QUFBaEIsQ0FBeEMsRUFBMEQsQ0FBMUQ7QUFBNkQsSUFBSWUsT0FBSjtBQUFZcEIsTUFBTSxDQUFDSSxJQUFQLENBQVksbUNBQVosRUFBZ0Q7QUFBQ2dCLFNBQU8sQ0FBQ2YsQ0FBRCxFQUFHO0FBQUNlLFdBQU8sR0FBQ2YsQ0FBUjtBQUFVOztBQUF0QixDQUFoRCxFQUF3RSxDQUF4RTtBQU92T0YsTUFBTSxDQUFDUSxPQUFQLENBQWU7QUFDZitGLE9BQUssQ0FBQzlGLElBQUQsRUFBTXFCLFFBQU4sRUFBZTBFLE9BQWYsRUFBdUJ6RSxLQUF2QixFQUE2QkMsS0FBN0IsRUFBbUM7QUFDdEMsUUFBSUssSUFBSSxHQUFHVCxJQUFJLENBQUNVLE9BQUwsQ0FBYTtBQUN0QjdCLFVBQUksRUFBR0EsSUFEZTtBQUV0QnFCLGNBQVEsRUFBR0EsUUFGVztBQUd0QkMsV0FBSyxFQUFHQSxLQUhjO0FBSXRCQyxXQUFLLEVBQUVBO0FBSmUsS0FBYixDQUFYO0FBTUEsUUFBSUssSUFBSixFQUFVLE9BQU9BLElBQUksQ0FBQ0UsR0FBWjtBQUNWLFdBQU8sS0FBUDtBQUNEOztBQVZjLENBQWYsRTs7Ozs7Ozs7Ozs7QUNQQTFDLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLHlCQUFaO0FBQXVDSixNQUFNLENBQUNJLElBQVAsQ0FBWSx1QkFBWjtBQUFxQ0osTUFBTSxDQUFDSSxJQUFQLENBQVksd0JBQVo7QUFBc0NKLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLHdCQUFaLEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xyXG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XHJcblxyXG5leHBvcnQgY29uc3QgR3JvdXBNZXNzYWdlID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2dyb3VwTWVzc2FnZScpO1xyXG5cclxuaWYgKE1ldGVvci5pc1NlcnZlcil7XHJcbiAgTWV0ZW9yLnB1Ymxpc2goJ2dyb3VwTWVzc2FnZScsZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBHcm91cE1lc3NhZ2UuZmluZCgpO1xyXG4gIH0pXHJcbn1cclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICBcImdyb3VwTWVzc2FnZS5pbnNlcnRcIihuYW1lLHVzZXJzKXtcclxuICAgIGNvbnN0IHVpZCA9IEdyb3VwTWVzc2FnZS5pbnNlcnQoe1xyXG4gICAgICBuYW1lOm5hbWUsXHJcbiAgICAgIHVzZXJzIDogdXNlcnMsXHJcbiAgICAgIG9wdGlvbnMgOiB7fSxcclxuICAgICAgY3JlYXRlZF9hdDptb21lbnQoKS52YWx1ZU9mKClcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHVpZDtcclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xyXG5leHBvcnQgY29uc3QgTWVzc2FnZSA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdtZXNzYWdlJyk7XHJcbmlmIChNZXRlb3IuaXNTZXJ2ZXIpe1xyXG4gIE1ldGVvci5wdWJsaXNoKCdtZXNzYWdlcycsZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBNZXNzYWdlLmZpbmQoKTtcclxuICB9KVxyXG59XHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgXCJtZXNzYWdlLmluc2VydFwiKHNpZCxyaWQsbWVzc2FnZSx0eXBlLGdyb3VwKXtcclxuICAgIGNvbnN0IHVpZCA9IE1lc3NhZ2UuaW5zZXJ0KHtcclxuICAgICAgc2lkOnNpZCxcclxuICAgICAgcmlkOnJpZCxcclxuICAgICAgZ3JvdXA6Z3JvdXAsXHJcbiAgICAgIG1lc3NhZ2UgOiBtZXNzYWdlLFxyXG4gICAgICB2aWV3ZWQgOiBmYWxzZSxcclxuICAgICAgdHlwZTp0eXBlLFxyXG4gICAgICAvLyBsYXN0X2xvZ2luOm1vbWVudCgpLnZhbHVlT2YoKSxcclxuICAgICAgY3JlYXRlZF9hdDptb21lbnQoKS52YWx1ZU9mKClcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHVpZDtcclxuICB9LFxyXG4gIFwibWVzc2FnZS5yZW1vdmVcIihtZXNzYWdlSWQpe1xyXG4gICAgcmV0dXJuIE1lc3NhZ2UucmVtb3ZlKG1lc3NhZ2VJZCk7XHJcbiAgfSxcclxuICBcIm1lc3NhZ2UudXBkYXRlXCIobWVzc2FnZUlkLHVwZGF0ZSl7XHJcbiAgICByZXR1cm4gTWVzc2FnZS51cGRhdGUobWVzc2FnZUlkLHskc2V0OnVwZGF0ZX0pO1xyXG4gIH1cclxufSk7XHJcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xyXG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XHJcbmV4cG9ydCBjb25zdCBVc2VyID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3VzZXInKTtcclxuaWYgKE1ldGVvci5pc1NlcnZlcil7XHJcbiAgTWV0ZW9yLnB1Ymxpc2goJ3VzZXJzJyxmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIFVzZXIuZmluZCgpO1xyXG4gIH0pXHJcbn1cclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICBcInVzZXIuaW5zZXJ0XCIobmFtZSxsYXN0TmFtZSxwYXNzd29yZCxwaG9uZSxlbWFpbCl7XHJcbiAgICBjb25zdCB1aWQgPSBVc2VyLmluc2VydCh7XHJcbiAgICAgIG5hbWU6bmFtZSxcclxuICAgICAgbGFzdE5hbWU6bGFzdE5hbWUsXHJcbiAgICAgIHBhc3N3b3JkOnBhc3N3b3JkLFxyXG4gICAgICBwaG9uZSA6IHBob25lLFxyXG4gICAgICBlbWFpbCA6IGVtYWlsLFxyXG4gICAgICBjcmVhdGVkX2F0Om1vbWVudCgpLnZhbHVlT2YoKSxcclxuICAgICAgbGFzdF9sb2dpbjptb21lbnQoKS52YWx1ZU9mKClcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHVpZDtcclxuICB9LFxyXG4gIFwidXNlci5yZW1vdmVcIih1c2VySWQpe1xyXG4gICAgcmV0dXJuIFVzZXIucmVtb3ZlKHVzZXJJZCk7XHJcbiAgfSxcclxuICBcInVzZXIudXBkYXRlXCIodXNlcklkLHVwZGF0ZSl7XHJcbiAgICByZXR1cm4gVXNlci51cGRhdGUodXNlcklkLHskc2V0OnVwZGF0ZX0pO1xyXG4gIH0sXHJcbiAgXCJ1c2VyLmNoYW5nZVBhc3N3b3JkXCIodXNlcklkLG9sZFBhc3N3b3JkLG5ld1Bhc3N3b3JkKXtcclxuICAgIHZhciB1c2VyID0gVXNlci5maW5kT25lKHtcclxuICAgICAgX2lkIDogdXNlcklkLFxyXG4gICAgICBwYXNzd29yZCA6IG9sZFBhc3N3b3JkXHJcbiAgICB9KTtcclxuICAgIGlmICh1c2VyKSB7XHJcbiAgICAgIHJldHVybiBVc2VyLnVwZGF0ZSh1c2VySWQseyRzZXQ6e1xyXG4gICAgICAgIHBhc3N3b3JkOm5ld1Bhc3N3b3JkXHJcbiAgICAgIH19KTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iLCJwcm9jZXNzLmVudi5NQUlMX1VSTCA9ICdzbXRwczovL2VsaXNhdmV0YXI2MzhAZ21haWwuY29tOkVMSVNBVkVUMTMxMUBzbXRwLmdtYWlsLmNvbTo0NjUnO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gIFwiZW1haWwuc2VuZFwiKHRvLHN1YmplY3QsIHRleHQpe1xyXG4gICAgRW1haWwuc2VuZCh7XHJcbiAgICBmcm9tOiBcImZyb21AbWFpbGluYXRvci5jb21cIixcclxuICAgIHRvOiB0byxcclxuICAgIHN1YmplY3Q6IHN1YmplY3QsXHJcbiAgICB0ZXh0OiB0ZXh0XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4iLCJjb25zdCBmcyA9IE5wbS5yZXF1aXJlKCdmcycpO1xyXG5jb25zdCBwYXRoID0gTnBtLnJlcXVpcmUoJ3BhdGgnKTtcclxuY29uc3QgVVJMID0gTnBtLnJlcXVpcmUoJ3VybCcpO1xyXG5jb25zdCBodHRwID0gTnBtLnJlcXVpcmUoJ2h0dHAnKTtcclxuY29uc3QgZm9ybWlkYWJsZSA9IE5wbS5yZXF1aXJlKCdmb3JtaWRhYmxlJyk7XHJcblxyXG52YXIgYmFzZVBhdGggPSBwYXRoLnJlc29sdmUoJy4nKS5zcGxpdCgnLm1ldGVvcicpWzBdO1xyXG52YXIgZGVmYXVsdFBhdGggPSBwYXRoLnJlc29sdmUoYmFzZVBhdGgsICcuLi9maWxlcycpO1xyXG5cclxuaHR0cC5jcmVhdGVTZXJ2ZXIoZnVuY3Rpb24gKHJlcSwgcmVzKSB7XHJcbiAgdmFyIHVybCA9IFVSTC5wYXJzZShyZXEudXJsLCB0cnVlKTtcclxuICB2YXIgcXVlcnkgPSB1cmwucXVlcnk7XHJcbiAgaWYodXJsLnBhdGhuYW1lID09IFwiL1wiKXtcclxuICAgIHZhciBmaWxlID0gT2JqZWN0LmtleXMocXVlcnkpWzBdO1xyXG4gICAgaWYoZmlsZS5pbmRleE9mKCcuJykgPiAwKXtcclxuICAgICAgLy8gcmVzLndyaXRlSGVhZCgyMDAseydjb250ZW50LXR5cGUnOidpbWFnZS9wbmcnfSk7XHJcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtZGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDsgZmlsZW5hbWU9JytmaWxlKTtcclxuICAgICAgcmV0dXJuIGZzLmNyZWF0ZVJlYWRTdHJlYW0ocGF0aC5yZXNvbHZlKGRlZmF1bHRQYXRoLCBcImltZ1wiLCBmaWxlKSkucGlwZShyZXMpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZih1cmwucGF0aG5hbWUuaW5kZXhPZihcInVwbG9hZFwiKT4tMSl7XHJcbiAgICB2YXIgZm9ybSA9IG5ldyBmb3JtaWRhYmxlLkluY29taW5nRm9ybSh7bWF4RmllbGRzU2l6ZToyMDQyMjIwMTc0LCBtYXhGaWxlU2l6ZToyMDQyMjIwMTc0fSk7XHJcbiAgICBmb3JtLnBhcnNlKHJlcSwgZnVuY3Rpb24gKGVyciwgZmllbGRzLCBmaWxlcykge1xyXG4gICAgICBpZiAoIWZpbGVzLmZpbGUpcmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe3N0YXR1cyA6IFwiZXJyXCJ9KSk7XHJcbiAgICAgIHZhciBvbGRwYXRoID0gZmlsZXMuZmlsZS5wYXRoO1xyXG4gICAgICB2YXIgbmV3cGF0aCA9IHBhdGgucmVzb2x2ZShkZWZhdWx0UGF0aCwgXCJpbWdcIiwgZmlsZXMuZmlsZS5uYW1lKTtcclxuICAgICAgZnMucmVuYW1lKG9sZHBhdGgsIG5ld3BhdGgsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7c3RhdHVzIDogXCJlcnJcIiwgbXNnIDogXCJVbmV4cGVjdGVkIGVycm9yXCJ9KSk7XHJcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7c3RhdHVzIDogXCJva1wifSkpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLyBmdW5jdGlvbiBodHRwSGFuZGxlcihyZXF1ZXN0LCByZXNwb25zZSkge1xyXG4gIC8vICAgICB2YXIgdXJpID0gdXJsLnBhcnNlKHJlcXVlc3QudXJsKS5wYXRobmFtZSxcclxuICAvLyAgICAgICAgIGZpbGVuYW1lID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIHVyaSk7XHJcbiAgLy9cclxuICAvLyAgICAgZnMuZXhpc3RzKGZpbGVuYW1lLCBmdW5jdGlvbihleGlzdHMpIHtcclxuICAvLyAgICAgICAgIGlmICghZXhpc3RzKSB7XHJcbiAgLy8gICAgICAgICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKDQwNCwge1xyXG4gIC8vICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nXHJcbiAgLy8gICAgICAgICAgICAgfSk7XHJcbiAgLy8gICAgICAgICAgICAgcmVzcG9uc2Uud3JpdGUoJzQwNCBOb3QgRm91bmQ6ICcgKyBmaWxlbmFtZSArICdcXG4nKTtcclxuICAvLyAgICAgICAgICAgICByZXNwb25zZS5lbmQoKTtcclxuICAvLyAgICAgICAgICAgICByZXR1cm47XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy9cclxuICAvLyAgICAgICAgIGlmIChmaWxlbmFtZS5pbmRleE9mKCd2aWRlbycpICE9PSAtMSkge1xyXG4gIC8vICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LWRpc3Bvc2l0aW9uJywgJ2F0dGFjaG1lbnQ7IGZpbGVuYW1lPScrZmlsZSk7XHJcbiAgLy8gICAgICAgICAgIHJldHVybiBmcy5jcmVhdGVSZWFkU3RyZWFtKHBhdGgucmVzb2x2ZShkZWZhdWx0UGF0aCwgXCJtcDNcIiwgZmlsZSkpLnBpcGUocmVzKTs7XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy9cclxuICAvLyAgICAgICAgIHZhciBpc1dpbiA9ICEhcHJvY2Vzcy5wbGF0Zm9ybS5tYXRjaCgvXndpbi8pO1xyXG4gIC8vXHJcbiAgLy8gICAgICAgICBpZiAoZnMuc3RhdFN5bmMoZmlsZW5hbWUpLmlzRGlyZWN0b3J5KCkgJiYgIWlzV2luKSB7XHJcbiAgLy8gICAgICAgICAgICAgZmlsZW5hbWUgKz0gJy9pbmRleC5odG1sJztcclxuICAvLyAgICAgICAgIH0gZWxzZSBpZiAoZnMuc3RhdFN5bmMoZmlsZW5hbWUpLmlzRGlyZWN0b3J5KCkgJiYgISFpc1dpbikge1xyXG4gIC8vICAgICAgICAgICAgIGZpbGVuYW1lICs9ICdcXFxcaW5kZXguaHRtbCc7XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy9cclxuICAvLyAgICAgICAgIGZzLnJlYWRGaWxlKGZpbGVuYW1lLCAnYmluYXJ5JywgZnVuY3Rpb24oZXJyLCBmaWxlKSB7XHJcbiAgLy8gICAgICAgICAgICAgaWYgKGVycikge1xyXG4gIC8vICAgICAgICAgICAgICAgICByZXNwb25zZS53cml0ZUhlYWQoNTAwLCB7XHJcbiAgLy8gICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nXHJcbiAgLy8gICAgICAgICAgICAgICAgIH0pO1xyXG4gIC8vICAgICAgICAgICAgICAgICByZXNwb25zZS53cml0ZShlcnIgKyAnXFxuJyk7XHJcbiAgLy8gICAgICAgICAgICAgICAgIHJlc3BvbnNlLmVuZCgpO1xyXG4gIC8vICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgLy8gICAgICAgICAgICAgfVxyXG4gIC8vXHJcbiAgLy8gICAgICAgICAgICAgdmFyIGNvbnRlbnRUeXBlO1xyXG4gIC8vXHJcbiAgLy8gICAgICAgICAgICAgaWYgKGZpbGVuYW1lLmluZGV4T2YoJ3ZpZGVvJykgIT09IC0xKSB7XHJcbiAgLy8gICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlID0gJ3RleHQvaHRtbCc7XHJcbiAgLy8gICAgICAgICAgICAgfVxyXG4gIC8vXHJcbiAgLy8gICAgICAgICAgICAgaWYgKGZpbGVuYW1lLmluZGV4T2YoJ3ZpZGVvJykgIT09IC0xKSB7XHJcbiAgLy8gICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlID0gJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnO1xyXG4gIC8vICAgICAgICAgICAgIH1cclxuICAvL1xyXG4gIC8vICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSkge1xyXG4gIC8vICAgICAgICAgICAgICAgICByZXNwb25zZS53cml0ZUhlYWQoMjAwLCB7XHJcbiAgLy8gICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogY29udGVudFR5cGVcclxuICAvLyAgICAgICAgICAgICAgICAgfSk7XHJcbiAgLy8gICAgICAgICAgICAgfSBlbHNlIHJlc3BvbnNlLndyaXRlSGVhZCgyMDApO1xyXG4gIC8vXHJcbiAgLy8gICAgICAgICAgICAgcmVzcG9uc2Uud3JpdGUoZmlsZSwgJ2JpbmFyeScpO1xyXG4gIC8vICAgICAgICAgICAgIHJlc3BvbnNlLmVuZCgpO1xyXG4gIC8vICAgICAgICAgfSk7XHJcbiAgLy8gICAgIH0pO1xyXG4gIC8vIH1cclxuXHJcbiAgcmVzLndyaXRlSGVhZCgyMDAseydjb250ZW50LXR5cGUnOid0ZXh0L2pzb24nfSk7XHJcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh1cmwpKTtcclxufSkubGlzdGVuKDMzMzMpO1xyXG5jb25zb2xlLmxvZyhcIkZpbGUgU2VydmVyIHJ1bm5pbmcgYXQgaHR0cDovL2xvY2FsaG9zdDozMzMzL1wiKTtcclxuIiwiaW1wb3J0IHsgVXNlciB9IGZyb20gJy9pbXBvcnRzL2FwaS91c2VyL3VzZXIuanMnO1xyXG5cclxudmFyIEFwaSA9IG5ldyBSZXN0aXZ1cyh7XHJcbiAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlLFxyXG4gIHByZXR0eUpzb246IGZhbHNlLFxyXG4gIGVuYWJsZUNvcnMgOiB0cnVlXHJcbn0pO1xyXG5cclxuQXBpLmFkZFJvdXRlKCd0ZXN0Jywge1xyXG4gIGdldCA6IGZ1bmN0aW9uKHJlcSwgcmVzKXtcclxuICAgIHZhciBuYW1lID0gdGhpcy5ib2R5UGFyYW1zLm5hbWU7XHJcbiAgICB2YXIgbmFtZTEgPSBVc2VyLmZpbmRPbmUoe25hbWU6bmFtZX0pO1xyXG4gICAgdmFyIHVzZXJJZCA9IHRoaXMucXVlcnlQYXJhbXMudXNlcklkO1xyXG4gICAgcmV0dXJuIHtzdGF0dXMgOiBcIk9LXCIsIG5hbWU6IHRoaXMucXVlcnlQYXJhbXMubmFtZX07XHJcbiAgfVxyXG59KTtcclxuIiwiaW1wb3J0ICcvaW1wb3J0cy9hcGkvdXNlci91c2VyLmpzJztcclxuaW1wb3J0ICcvaW1wb3J0cy9hcGkvbWVzc2FnZXMvbWVzc2FnZXMuanMnO1xyXG5pbXBvcnQgJy9pbXBvcnRzL2FwaS9ncm91cE1lc3Nlbmdlci9ncm91cE1lc3NhZ2UuanMnO1xyXG5cclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy9pbXBvcnRzL2FwaS91c2VyL3VzZXIuanMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnL2ltcG9ydHMvYXBpL21lc3NhZ2VzL21lc3NhZ2VzLmpzJztcclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuTG9naW4obmFtZSxwYXNzd29yZCxjb3VudHJ5LHBob25lLGVtYWlsKXtcclxuICB2YXIgdXNlciA9IFVzZXIuZmluZE9uZSh7XHJcbiAgICBuYW1lIDogbmFtZSxcclxuICAgIHBhc3N3b3JkIDogcGFzc3dvcmQsXHJcbiAgICBwaG9uZSA6IHBob25lLFxyXG4gICAgZW1haWwgOmVtYWlsXHJcbiAgfSk7XHJcbiAgaWYgKHVzZXIpIHJldHVybiB1c2VyLl9pZDtcclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxufSk7XHJcbiIsImltcG9ydCBcIi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyXCI7XG5pbXBvcnQgXCIvaW1wb3J0cy9zdGFydHVwL3Jlc3RcIjtcbmltcG9ydCBcIi9pbXBvcnRzL3N0YXJ0dXAvZW1haWxcIjtcbmltcG9ydCBcIi9pbXBvcnRzL3N0YXJ0dXAvZmlsZXNcIjtcbiJdfQ==
