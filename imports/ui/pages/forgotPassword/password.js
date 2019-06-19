import './password.html';
import { User } from '/imports/api/user/user.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';
import dataTablesBootstrap from 'datatables.net-bs';
import './dataTables.bootstrap4.min.js';
import './dataTables.foundation.min.js';
import './dataTables.jqueryui.min.js';
import './dataTables.semanticui.min.js';
import './jquery.dataTables.min.js';


const searchUser = new ReactiveVar("");

Template.App_password.onCreated(function(){
  var self = this;
  self.autorun(function() {
    Meteor.subscribe('users');
  })
  });
  Template.App_password.onRendered(function(){
    Meteor.setTimeout(function(){
      $(document).ready(function() {
          $('table').DataTable( {
              "order": [[ 3, "desc" ]]
          } );
      } );
      $(function () {
        $('#table').on('click', 'th', function () {
          var index = $(this).index(),
          rows = [],
          thClass = $(this).hasClass('asc') ? 'desc' : 'asc';

          $('#table th').removeClass('asc desc');
          $(this).addClass(thClass);

          $('#table tbody tr').each(function (index, row) {
            rows.push($(row).detach());
          });

          rows.sort(function (a, b) {
            var aValue = $(a).find('td').eq(index).text(),
            bValue = $(b).find('td').eq(index).text();

            return aValue > bValue ?
            1 :
            aValue < bValue ?
            -1 :
            0;
          });

          if ($(this).hasClass('desc')) {
            rows.reverse();
          }

          $.each(rows, function (index, row) {
            $('#table tbody').append(row);
          });
        });
      });
    },400);
  });
Template.App_password.helpers({
  getUsers(){
    return User.find();
  }
});
Template.App_password.events({
  "click .changEPassword"(){
     var newPassword =  $(`.passwords-${this._id}`).val();
     Meteor.call('user.changePassword',this._id,this.password,newPassword, function(err,result){
     if(!err){
       console.log('Your password is change');
     }
     else {
       console.log('there is an error');
     }
   })
 },
 "click .update"(){
   var name = $(`.input-${this._id}`).val();
   Meteor.call('user.update',this._id,{name :name});
 },
 "click .lname"(){
   var lastName = $(`.lsname-${this._id}`).val();
   Meteor.call('user.update',this._id,{lastName:lastName});
 },
 "click .changephone"(){
   var phone =  $(`.phone-${this._id}`).val();
   Meteor.call('user.update',this._id,{phone:phone});
 },
 "click .changeemail"(){
   var email =  $(`.emails-${this._id}`).val();
   Meteor.call('user.update',this._id,{email:email});
 },
 "click #logout"(evt) {
   evt.preventDefault();
   Session.clear('u_l')
   return FlowRouter.go("/");
 }
})
