var require = meteorInstall({"imports":{"api":{"messages":{"messages.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// imports/api/messages/messages.js                                                       //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
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
  "message.insert"(sid, rid, message) {
    const uid = Message.insert({
      sid: sid,
      rid: rid,
      message: message,
      viewed: false,
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
////////////////////////////////////////////////////////////////////////////////////////////

}},"user":{"user.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// imports/api/user/user.js                                                               //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
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
  "user.insert"(name, password, phone, email) {
    const uid = User.insert({
      name: name,
      password: password,
      phone: phone,
      email: email,
      created_at: moment().valueOf()
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
  } // ,
  // "user.remove"(userId){
  //   return User.remove(userId);
  // }


});
////////////////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"email":{"index.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// imports/startup/email/index.js                                                         //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////

}},"rest":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// imports/startup/rest/index.js                                                          //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// imports/startup/server/index.js                                                        //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
module.link("/imports/api/user/user.js");
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
////////////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// server/main.js                                                                         //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
module.link("/imports/startup/server");
module.link("/imports/startup/rest");
module.link("/imports/startup/email");
////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvbWVzc2FnZXMvbWVzc2FnZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3VzZXIvdXNlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL2VtYWlsL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvcmVzdC9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21haW4uanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiTWVzc2FnZSIsIk1ldGVvciIsImxpbmsiLCJ2IiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiaXNTZXJ2ZXIiLCJwdWJsaXNoIiwiZmluZCIsIm1ldGhvZHMiLCJzaWQiLCJyaWQiLCJtZXNzYWdlIiwidWlkIiwiaW5zZXJ0Iiwidmlld2VkIiwiY3JlYXRlZF9hdCIsIm1vbWVudCIsInZhbHVlT2YiLCJtZXNzYWdlSWQiLCJyZW1vdmUiLCJ1cGRhdGUiLCIkc2V0IiwiVXNlciIsIm5hbWUiLCJwYXNzd29yZCIsInBob25lIiwiZW1haWwiLCJ1c2VySWQiLCJvbGRQYXNzd29yZCIsIm5ld1Bhc3N3b3JkIiwidXNlciIsImZpbmRPbmUiLCJfaWQiLCJwcm9jZXNzIiwiZW52IiwiTUFJTF9VUkwiLCJ0byIsInN1YmplY3QiLCJ0ZXh0IiwiRW1haWwiLCJzZW5kIiwiZnJvbSIsIkFwaSIsIlJlc3RpdnVzIiwidXNlRGVmYXVsdEF1dGgiLCJwcmV0dHlKc29uIiwiZW5hYmxlQ29ycyIsImFkZFJvdXRlIiwiZ2V0IiwicmVxIiwicmVzIiwiYm9keVBhcmFtcyIsIm5hbWUxIiwicXVlcnlQYXJhbXMiLCJzdGF0dXMiLCJMb2dpbiIsImNvdW50cnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFB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QUFDUSxPQUFQLENBQWU7QUFDZitDLE9BQUssQ0FBQ2hDLElBQUQsRUFBTUMsUUFBTixFQUFlZ0MsT0FBZixFQUF1Qi9CLEtBQXZCLEVBQTZCQyxLQUE3QixFQUFtQztBQUN0QyxRQUFJSSxJQUFJLEdBQUdSLElBQUksQ0FBQ1MsT0FBTCxDQUFhO0FBQ3RCUixVQUFJLEVBQUdBLElBRGU7QUFFdEJDLGNBQVEsRUFBR0EsUUFGVztBQUd0QkMsV0FBSyxFQUFHQSxLQUhjO0FBSXRCQyxXQUFLLEVBQUVBO0FBSmUsS0FBYixDQUFYO0FBTUEsUUFBSUksSUFBSixFQUFVLE9BQU9BLElBQUksQ0FBQ0UsR0FBWjtBQUNWLFdBQU8sS0FBUDtBQUNEOztBQVZjLENBQWYsRTs7Ozs7Ozs7Ozs7QUNKQW5DLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLHlCQUFaO0FBQXVDSixNQUFNLENBQUNJLElBQVAsQ0FBWSx1QkFBWjtBQUFxQ0osTUFBTSxDQUFDSSxJQUFQLENBQVksd0JBQVosRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XHJcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcclxuZXhwb3J0IGNvbnN0IE1lc3NhZ2UgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignbWVzc2FnZScpO1xyXG5pZiAoTWV0ZW9yLmlzU2VydmVyKXtcclxuICBNZXRlb3IucHVibGlzaCgnbWVzc2FnZXMnLGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gTWVzc2FnZS5maW5kKCk7XHJcbiAgfSlcclxufVxyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gIFwibWVzc2FnZS5pbnNlcnRcIihzaWQscmlkLG1lc3NhZ2Upe1xyXG4gICAgY29uc3QgdWlkID0gTWVzc2FnZS5pbnNlcnQoe1xyXG4gICAgICBzaWQ6c2lkLFxyXG4gICAgICByaWQ6cmlkLFxyXG4gICAgICBtZXNzYWdlIDogbWVzc2FnZSxcclxuICAgICAgdmlld2VkIDogZmFsc2UsXHJcbiAgICAgIGNyZWF0ZWRfYXQ6bW9tZW50KCkudmFsdWVPZigpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB1aWQ7XHJcbiAgfSxcclxuICBcIm1lc3NhZ2UucmVtb3ZlXCIobWVzc2FnZUlkKXtcclxuICAgIHJldHVybiBNZXNzYWdlLnJlbW92ZShtZXNzYWdlSWQpO1xyXG4gIH0sXHJcbiAgXCJtZXNzYWdlLnVwZGF0ZVwiKG1lc3NhZ2VJZCx1cGRhdGUpe1xyXG4gICAgcmV0dXJuIE1lc3NhZ2UudXBkYXRlKG1lc3NhZ2VJZCx7JHNldDp1cGRhdGV9KTtcclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xyXG5leHBvcnQgY29uc3QgVXNlciA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCd1c2VyJyk7XHJcbmlmIChNZXRlb3IuaXNTZXJ2ZXIpe1xyXG4gIE1ldGVvci5wdWJsaXNoKCd1c2VycycsZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBVc2VyLmZpbmQoKTtcclxuICB9KVxyXG59XHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgXCJ1c2VyLmluc2VydFwiKG5hbWUscGFzc3dvcmQscGhvbmUsZW1haWwpe1xyXG4gICAgY29uc3QgdWlkID0gVXNlci5pbnNlcnQoe1xyXG4gICAgICBuYW1lOm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkOnBhc3N3b3JkLFxyXG4gICAgICBwaG9uZSA6IHBob25lLFxyXG4gICAgICBlbWFpbCA6IGVtYWlsLFxyXG4gICAgICBjcmVhdGVkX2F0Om1vbWVudCgpLnZhbHVlT2YoKVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdWlkO1xyXG4gIH0sXHJcbiAgXCJ1c2VyLnJlbW92ZVwiKHVzZXJJZCl7XHJcbiAgICByZXR1cm4gVXNlci5yZW1vdmUodXNlcklkKTtcclxuICB9LFxyXG4gIFwidXNlci51cGRhdGVcIih1c2VySWQsdXBkYXRlKXtcclxuICAgIHJldHVybiBVc2VyLnVwZGF0ZSh1c2VySWQseyRzZXQ6dXBkYXRlfSk7XHJcbiAgfSxcclxuICBcInVzZXIuY2hhbmdlUGFzc3dvcmRcIih1c2VySWQsb2xkUGFzc3dvcmQsbmV3UGFzc3dvcmQpe1xyXG4gICAgdmFyIHVzZXIgPSBVc2VyLmZpbmRPbmUoe1xyXG4gICAgICBfaWQgOiB1c2VySWQsXHJcbiAgICAgIHBhc3N3b3JkIDogb2xkUGFzc3dvcmRcclxuICAgIH0pO1xyXG4gICAgaWYgKHVzZXIpIHtcclxuICAgICAgcmV0dXJuIFVzZXIudXBkYXRlKHVzZXJJZCx7JHNldDp7XHJcbiAgICAgICAgcGFzc3dvcmQ6bmV3UGFzc3dvcmRcclxuICAgICAgfX0pO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyAsXHJcbiAgLy8gXCJ1c2VyLnJlbW92ZVwiKHVzZXJJZCl7XHJcbiAgLy8gICByZXR1cm4gVXNlci5yZW1vdmUodXNlcklkKTtcclxuICAvLyB9XHJcbn0pO1xyXG4iLCJwcm9jZXNzLmVudi5NQUlMX1VSTCA9ICdzbXRwczovL2VsaXNhdmV0YXI2MzhAZ21haWwuY29tOkVMSVNBVkVUMTMxMUBzbXRwLmdtYWlsLmNvbTo0NjUnO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gIFwiZW1haWwuc2VuZFwiKHRvLHN1YmplY3QsIHRleHQpe1xyXG4gICAgRW1haWwuc2VuZCh7XHJcbiAgICBmcm9tOiBcImZyb21AbWFpbGluYXRvci5jb21cIixcclxuICAgIHRvOiB0byxcclxuICAgIHN1YmplY3Q6IHN1YmplY3QsXHJcbiAgICB0ZXh0OiB0ZXh0XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBVc2VyIH0gZnJvbSAnL2ltcG9ydHMvYXBpL3VzZXIvdXNlci5qcyc7XHJcblxyXG52YXIgQXBpID0gbmV3IFJlc3RpdnVzKHtcclxuICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXHJcbiAgcHJldHR5SnNvbjogZmFsc2UsXHJcbiAgZW5hYmxlQ29ycyA6IHRydWVcclxufSk7XHJcblxyXG5BcGkuYWRkUm91dGUoJ3Rlc3QnLCB7XHJcbiAgZ2V0IDogZnVuY3Rpb24ocmVxLCByZXMpe1xyXG4gICAgdmFyIG5hbWUgPSB0aGlzLmJvZHlQYXJhbXMubmFtZTtcclxuICAgIHZhciBuYW1lMSA9IFVzZXIuZmluZE9uZSh7bmFtZTpuYW1lfSk7XHJcbiAgICB2YXIgdXNlcklkID0gdGhpcy5xdWVyeVBhcmFtcy51c2VySWQ7XHJcbiAgICByZXR1cm4ge3N0YXR1cyA6IFwiT0tcIiwgbmFtZTogdGhpcy5xdWVyeVBhcmFtcy5uYW1lfTtcclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQgJy9pbXBvcnRzL2FwaS91c2VyL3VzZXIuanMnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnL2ltcG9ydHMvYXBpL3VzZXIvdXNlci5qcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcvaW1wb3J0cy9hcGkvbWVzc2FnZXMvbWVzc2FnZXMuanMnO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG5Mb2dpbihuYW1lLHBhc3N3b3JkLGNvdW50cnkscGhvbmUsZW1haWwpe1xyXG4gIHZhciB1c2VyID0gVXNlci5maW5kT25lKHtcclxuICAgIG5hbWUgOiBuYW1lLFxyXG4gICAgcGFzc3dvcmQgOiBwYXNzd29yZCxcclxuICAgIHBob25lIDogcGhvbmUsXHJcbiAgICBlbWFpbCA6ZW1haWxcclxuICB9KTtcclxuICBpZiAodXNlcikgcmV0dXJuIHVzZXIuX2lkO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG59KTtcclxuIiwiaW1wb3J0IFwiL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXJcIjtcbmltcG9ydCBcIi9pbXBvcnRzL3N0YXJ0dXAvcmVzdFwiO1xuaW1wb3J0IFwiL2ltcG9ydHMvc3RhcnR1cC9lbWFpbFwiO1xuIl19
