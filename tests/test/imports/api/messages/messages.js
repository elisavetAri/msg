import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const Message = new Mongo.Collection('message');
if (Meteor.isServer){
  Meteor.publish('messages',function(){
    return Message.find();
  })
}

Meteor.methods({
  "message.insert"(sid,rid,message,type,group){
    const uid = Message.insert({
      sid:sid,
      rid:rid,
      group:group,
      message : message,
      viewed : false,
      type:type,
      // last_login:moment().valueOf(),
      created_at:moment().valueOf()
    });
    return uid;
  },
  "message.remove"(messageId){
    return Message.remove(messageId);
  },
  "message.update"(messageId,update){
    return Message.update(messageId,{$set:update});
  }
});
