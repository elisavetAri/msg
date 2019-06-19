import './main.html';
import { User } from '/imports/api/user/user.js';
import { ReactiveVar } from 'meteor/reactive-var';

 window.reactVar = new ReactiveVar(0);

Template.App_Main.onCreated(function(){
  var self = this;
  self.autorun(function() {
    Meteor.subscribe('users');
  });
});

Template.App_Main.helpers({
  textHelper(){
    return 'Hey YOU';
  },
  arrayHelper(){
    return ['this', 'is', 'just', 'for', 'test'];
  },
  getUsers(){
    return User.find();
  }
});

Template.App_Main.events({
  "click .smt"(){
    Meteor.call('user.insert','name','121323', function(error, result){
      console.log(result);
    });
  },
  "click .remove"(){
    Meteor.call('user.remove',this._id);
  },

  "click .update"(){
    var name = $("#input").value;
          Meteor.call('user.update',this._id,{name: input.name});
  }
});
