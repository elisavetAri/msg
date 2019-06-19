import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const User = new Mongo.Collection('user');
if (Meteor.isServer){
  Meteor.publish('users',function(){
    return User.find();
  })
}

Meteor.methods({
  "user.insert"(name,lastName,password,phone,email){
    const uid = User.insert({
      name:name,
      lastName:lastName,
      password:password,
      phone : phone,
      email : email,
      created_at:moment().valueOf(),
      last_login:moment().valueOf()
    });
    return uid;
  },
  "user.remove"(userId){
    return User.remove(userId);
  },
  "user.update"(userId,update){
    return User.update(userId,{$set:update});
  },
  "user.changePassword"(userId,oldPassword,newPassword){
    var user = User.findOne({
      _id : userId,
      password : oldPassword
    });
    if (user) {
      return User.update(userId,{$set:{
        password:newPassword
      }});
    }
  }
});
