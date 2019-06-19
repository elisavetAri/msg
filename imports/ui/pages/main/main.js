import './main.html';
import { User } from '/imports/api/user/user.js';
import { ReactiveVar } from 'meteor/reactive-var';

window.reactVar = new ReactiveVar(0);

Template.App_Main.onCreated(function(){
  var self = this;
});

Template.App_Main.helpers({
  isLoggedIn(){
    return Session.get('u_l');
  }
});

Template.App_Main.events({
  "click .login"(evt, template){
    var name = jQuery("#username").val();
    var password = jQuery("#password").val();
    Meteor.call('Login',name, password, function(error, response){
      console.log(error,response);
      if(!error && response){
        Session.setPersistent("u_l", response);
      }
    })
  },
  "click .save"(){
    var name =  $(`.namee`).val();
    var lsname =  $(`.lsname`).val();
    var password =  $(`.passwordd`).val();
    var phone =  $(`.phone`).val();
    var email =  $(`.email`).val();
    Meteor.call('user.insert',name,lsname,password,phone,email,function(err,result){
      if(!err){
        console.log(result);
      }
      else {
        console.log('there is an error');
      }
    });
  },
  "click .forgotPassword"(){

  }
});
