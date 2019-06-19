import './page.html';
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

Template.App_page2.onCreated(function(){
  var self = this;
  self.autorun(function() {
    Meteor.subscribe('users');
  })
  });

Template.App_page2.onRendered(function(){
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

Template.App_page2.helpers({
  getUsers(){
    var user_id = Session.get('u_l');
    if(!user_id) return [];
    var keywords = searchUser.get();
    var query = {
      _id : {$ne: user_id},
      name : new RegExp('.*'+keywords+'.*', 'i')
    };
    return User.find(query);
  }
});

Template.App_page2.events({
"click .send"(){
  var from = "from@mailinator.com";
  var subject = $(`#subject`).val();
  var text = $(`#ymsg`).val();
  var to = $(`#to`).val();
  Meteor.call('email.send',to,subject, text,function(err,result){
    if(!err){
      console.log(result);
    }
    else {
      console.log('there is an error');
    }
  });
},
  "click .remove"(){
    confirm("Delete this Record?");
    Meteor.call('user.remove',this._id);
  },

  "click .update"(){
    var name = $(`.input-${this._id}`).val();
    Meteor.call('user.update',this._id,{name :name});
  },

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
},
"click .save"(){
  var name =  $(`.namee`).val();
  var password =  $(`.passwordd`).val();
  var phone =  $(`.phone`).val();
  var email =  $(`.email`).val();
  Meteor.call('user.insert',name,password,phone,email,function(err,result){
    if(!err){
      console.log(result);
    }
    else {
      console.log('there is an error');
    }
  });
},
"change .custom-checkbox"(evt){
// TODO: event target trp children for loop foreach td innerHTML
//   const trp = evt.target.parentElement.parentElement.parentElement;
//   console.log(trp);
//   trp.forEach(function (td){
//   console.log(td);
//   console.log(td.innerHTML);
// });
}
});
