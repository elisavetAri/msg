import './messenger.html';
import { User } from '/imports/api/user/user.js';
import { Message } from '/imports/api/messages/messages.js';
import { Video } from '/imports/api/video/video.js';
import { GroupMessage } from '/imports/api/groupMessenger/groupMessage.js';
import { ReactiveVar } from 'meteor/reactive-var';

const selectedUser = new ReactiveVar(undefined);
const searchUser = new ReactiveVar("");

Template.App_messenger.onCreated(function(){
  var self = this;
  self.autorun(function() {
    Meteor.subscribe('users');
    Meteor.subscribe('messages');
    Meteor.subscribe('groupMessage');
  });
});
Template.App_messenger.helpers({
  getUsers(){
    var user_id = Session.get('u_l');
    if(!user_id) return [];
    var keywords = searchUser.get();
    var query = {
      _id : {$ne: user_id},
      name : new RegExp('.*'+keywords+'.*', 'i')
    };
    return User.find(query);
  },
  startup(){
    Status.setTemplate('semantic_ui')
  },

  getUserById(id){
    return User.findOne({_id : id});
  },
  getMessages(){
    var user_id = Session.get('u_l');
    if(!user_id) return [];
    var query = {
      $and : [
        {$or : [{sid : user_id}, {rid : user_id}]}
      ]
    };
    var _selected_user = selectedUser.get();
    if(_selected_user) _selected_user = _selected_user[0];
    if(!_selected_user){
      var fst = User.findOne({_id : {$ne: user_id}});
      if(fst) _selected_user= fst._id;
    }
    if(_selected_user) query.$and.push({$or : [{sid : _selected_user}, {rid : _selected_user}]});
    Meteor.setTimeout(function(){
      jQuery(".msg-wrap").stop().animate({scrollTop:jQuery(".msg-wrap")[0].scrollHeight}, 500, 'swing');
    }, 500);
    return Message.find(query);
  },
  getLines(message){
    return message.split('\n');
  },
  isFile(type){
    return type == "files";
  },
  isImage(message){
    return /.+(png|jpg|jpeg|gif)/ig.test(message);
  },

  viewMessage(rid, message_id, viewed){
    var user_id = Session.get('u_l');
    if(user_id === rid && !viewed){
      Meteor.call("message.update", message_id, {viewed : true}, function(){
        jQuery("#audio")[0].play();
        jQuery(".msg-wrap").stop().animate({scrollTop:jQuery(".msg-wrap")[0].scrollHeight}, 500, 'swing');
      })
    }
  },
  result(){
    return Collection.find({
      name : Session.get('name')
    })
  }
});

Template.App_messenger.events({
  "click #logout"(evt) {
    evt.preventDefault();
    Session.clear('u_l')
    return FlowRouter.go("/");
  },
  "click #send-message"(evt, template){
    evt.preventDefault();
    var selected_user_id = jQuery("#users").val();
    var group = false;

    if(selected_user_id.length>1){
      //multiple (group)
      var _group = GroupMessage.findOne({users : _.sortBy(selected_user_id).join("-")});
      if (_group) group = _group._id;
    }
    else selected_user_id = selected_user_id[0]; //single user message

    var message = jQuery("#message").val();
    var sender_id = Session.get('u_l');
    var upload = jQuery("#upload")[0].files;
    if(!sender_id ||!selected_user_id) return ;
    var update = jQuery("#send-message").attr('update');
    if(update && update!=""){
      Meteor.call("message.update", update, {message:message});
    }
    else{
      var type = "text";
      if(upload.length){
        type = "files";
        message = [];
        Array.from(upload).forEach(function(file){
          uploadFile(file);
          message.push(file.name);
        });
        message = message.join(";");
      }
      if(group){
        selected_user_id.forEach(function(uid){
          Meteor.call("message.insert", sender_id, uid, message, type, group);
        });
      }
      else Meteor.call("message.insert", sender_id, selected_user_id, message,type, false);
    }
    jQuery("#message").val('');
    jQuery("#send-message").text('Send');
    jQuery("#send-message").removeAttr('update');
  },
  "click .remove"(){
    Meteor.call('message.remove',this._id);
  },
  "change #users"(evt){
      selectedUser.set(jQuery("#users").val());
  },
  "keyup #message"(evt){
    if (!evt.enterKey && (evt.keyCode === 13 || evt.which === 13)){
      jQuery("#send-message").click();
      evt.preventDefault();
    }
  },
  "keyup #search"(evt){
    if (!evt.shiftKey && (evt.keyCode === 13 || evt.which === 13)){
      jQuery("#submit").click();
      evt.preventDefault();
    }
  },
    "click .update"(){
    jQuery("#message").val(this.message);
    jQuery("#send-message").text('Update');
    jQuery("#send-message").attr('update', this._id);
  },
  "click .submit"(){
    searchUser.set(jQuery(".search").val());
  }
});

