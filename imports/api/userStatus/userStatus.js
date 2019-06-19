import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const UserStatus = new Mongo.Collection('userStatus');

if (Meteor.isServer){
  Meteor.publish('userStatus',function(){
    return Message.find({ "status.online": true });
  })
}
Meteor.methods({
  "userStatus.insert"(_id,userId,ipAddr,userAgent,loginTime,idle){
    const uid = UserStatus.insert({
      _id:_id,
      userId:userId,
      ipAddr : ipAddr,
      userAgent : userAgent,
      loginTime:loginTime,
      idle: idle
    });
    return uid;
  }
});
