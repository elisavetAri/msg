import '/imports/api/user/user.js';
import '/imports/api/messages/messages.js';
import '/imports/api/groupMessenger/groupMessage.js';

import { User } from '/imports/api/user/user.js';
import { Message } from '/imports/api/messages/messages.js';

Meteor.methods({
Login(name,password,country,phone,email){
  var user = User.findOne({
    name : name,
    password : password,
    phone : phone,
    email :email
  });
  if (user) return user._id;
  return false;
}
});