function uploadFile(file){
  var formData = new FormData();
  formData.append("file", file, file.name);
  jQuery.ajax({
    type: "POST",
    url:"http://172.16.1.143:3333/upload",
    success: function (data) {
    jQuery("#upload[type=file]").val("");
    },
    error: function (error) {},
    async: true,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
  });
}

// var session = {
//   audio: true,
//   video: true
// };
//
// navigator.getUserMedia = ( navigator.getUserMedia    || navigator.webkitGetUserMedia ||
//                        navigator.mozGetUserMedia ||navigator.msGetUserMedia);
// var aCtx;
// var analyser;
// var microphone;
// if (navigator.getUserMedia) {
//     navigator.getUserMedia({audio: true}, function(stream) {
//         aCtx = new AudioContext();
//         analyser = aCtx.createAnalyser();
//         microphone = aCtx.createMediaStreamSource(stream);
//         microphone.connect(analyser);
//         analyser.connect(aCtx.destination);
//     }, function (){console.warn("Error getting audio stream from getUserMedia")});
// };
//
// recordRTC.stopRecording(function(audioURL) {
//   var formData = new FormData();
//   formData.append('edition[audio]', recordRTC.getBlob())
//   $.ajax({
//     type: 'POST',
//     url: 'http://172.16.1.143:3333/video',
//     data: formData,
//     contentType: false,
//     cache: false,
//     processData: false,
//   })
// });


// function onVideoFail(e) {
//     console.log('webcam fail!', e);
//   };
//
// function hasGetUserMedia() {
//   // Note: Opera is unprefixed.
//   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
//             navigator.mozGetUserMedia || navigator.msGetUserMedia);
// }
//
// if (hasGetUserMedia()) {
//   // Good to go!
// } else {
//   alert('getUserMedia() is not supported in your browser');
// }
//
// window.URL = window.URL || window.webkitURL;
// navigator.getUserMedia  = navigator.getUserMedia ||
//                          navigator.webkitGetUserMedia ||
//                           navigator.mozGetUserMedia ||
//                            navigator.msGetUserMedia;
//
// var video = document.querySelector('video');
// var streamRecorder;
// var webcamstream;
//
// if (navigator.getUserMedia) {
//   navigator.getUserMedia({audio: true, video: true}, function(stream) {
//     // video.src = window.URL.createObjectURL(stream);
//     video.srcObject = stream;
//     webcamstream = stream;
//     streamrecorder = webcamstream.record();
//   }, onVideoFail);
// } else {
//     alert ('failed');
// }
//
// function startRecording() {
//     streamRecorder = webcamstream.record();
//     setTimeout(stopRecording, 60000);
// }
// function stopRecording() {
//     streamRecorder.getRecordedData(postVideoToServer);
// }
// function postVideoToServer(videoblob) {
//
//     var data = {};
//     data.video = videoblob;
//     data.metadata = 'test metadata';
//     data.action = "upload_video";
//     jQuery.post("http://172.16.1.143:3333/video", data, onUploadSuccess);
// }
// function onUploadSuccess() {
//     alert ('video uploaded');
// }
