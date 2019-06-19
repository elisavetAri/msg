var require = meteorInstall({"imports":{"api":{"user":{"user.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// imports/api/user/user.js                                                                    //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"email":{"index.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// imports/startup/email/index.js                                                              //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
// process.env.MAIL_URL = 'smtps://USERNAME:PASSWORD@HOST:8080';
// Meteor.startup(function () {
//   if(Meteor.isServer) {
//  process.env.MAIL_URL="smtp://mygmailaddress%40gmail.com:mypassword@smtp.gmail.com:465/";
// };
Meteor.startup(function () {
  if (Meteor.isServer) {
    process.env.MAIL_URL = "smtp://mygmailaddress%40gmail.com:mypassword@smtp.gmail.com:465/";
  }
});
Email.send({
  from: "from@mailinator.com",
  to: "elisavet_ari@hotmail.co.uk",
  subject: "Subject",
  text: "Here is some text"
});
/////////////////////////////////////////////////////////////////////////////////////////////////

}},"rest":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// imports/startup/rest/index.js                                                               //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// imports/startup/server/index.js                                                             //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// server/main.js                                                                              //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
module.link("/imports/startup/server");
module.link("/imports/startup/rest");
module.link("/imports/startup/email");
/////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdXNlci91c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvZW1haWwvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9yZXN0L2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJVc2VyIiwiTWV0ZW9yIiwibGluayIsInYiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJpc1NlcnZlciIsInB1Ymxpc2giLCJmaW5kIiwibWV0aG9kcyIsIm5hbWUiLCJwYXNzd29yZCIsInBob25lIiwiZW1haWwiLCJ1aWQiLCJpbnNlcnQiLCJjcmVhdGVkX2F0IiwibW9tZW50IiwidmFsdWVPZiIsInVzZXJJZCIsInJlbW92ZSIsInVwZGF0ZSIsIiRzZXQiLCJvbGRQYXNzd29yZCIsIm5ld1Bhc3N3b3JkIiwidXNlciIsImZpbmRPbmUiLCJfaWQiLCJzdGFydHVwIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwiRW1haWwiLCJzZW5kIiwiZnJvbSIsInRvIiwic3ViamVjdCIsInRleHQiLCJBcGkiLCJSZXN0aXZ1cyIsInVzZURlZmF1bHRBdXRoIiwicHJldHR5SnNvbiIsImVuYWJsZUNvcnMiLCJhZGRSb3V0ZSIsImdldCIsInJlcSIsInJlcyIsImJvZHlQYXJhbXMiLCJuYW1lMSIsInF1ZXJ5UGFyYW1zIiwic3RhdHVzIiwiTG9naW4iLCJjb3VudHJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxNQUFJLEVBQUMsTUFBSUE7QUFBVixDQUFkO0FBQStCLElBQUlDLE1BQUo7QUFBV0gsTUFBTSxDQUFDSSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRCxRQUFNLENBQUNFLENBQUQsRUFBRztBQUFDRixVQUFNLEdBQUNFLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsS0FBSjtBQUFVTixNQUFNLENBQUNJLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLE9BQUssQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFNBQUssR0FBQ0QsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUVsRyxNQUFNSCxJQUFJLEdBQUcsSUFBSUksS0FBSyxDQUFDQyxVQUFWLENBQXFCLE1BQXJCLENBQWI7O0FBQ1AsSUFBSUosTUFBTSxDQUFDSyxRQUFYLEVBQW9CO0FBQ2xCTCxRQUFNLENBQUNNLE9BQVAsQ0FBZSxPQUFmLEVBQXVCLFlBQVU7QUFDL0IsV0FBT1AsSUFBSSxDQUFDUSxJQUFMLEVBQVA7QUFDRCxHQUZEO0FBR0Q7O0FBRURQLE1BQU0sQ0FBQ1EsT0FBUCxDQUFlO0FBQ2IsZ0JBQWNDLElBQWQsRUFBbUJDLFFBQW5CLEVBQTRCQyxLQUE1QixFQUFrQ0MsS0FBbEMsRUFBd0M7QUFDdEMsVUFBTUMsR0FBRyxHQUFHZCxJQUFJLENBQUNlLE1BQUwsQ0FBWTtBQUN0QkwsVUFBSSxFQUFDQSxJQURpQjtBQUV0QkMsY0FBUSxFQUFDQSxRQUZhO0FBR3RCQyxXQUFLLEVBQUdBLEtBSGM7QUFJdEJDLFdBQUssRUFBR0EsS0FKYztBQUt0QkcsZ0JBQVUsRUFBQ0MsTUFBTSxHQUFHQyxPQUFUO0FBTFcsS0FBWixDQUFaO0FBT0EsV0FBT0osR0FBUDtBQUNELEdBVlk7O0FBV2IsZ0JBQWNLLE1BQWQsRUFBcUI7QUFDbkIsV0FBT25CLElBQUksQ0FBQ29CLE1BQUwsQ0FBWUQsTUFBWixDQUFQO0FBQ0QsR0FiWTs7QUFjYixnQkFBY0EsTUFBZCxFQUFxQkUsTUFBckIsRUFBNEI7QUFDMUIsV0FBT3JCLElBQUksQ0FBQ3FCLE1BQUwsQ0FBWUYsTUFBWixFQUFtQjtBQUFDRyxVQUFJLEVBQUNEO0FBQU4sS0FBbkIsQ0FBUDtBQUNELEdBaEJZOztBQWlCYix3QkFBc0JGLE1BQXRCLEVBQTZCSSxXQUE3QixFQUF5Q0MsV0FBekMsRUFBcUQ7QUFDbkQsUUFBSUMsSUFBSSxHQUFHekIsSUFBSSxDQUFDMEIsT0FBTCxDQUFhO0FBQ3RCQyxTQUFHLEVBQUdSLE1BRGdCO0FBRXRCUixjQUFRLEVBQUdZO0FBRlcsS0FBYixDQUFYOztBQUlBLFFBQUlFLElBQUosRUFBVTtBQUNSLGFBQU96QixJQUFJLENBQUNxQixNQUFMLENBQVlGLE1BQVosRUFBbUI7QUFBQ0csWUFBSSxFQUFDO0FBQzlCWCxrQkFBUSxFQUFDYTtBQURxQjtBQUFOLE9BQW5CLENBQVA7QUFHRDtBQUNGLEdBM0JZLENBNEJiO0FBQ0E7QUFDQTtBQUNBOzs7QUEvQmEsQ0FBZixFOzs7Ozs7Ozs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQXZCLE1BQU0sQ0FBQzJCLE9BQVAsQ0FBZSxZQUFVO0FBQ3ZCLE1BQUkzQixNQUFNLENBQUNLLFFBQVgsRUFBb0I7QUFDbEJ1QixXQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBWixHQUFxQixrRUFBckI7QUFDRDtBQUNGLENBSkQ7QUFLQUMsS0FBSyxDQUFDQyxJQUFOLENBQVc7QUFDWEMsTUFBSSxFQUFFLHFCQURLO0FBRVhDLElBQUUsRUFBRSw0QkFGTztBQUdYQyxTQUFPLEVBQUUsU0FIRTtBQUlYQyxNQUFJLEVBQUU7QUFKSyxDQUFYLEU7Ozs7Ozs7Ozs7O0FDZEEsSUFBSXJDLElBQUo7QUFBU0YsTUFBTSxDQUFDSSxJQUFQLENBQVksMkJBQVosRUFBd0M7QUFBQ0YsTUFBSSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsUUFBSSxHQUFDRyxDQUFMO0FBQU87O0FBQWhCLENBQXhDLEVBQTBELENBQTFEO0FBRVQsSUFBSW1DLEdBQUcsR0FBRyxJQUFJQyxRQUFKLENBQWE7QUFDckJDLGdCQUFjLEVBQUUsS0FESztBQUVyQkMsWUFBVSxFQUFFLEtBRlM7QUFHckJDLFlBQVUsRUFBRztBQUhRLENBQWIsQ0FBVjtBQU1BSixHQUFHLENBQUNLLFFBQUosQ0FBYSxNQUFiLEVBQXFCO0FBQ25CQyxLQUFHLEVBQUcsVUFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQWtCO0FBQ3RCLFFBQUlwQyxJQUFJLEdBQUcsS0FBS3FDLFVBQUwsQ0FBZ0JyQyxJQUEzQjtBQUNBLFFBQUlzQyxLQUFLLEdBQUdoRCxJQUFJLENBQUMwQixPQUFMLENBQWE7QUFBQ2hCLFVBQUksRUFBQ0E7QUFBTixLQUFiLENBQVo7QUFDQSxRQUFJUyxNQUFNLEdBQUcsS0FBSzhCLFdBQUwsQ0FBaUI5QixNQUE5QjtBQUNBLFdBQU87QUFBQytCLFlBQU0sRUFBRyxJQUFWO0FBQWdCeEMsVUFBSSxFQUFFLEtBQUt1QyxXQUFMLENBQWlCdkM7QUFBdkMsS0FBUDtBQUNEO0FBTmtCLENBQXJCLEU7Ozs7Ozs7Ozs7O0FDUkFaLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLDJCQUFaO0FBQXlDLElBQUlGLElBQUo7QUFBU0YsTUFBTSxDQUFDSSxJQUFQLENBQVksMkJBQVosRUFBd0M7QUFBQ0YsTUFBSSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsUUFBSSxHQUFDRyxDQUFMO0FBQU87O0FBQWhCLENBQXhDLEVBQTBELENBQTFEO0FBQTZELElBQUk2QixLQUFKO0FBQVVsQyxNQUFNLENBQUNJLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUM4QixPQUFLLENBQUM3QixDQUFELEVBQUc7QUFBQzZCLFNBQUssR0FBQzdCLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFJekhGLE1BQU0sQ0FBQ1EsT0FBUCxDQUFlO0FBQ2YwQyxPQUFLLENBQUN6QyxJQUFELEVBQU1DLFFBQU4sRUFBZXlDLE9BQWYsRUFBdUJ4QyxLQUF2QixFQUE2QkMsS0FBN0IsRUFBbUM7QUFDdEMsUUFBSVksSUFBSSxHQUFHekIsSUFBSSxDQUFDMEIsT0FBTCxDQUFhO0FBQ3RCaEIsVUFBSSxFQUFHQSxJQURlO0FBRXRCQyxjQUFRLEVBQUdBLFFBRlc7QUFHdEJDLFdBQUssRUFBR0EsS0FIYztBQUl0QkMsV0FBSyxFQUFFQTtBQUplLEtBQWIsQ0FBWDtBQU1BLFFBQUlZLElBQUosRUFBVSxPQUFPQSxJQUFJLENBQUNFLEdBQVo7QUFDVixXQUFPLEtBQVA7QUFDRDs7QUFWYyxDQUFmLEU7Ozs7Ozs7Ozs7O0FDSkE3QixNQUFNLENBQUNJLElBQVAsQ0FBWSx5QkFBWjtBQUF1Q0osTUFBTSxDQUFDSSxJQUFQLENBQVksdUJBQVo7QUFBcUNKLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLHdCQUFaLEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xyXG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XHJcbmV4cG9ydCBjb25zdCBVc2VyID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3VzZXInKTtcclxuaWYgKE1ldGVvci5pc1NlcnZlcil7XHJcbiAgTWV0ZW9yLnB1Ymxpc2goJ3VzZXJzJyxmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIFVzZXIuZmluZCgpO1xyXG4gIH0pXHJcbn1cclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICBcInVzZXIuaW5zZXJ0XCIobmFtZSxwYXNzd29yZCxwaG9uZSxlbWFpbCl7XHJcbiAgICBjb25zdCB1aWQgPSBVc2VyLmluc2VydCh7XHJcbiAgICAgIG5hbWU6bmFtZSxcclxuICAgICAgcGFzc3dvcmQ6cGFzc3dvcmQsXHJcbiAgICAgIHBob25lIDogcGhvbmUsXHJcbiAgICAgIGVtYWlsIDogZW1haWwsXHJcbiAgICAgIGNyZWF0ZWRfYXQ6bW9tZW50KCkudmFsdWVPZigpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB1aWQ7XHJcbiAgfSxcclxuICBcInVzZXIucmVtb3ZlXCIodXNlcklkKXtcclxuICAgIHJldHVybiBVc2VyLnJlbW92ZSh1c2VySWQpO1xyXG4gIH0sXHJcbiAgXCJ1c2VyLnVwZGF0ZVwiKHVzZXJJZCx1cGRhdGUpe1xyXG4gICAgcmV0dXJuIFVzZXIudXBkYXRlKHVzZXJJZCx7JHNldDp1cGRhdGV9KTtcclxuICB9LFxyXG4gIFwidXNlci5jaGFuZ2VQYXNzd29yZFwiKHVzZXJJZCxvbGRQYXNzd29yZCxuZXdQYXNzd29yZCl7XHJcbiAgICB2YXIgdXNlciA9IFVzZXIuZmluZE9uZSh7XHJcbiAgICAgIF9pZCA6IHVzZXJJZCxcclxuICAgICAgcGFzc3dvcmQgOiBvbGRQYXNzd29yZFxyXG4gICAgfSk7XHJcbiAgICBpZiAodXNlcikge1xyXG4gICAgICByZXR1cm4gVXNlci51cGRhdGUodXNlcklkLHskc2V0OntcclxuICAgICAgICBwYXNzd29yZDpuZXdQYXNzd29yZFxyXG4gICAgICB9fSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vICxcclxuICAvLyBcInVzZXIucmVtb3ZlXCIodXNlcklkKXtcclxuICAvLyAgIHJldHVybiBVc2VyLnJlbW92ZSh1c2VySWQpO1xyXG4gIC8vIH1cclxufSk7XHJcbiIsIlxyXG5cclxuLy8gcHJvY2Vzcy5lbnYuTUFJTF9VUkwgPSAnc210cHM6Ly9VU0VSTkFNRTpQQVNTV09SREBIT1NUOjgwODAnO1xyXG4vLyBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcbi8vICAgaWYoTWV0ZW9yLmlzU2VydmVyKSB7XHJcbi8vICBwcm9jZXNzLmVudi5NQUlMX1VSTD1cInNtdHA6Ly9teWdtYWlsYWRkcmVzcyU0MGdtYWlsLmNvbTpteXBhc3N3b3JkQHNtdHAuZ21haWwuY29tOjQ2NS9cIjtcclxuLy8gfTtcclxuXHJcblxyXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xyXG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpe1xyXG4gICAgcHJvY2Vzcy5lbnYuTUFJTF9VUkw9XCJzbXRwOi8vbXlnbWFpbGFkZHJlc3MlNDBnbWFpbC5jb206bXlwYXNzd29yZEBzbXRwLmdtYWlsLmNvbTo0NjUvXCI7XHJcbiAgfVxyXG59KVxyXG5FbWFpbC5zZW5kKHtcclxuZnJvbTogXCJmcm9tQG1haWxpbmF0b3IuY29tXCIsXHJcbnRvOiBcImVsaXNhdmV0X2FyaUBob3RtYWlsLmNvLnVrXCIsXHJcbnN1YmplY3Q6IFwiU3ViamVjdFwiLFxyXG50ZXh0OiBcIkhlcmUgaXMgc29tZSB0ZXh0XCJcclxufSk7XHJcbiIsImltcG9ydCB7IFVzZXIgfSBmcm9tICcvaW1wb3J0cy9hcGkvdXNlci91c2VyLmpzJztcclxuXHJcbnZhciBBcGkgPSBuZXcgUmVzdGl2dXMoe1xyXG4gIHVzZURlZmF1bHRBdXRoOiBmYWxzZSxcclxuICBwcmV0dHlKc29uOiBmYWxzZSxcclxuICBlbmFibGVDb3JzIDogdHJ1ZVxyXG59KTtcclxuXHJcbkFwaS5hZGRSb3V0ZSgndGVzdCcsIHtcclxuICBnZXQgOiBmdW5jdGlvbihyZXEsIHJlcyl7XHJcbiAgICB2YXIgbmFtZSA9IHRoaXMuYm9keVBhcmFtcy5uYW1lO1xyXG4gICAgdmFyIG5hbWUxID0gVXNlci5maW5kT25lKHtuYW1lOm5hbWV9KTtcclxuICAgIHZhciB1c2VySWQgPSB0aGlzLnF1ZXJ5UGFyYW1zLnVzZXJJZDtcclxuICAgIHJldHVybiB7c3RhdHVzIDogXCJPS1wiLCBuYW1lOiB0aGlzLnF1ZXJ5UGFyYW1zLm5hbWV9O1xyXG4gIH1cclxufSk7XHJcbiIsImltcG9ydCAnL2ltcG9ydHMvYXBpL3VzZXIvdXNlci5qcyc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcvaW1wb3J0cy9hcGkvdXNlci91c2VyLmpzJztcclxuaW1wb3J0IHsgRW1haWwgfSBmcm9tICdtZXRlb3IvZW1haWwnO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG5Mb2dpbihuYW1lLHBhc3N3b3JkLGNvdW50cnkscGhvbmUsZW1haWwpe1xyXG4gIHZhciB1c2VyID0gVXNlci5maW5kT25lKHtcclxuICAgIG5hbWUgOiBuYW1lLFxyXG4gICAgcGFzc3dvcmQgOiBwYXNzd29yZCxcclxuICAgIHBob25lIDogcGhvbmUsXHJcbiAgICBlbWFpbCA6ZW1haWxcclxuICB9KTtcclxuICBpZiAodXNlcikgcmV0dXJuIHVzZXIuX2lkO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG59KTtcclxuIiwiaW1wb3J0IFwiL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXJcIjtcbmltcG9ydCBcIi9pbXBvcnRzL3N0YXJ0dXAvcmVzdFwiO1xuaW1wb3J0IFwiL2ltcG9ydHMvc3RhcnR1cC9lbWFpbFwiO1xuIl19
