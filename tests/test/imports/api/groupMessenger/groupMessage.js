import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const GroupMessage = new Mongo.Collection('groupMessage');

if (Meteor.isServer){
  Meteor.publish('groupMessage',function(){
    return GroupMessage.find();
  })
}

Meteor.methods({
  "groupMessage.insert"(name,users){
    const uid = GroupMessage.insert({
      name:name,
      users : users,
      options : {},
      created_at:moment().valueOf()
    });
    return uid;
  }
});
