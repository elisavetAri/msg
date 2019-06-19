var require = meteorInstall({"imports":{"api":{"user":{"user.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// imports/api/user/user.js                                                   //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"email":{"index.js":function(){

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// imports/startup/email/index.js                                             //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //
process.env.MAIL_URL = 'smtp://user%40gmail.com:password@smtp.gmail.com:465';
Email.send({
  from: "from@mailinator.com",
  to: "elisavet_ari@hotmail.co.uk",
  subject: "Subject",
  text: "Here is some text"
});
////////////////////////////////////////////////////////////////////////////////

}},"rest":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// imports/startup/rest/index.js                                              //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////

}},"server":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// imports/startup/server/index.js                                            //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //
module.link("/imports/api/user/user.js");
let User;
module.link("/imports/api/user/user.js", {
  User(v) {
    User = v;
  }

}, 0);
let Email;
module.link("meteor/email", {
  Email(v) {
    Email = v;
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
////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// server/main.js                                                             //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //
module.link("/imports/startup/server");
module.link("/imports/startup/rest");
module.link("/imports/startup/email");
////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdXNlci91c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvZW1haWwvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9yZXN0L2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJVc2VyIiwiTWV0ZW9yIiwibGluayIsInYiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJpc1NlcnZlciIsInB1Ymxpc2giLCJmaW5kIiwibWV0aG9kcyIsIm5hbWUiLCJwYXNzd29yZCIsInBob25lIiwiZW1haWwiLCJ1aWQiLCJpbnNlcnQiLCJjcmVhdGVkX2F0IiwibW9tZW50IiwidmFsdWVPZiIsInVzZXJJZCIsInJlbW92ZSIsInVwZGF0ZSIsIiRzZXQiLCJvbGRQYXNzd29yZCIsIm5ld1Bhc3N3b3JkIiwidXNlciIsImZpbmRPbmUiLCJfaWQiLCJwcm9jZXNzIiwiZW52IiwiTUFJTF9VUkwiLCJFbWFpbCIsInNlbmQiLCJmcm9tIiwidG8iLCJzdWJqZWN0IiwidGV4dCIsIkFwaSIsIlJlc3RpdnVzIiwidXNlRGVmYXVsdEF1dGgiLCJwcmV0dHlKc29uIiwiZW5hYmxlQ29ycyIsImFkZFJvdXRlIiwiZ2V0IiwicmVxIiwicmVzIiwiYm9keVBhcmFtcyIsIm5hbWUxIiwicXVlcnlQYXJhbXMiLCJzdGF0dXMiLCJMb2dpbiIsImNvdW50cnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLE1BQUksRUFBQyxNQUFJQTtBQUFWLENBQWQ7QUFBK0IsSUFBSUMsTUFBSjtBQUFXSCxNQUFNLENBQUNJLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNELFFBQU0s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Q0FBQ0ksSUFBUCxDQUFZLHlCQUFaO0FBQXVDSixNQUFNLENBQUNJLElBQVAsQ0FBWSx1QkFBWjtBQUFxQ0osTUFBTSxDQUFDSSxJQUFQLENBQVksd0JBQVosRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XHJcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcclxuZXhwb3J0IGNvbnN0IFVzZXIgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbigndXNlcicpO1xyXG5pZiAoTWV0ZW9yLmlzU2VydmVyKXtcclxuICBNZXRlb3IucHVibGlzaCgndXNlcnMnLGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gVXNlci5maW5kKCk7XHJcbiAgfSlcclxufVxyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gIFwidXNlci5pbnNlcnRcIihuYW1lLHBhc3N3b3JkLHBob25lLGVtYWlsKXtcclxuICAgIGNvbnN0IHVpZCA9IFVzZXIuaW5zZXJ0KHtcclxuICAgICAgbmFtZTpuYW1lLFxyXG4gICAgICBwYXNzd29yZDpwYXNzd29yZCxcclxuICAgICAgcGhvbmUgOiBwaG9uZSxcclxuICAgICAgZW1haWwgOiBlbWFpbCxcclxuICAgICAgY3JlYXRlZF9hdDptb21lbnQoKS52YWx1ZU9mKClcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHVpZDtcclxuICB9LFxyXG4gIFwidXNlci5yZW1vdmVcIih1c2VySWQpe1xyXG4gICAgcmV0dXJuIFVzZXIucmVtb3ZlKHVzZXJJZCk7XHJcbiAgfSxcclxuICBcInVzZXIudXBkYXRlXCIodXNlcklkLHVwZGF0ZSl7XHJcbiAgICByZXR1cm4gVXNlci51cGRhdGUodXNlcklkLHskc2V0OnVwZGF0ZX0pO1xyXG4gIH0sXHJcbiAgXCJ1c2VyLmNoYW5nZVBhc3N3b3JkXCIodXNlcklkLG9sZFBhc3N3b3JkLG5ld1Bhc3N3b3JkKXtcclxuICAgIHZhciB1c2VyID0gVXNlci5maW5kT25lKHtcclxuICAgICAgX2lkIDogdXNlcklkLFxyXG4gICAgICBwYXNzd29yZCA6IG9sZFBhc3N3b3JkXHJcbiAgICB9KTtcclxuICAgIGlmICh1c2VyKSB7XHJcbiAgICAgIHJldHVybiBVc2VyLnVwZGF0ZSh1c2VySWQseyRzZXQ6e1xyXG4gICAgICAgIHBhc3N3b3JkOm5ld1Bhc3N3b3JkXHJcbiAgICAgIH19KTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gLFxyXG4gIC8vIFwidXNlci5yZW1vdmVcIih1c2VySWQpe1xyXG4gIC8vICAgcmV0dXJuIFVzZXIucmVtb3ZlKHVzZXJJZCk7XHJcbiAgLy8gfVxyXG59KTtcclxuIiwicHJvY2Vzcy5lbnYuTUFJTF9VUkwgPSAnc210cDovL3VzZXIlNDBnbWFpbC5jb206cGFzc3dvcmRAc210cC5nbWFpbC5jb206NDY1JztcclxuRW1haWwuc2VuZCh7XHJcbmZyb206IFwiZnJvbUBtYWlsaW5hdG9yLmNvbVwiLFxyXG50bzogXCJlbGlzYXZldF9hcmlAaG90bWFpbC5jby51a1wiLFxyXG5zdWJqZWN0OiBcIlN1YmplY3RcIixcclxudGV4dDogXCJIZXJlIGlzIHNvbWUgdGV4dFwiXHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBVc2VyIH0gZnJvbSAnL2ltcG9ydHMvYXBpL3VzZXIvdXNlci5qcyc7XHJcblxyXG52YXIgQXBpID0gbmV3IFJlc3RpdnVzKHtcclxuICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXHJcbiAgcHJldHR5SnNvbjogZmFsc2UsXHJcbiAgZW5hYmxlQ29ycyA6IHRydWVcclxufSk7XHJcblxyXG5BcGkuYWRkUm91dGUoJ3Rlc3QnLCB7XHJcbiAgZ2V0IDogZnVuY3Rpb24ocmVxLCByZXMpe1xyXG4gICAgdmFyIG5hbWUgPSB0aGlzLmJvZHlQYXJhbXMubmFtZTtcclxuICAgIHZhciBuYW1lMSA9IFVzZXIuZmluZE9uZSh7bmFtZTpuYW1lfSk7XHJcbiAgICB2YXIgdXNlcklkID0gdGhpcy5xdWVyeVBhcmFtcy51c2VySWQ7XHJcbiAgICByZXR1cm4ge3N0YXR1cyA6IFwiT0tcIiwgbmFtZTogdGhpcy5xdWVyeVBhcmFtcy5uYW1lfTtcclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQgJy9pbXBvcnRzL2FwaS91c2VyL3VzZXIuanMnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnL2ltcG9ydHMvYXBpL3VzZXIvdXNlci5qcyc7XHJcbmltcG9ydCB7IEVtYWlsIH0gZnJvbSAnbWV0ZW9yL2VtYWlsJztcclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuTG9naW4obmFtZSxwYXNzd29yZCxjb3VudHJ5LHBob25lLGVtYWlsKXtcclxuICB2YXIgdXNlciA9IFVzZXIuZmluZE9uZSh7XHJcbiAgICBuYW1lIDogbmFtZSxcclxuICAgIHBhc3N3b3JkIDogcGFzc3dvcmQsXHJcbiAgICBwaG9uZSA6IHBob25lLFxyXG4gICAgZW1haWwgOmVtYWlsXHJcbiAgfSk7XHJcbiAgaWYgKHVzZXIpIHJldHVybiB1c2VyLl9pZDtcclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxufSk7XHJcbiIsImltcG9ydCBcIi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyXCI7XG5pbXBvcnQgXCIvaW1wb3J0cy9zdGFydHVwL3Jlc3RcIjtcbmltcG9ydCBcIi9pbXBvcnRzL3N0YXJ0dXAvZW1haWxcIjtcbiJdfQ==
