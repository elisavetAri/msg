import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const Video = new Mongo.Collection('video');

if (Meteor.isServer){
  Meteor.publish('video',function(){
    return Video.find();
  })
  }
Meteor.methods({
  "video.insert"(sid,rid,message,type){
    const uid = Video.insert({
      sid:sid,
      rid:rid,
      message:message,
      viewed : false,
      type:type,
      });
    return uid;
  },
  "video.remove"(videoId){
    return Video.remove(videoId);
  },
  "video.update"(videoId,update){
    return Video.update(videoId,{$set:update});
  }
});


// <td><label class="custom-control custom-checkbox select-custom">
//       <input type="checkbox" class="custom-control-input">
//       <span class="custom-control-indicator"></span>
//       <span class="custom-control-description"></span>
//     </label></td>
