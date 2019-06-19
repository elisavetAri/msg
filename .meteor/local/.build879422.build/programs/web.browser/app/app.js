var require = meteorInstall({"imports":{"ui":{"layout":{"body":{"body.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/layout/body/body.html                                                                            //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("./template.body.js", { "*": "*+" });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.body.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/layout/body/template.body.js                                                                     //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //

Template.__checkName("App_Body");
Template["App_Body"] = new Template("Template.App_Body", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      template: Spacebars.call(view.lookup("Body"))
    };
  }, function() {
    return Spacebars.include(function() {
      return Spacebars.call(Template.__dynamic);
    });
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"body.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/layout/body/body.js                                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("./body.html");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"pages":{"messenger":{"messenger.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/pages/messenger/messenger.html                                                                   //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("./template.messenger.js", { "*": "*+" });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.messenger.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/pages/messenger/template.messenger.js                                                            //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //

Template.__checkName("App_messenger");
Template["App_messenger"] = new Template("Template.App_messenger", (function() {
  var view = this;
  return [ HTML.DIV({
    class: "container",
    style: "background-image:url('/images/tele.jpg')"
  }, "\n  ", HTML.STYLE("\n  #grad1 {\n    width: 180px;\n    height: 180px;\n    background-image:\nlinear-gradient(to top, transparent, teal),\nlinear-gradient(to right, green, aqua,#F8FFAE );\n    background-size: 100% 100%, 2000% 100%;\n    animation: move 5s infinite;\n}\n\n@keyframes move {\n from {background-position: center center, left center;}\n to {background-position: center center, right center;}\n}\n  "), "\n  ", HTML.DIV({
    class: "form-group",
    style: "background-image:url('/images/tele.jpg')"
  }, "\n    ", HTML.Raw('<span class="navbar-toggler-icon"></span>'), "\n      ", HTML.Raw('<label for="exampleFormControlSelect2">Open New Chat</label>'), "\n      ", HTML.DIV({
    class: "mess",
    id: "sidenav"
  }, "\n      ", HTML.SELECT({
    class: "users bg-dark p-4s text-white navbar navbar-dark bg-dark float-left",
    size: "20",
    id: "users"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("getUsers"));
  }, function() {
    return [ "\n        ", HTML.OPTION({
      class: "text-white",
      value: function() {
        return Spacebars.mustache(view.lookup("_id"));
      },
      style: "background-color:#43C6AC"
    }, "Chat with ", Blaze.View("lookup:name", function() {
      return Spacebars.mustache(view.lookup("name"));
    })), "\n      " ];
  }), "\n     "), "\n    "), "\n  "), "\n  ", HTML.DIV({
    class: "text text-r pt-3",
    style: "background-image:url('/images/tele.jpg')"
  }, "\n    ", HTML.DIV({
    class: "row msg-wrap",
    style: "height:443px; overflow:auto;"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("getMessages"));
  }, function() {
    return [ "\n      ", HTML.DIV({
      class: "col-10 mb-3"
    }, "\n      ", Blaze.Let({
      sender: function() {
        return Spacebars.call(Spacebars.dataMustache(view.lookup("getUserById"), view.lookup("sid")));
      },
      receiver: function() {
        return Spacebars.call(Spacebars.dataMustache(view.lookup("getUserById"), view.lookup("rid")));
      }
    }, function() {
      return [ "\n      ", Blaze.View("lookup:viewMessage", function() {
        return Spacebars.mustache(view.lookup("viewMessage"), Spacebars.dot(view.lookup("receiver"), "_id"), view.lookup("_id"), view.lookup("viewed"));
      }), "\n        ", HTML.DIV({
        class: function() {
          return [ "card text-white purple-gradient color-block mx-auto z-depth-1 align-items-stretch ", Blaze.If(function() {
            return Spacebars.dataMustache(view.lookup("isMe"), Spacebars.dot(view.lookup("sender"), "_id"));
          }, function() {
            return "float-right ";
          }, function() {
            return "float-sm-left";
          }) ];
        },
        style: "position:relative",
        value: ""
      }, "\n          ", HTML.SPAN({
        class: "remove",
        style: "position: absolute; right: 3px; top: 8px; color: red; line-height: 0; cursor:pointer"
      }, "×"), "\n          ", HTML.DIV({
        class: "card-body",
        id: "grad1"
      }, "\n            ", HTML.SPAN({
        class: "time-left"
      }, Blaze.View("lookup:sender.name", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("sender"), "name"));
      })), " to ", HTML.SPAN({
        class: "right"
      }, " ", Blaze.View("lookup:receiver.name", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("receiver"), "name"));
      })), " ", HTML.BR(), "\n            ", HTML.SPAN({
        class: ""
      }, "\n              ", HTML.SMALL("\n              ", Blaze.View("lookup:parseDate", function() {
        return Spacebars.mustache(view.lookup("parseDate"), view.lookup("created_at"));
      }), "\n              "), "\n              ", Blaze.Each(function() {
        return Spacebars.dataMustache(view.lookup("getLines"), view.lookup("message"));
      }, function() {
        return [ "\n                ", HTML.BR(), "\n                ", Blaze.View("lookup:.", function() {
          return Spacebars.mustache(view.lookup("."));
        }), "\n              " ];
      }), "\n            "), "\n              ", HTML.BR(), "\n              ", HTML.BUTTON({
        class: "update",
        id: "update",
        type: "button",
        style: "margin-right:10px"
      }, HTML.I({
        class: "fa fa-pencil",
        value: function() {
          return Spacebars.mustache(view.lookup("message"));
        }
      })), "\n          "), "\n        "), "\n      " ];
    }), "\n      "), "\n      " ];
  }), "\n    "), "\n  "), "\n  ", HTML.DIV({
    class: "form-group"
  }, "\n    ", HTML.TEXTAREA({
    "data-meteor-emoji": "true",
    class: "text-white message form-control",
    id: "message",
    width: "15px;",
    height: "15px;",
    rows: "4",
    cols: "20",
    style: "background-image:url('/images/tele.jpg')",
    placeholder: "Write a message..."
  }), "\n      ", HTML.Raw('<button type="button" name="button" id="send-message" class="messenger btn btn-priamry">Send</button>'), "\n   "), "\n   ", HTML.SCRIPT("\n     (() => {\n       new MeteorEmoji()\n     })()\n   "), "\n  "), HTML.Raw('\n  <audio id="audio" preload="auto" tabindex="0" controls="controls" type="audio/mpeg" src="/bicycle_bell_07.mp3" style="display:none"></audio>') ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"messenger.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/pages/messenger/messenger.js                                                                     //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("./messenger.html");
let User;
module.link("/imports/api/user/user.js", {
  User(v) {
    User = v;
  }

}, 0);
let Message;
module.link("/imports/api/messages/messages.js", {
  Message(v) {
    Message = v;
  }

}, 1);
let ReactiveVar;
module.link("meteor/reactive-var", {
  ReactiveVar(v) {
    ReactiveVar = v;
  }

}, 2);
const selectedUser = new ReactiveVar(undefined);
Template.App_messenger.onCreated(function () {
  var self = this;
  self.autorun(function () {
    Meteor.subscribe('users');
    Meteor.subscribe('messages');
  });
});
Template.App_messenger.helpers({
  getUsers() {
    var user_id = Session.get('u_l');
    if (!user_id) return [];
    return User.find({
      _id: {
        $ne: user_id
      }
    });
  },

  getUserById(id) {
    return User.findOne({
      _id: id
    });
  },

  getMessages() {
    var user_id = Session.get('u_l');
    if (!user_id) return [];
    var query = {
      $and: [{
        $or: [{
          sid: user_id
        }, {
          rid: user_id
        }]
      }]
    };

    var _selected_user = selectedUser.get();

    if (!_selected_user) {
      var fst = User.findOne({
        _id: {
          $ne: user_id
        }
      });
      if (fst) _selected_user = fst._id;
    }

    if (_selected_user) query.$and.push({
      $or: [{
        sid: _selected_user
      }, {
        rid: _selected_user
      }]
    });
    Meteor.setTimeout(function () {
      jQuery(".msg-wrap").stop().animate({
        scrollTop: jQuery(".msg-wrap")[0].scrollHeight
      }, 500, 'swing');
    }, 500);
    return Message.find(query);
  },

  getLines(message) {
    return message.split('\n');
  },

  viewMessage(rid, message_id, viewed) {
    var user_id = Session.get('u_l');

    if (user_id === rid && !viewed) {
      Meteor.call("message.update", message_id, {
        viewed: true
      }, function () {
        jQuery("#audio")[0].play();
        jQuery(".msg-wrap").stop().animate({
          scrollTop: jQuery(".msg-wrap")[0].scrollHeight
        }, 500, 'swing');
      });
    }
  }

});
Template.App_messenger.events({
  "click #send-message"(evt, template) {
    evt.preventDefault();
    var selected_user_id = jQuery("#users").val();
    var message = jQuery("#message").val();
    var sender_id = Session.get('u_l');
    if (!sender_id || !selected_user_id || !message) return;
    Meteor.call("message.insert", sender_id, selected_user_id, message);
    jQuery("#message").val('');
  },

  "click .remove"() {
    Meteor.call('message.remove', this._id);
  },

  "change #users"() {
    selectedUser.set(jQuery("#users").val());
  },

  "keyup #message"(evt) {
    console.log(evt);

    if (!evt.shiftKey && (evt.keyCode === 13 || evt.which === 13)) {
      jQuery("#send-message").click();
      evt.preventDefault();
    }
  },

  "click #update"() {
    var message = jQuery("#send-message").val();
    Meteor.call('message.update', message);
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"page2":{"page2.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/pages/page2/page2.html                                                                           //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("./template.page2.js", { "*": "*+" });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.page2.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/pages/page2/template.page2.js                                                                    //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //

Template.__checkName("App_page2");
Template["App_page2"] = new Template("Template.App_page2", (function() {
  var view = this;
  return [ HTML.H4(Blaze.View("lookup:reactiveVarHelper", function() {
    return Spacebars.mustache(view.lookup("reactiveVarHelper"));
  })), "\n", HTML.TABLE({
    class: "table"
  }, "\n  ", HTML.THEAD({
    class: "thead-dark"
  }, "\n    ", HTML.TR("\n      ", HTML.TH({
    scope: "col"
  }, "Id"), "\n      ", HTML.TH({
    scope: "col"
  }, "Name"), "\n      ", HTML.TH({
    scope: "col"
  }, "password"), "\n      ", HTML.TH({
    scope: "col"
  }, "Phone"), "\n      ", HTML.TH({
    scope: "col"
  }, "Email"), "\n      ", HTML.TH({
    scope: "col"
  }, "Update Name"), "\n      ", HTML.TH(HTML.A({
    href: ""
  }, "Home")), "\n    "), "\n  "), "\n  ", HTML.TBODY("\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("getUsers"));
  }, function() {
    return [ "\n    ", HTML.TR("\n      ", HTML.TD(Blaze.View("lookup:_id", function() {
      return Spacebars.mustache(view.lookup("_id"));
    })), "\n      ", HTML.TD(Blaze.View("lookup:name", function() {
      return Spacebars.mustache(view.lookup("name"));
    })), "\n      ", HTML.TD(Blaze.View("lookup:password", function() {
      return Spacebars.mustache(view.lookup("password"));
    })), "\n      ", HTML.TD(Blaze.View("lookup:phone", function() {
      return Spacebars.mustache(view.lookup("phone"));
    })), "\n      ", HTML.TD(Blaze.View("lookup:email", function() {
      return Spacebars.mustache(view.lookup("email"));
    })), "\n      ", HTML.TD("\n          ", HTML.INPUT({
      name: "input",
      id: "input",
      style: "width: 100px",
      class: function() {
        return [ "input-", Spacebars.mustache(view.lookup("_id")) ];
      },
      value: function() {
        return Spacebars.mustache(view.lookup("name"));
      }
    }), "\n          ", HTML.BUTTON({
      type: "button",
      name: "update",
      class: "update btn btn-secondary",
      for: "input"
    }, "Change Name"), "\n          ", HTML.INPUT({
      name: "passwords",
      id: "passwords",
      style: "width: 100px",
      class: function() {
        return [ "passwords-", Spacebars.mustache(view.lookup("_id")) ];
      },
      value: function() {
        return Spacebars.mustache(view.lookup("password"));
      }
    }), "\n          ", HTML.BUTTON({
      class: "changEPassword  btn btn-secondary",
      "data-position": "left",
      "data-tooltip": "changEPassword",
      for: "password"
    }, "Change Password"), "\n          ", HTML.INPUT({
      name: "phone",
      id: "phone",
      style: "width: 100px",
      class: function() {
        return [ "phone-", Spacebars.mustache(view.lookup("_id")) ];
      },
      value: function() {
        return Spacebars.mustache(view.lookup("phone"));
      }
    }), "\n          ", HTML.BUTTON({
      class: "changephone btn btn-secondary",
      "data-position": "left",
      "data-tooltip": "changephone",
      for: "phone"
    }, "Change Phone"), "\n          ", HTML.INPUT({
      name: "emails",
      type: "email",
      style: "width: 100px",
      id: "emails",
      class: function() {
        return [ "emails-", Spacebars.mustache(view.lookup("_id")) ];
      },
      value: function() {
        return Spacebars.mustache(view.lookup("email"));
      }
    }), "\n          ", HTML.BUTTON({
      type: "email",
      class: "changeemail btn btn-secondary",
      "data-position": "left",
      "data-tooltip": "changeemail",
      for: "emails"
    }, "Change Email"), "\n          ", HTML.BUTTON({
      class: "remove btn btn-warning",
      "data-position": "bottom",
      "data-tooltip": "Remove Record"
    }, "Remove"), "\n      "), "\n    "), "\n    " ];
  }), "\n  ", HTML.Comment(" Button trigger modal "), "\n", HTML.BUTTON({
    type: "button",
    class: "btn btn-primary",
    "data-toggle": "modal",
    "data-target": "#exampleModalLong"
  }, "Add More"), "\n", HTML.Comment(" Modal "), "\n", HTML.DIV({
    class: "addMore modal fade",
    id: "exampleModalLong",
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "exampleModalLongTitle",
    "aria-hidden": "true"
  }, "\n  ", HTML.DIV({
    class: "modal-dialog",
    role: "document"
  }, "\n    ", HTML.DIV({
    class: "modal-content"
  }, "\n      ", HTML.DIV({
    class: "modal-header"
  }, "\n        ", HTML.H5({
    class: "modal-title",
    id: "exampleModalLongTitle"
  }, "Add More User"), "\n        ", HTML.BUTTON({
    type: "button",
    class: "close",
    "data-dismiss": "modal",
    "aria-label": "Close"
  }, "\n          ", HTML.SPAN({
    "aria-hidden": "true"
  }, HTML.CharRef({
    html: "&times;",
    str: "×"
  })), "\n        "), "\n      "), "\n      ", HTML.DIV({
    class: "modal-body"
  }, "\n", HTML.FORM("\n  ", HTML.DIV({
    class: "form-group"
  }, "\n    ", HTML.LABEL("Your name"), "\n    ", HTML.INPUT({
    type: "text",
    class: "namee form-control",
    id: "namee",
    "aria-describedby": "namee",
    placeholder: "Enter your name"
  }), "\n  "), "\n  ", HTML.DIV({
    class: "form-group"
  }, "\n    ", HTML.LABEL("Email address"), "\n    ", HTML.INPUT({
    type: "email",
    class: "email form-control",
    id: "email",
    "aria-describedby": "email",
    placeholder: "Enter your email"
  }), "\n  "), "\n  ", HTML.DIV({
    class: "form-group"
  }, "\n    ", HTML.LABEL({
    for: "phone"
  }, "Phone"), "\n    ", HTML.INPUT({
    type: "number",
    class: "phone form-control",
    id: "phone",
    "aria-describedby": "phone",
    placeholder: "Enter your phone"
  }), "\n  "), "\n  ", HTML.DIV({
    class: "form-group"
  }, "\n    ", HTML.LABEL("Password"), "\n    ", HTML.INPUT({
    type: "password",
    class: "passwordd form-control",
    id: "exampleInputPassword1",
    placeholder: "Password"
  }), "\n  "), "\n"), "\n      "), "\n      ", HTML.DIV({
    class: "modal-footer"
  }, "\n        ", HTML.BUTTON({
    type: "button",
    class: "btn btn-secondary",
    "data-dismiss": "modal"
  }, "Close"), "\n        ", HTML.BUTTON({
    type: "button",
    class: "save btn btn-primary"
  }, "Save changes"), "\n      "), "\n    "), "\n  "), "\n"), "\n", HTML.DIV({
    class: "modal fade",
    id: "modalContactForm",
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "myModalLabel",
    "aria-hidden": "true"
  }, "\n  ", HTML.DIV({
    class: "modal-dialog",
    role: "document"
  }, "\n    ", HTML.DIV({
    class: "modal-content"
  }, "\n      ", HTML.DIV({
    class: "modal-header text-center"
  }, "\n        ", HTML.H4({
    class: "modal-title w-100 font-weight-bold"
  }, "Text Your Email"), "\n        ", HTML.BUTTON({
    type: "button",
    class: "close",
    "data-dismiss": "modal",
    "aria-label": "Close"
  }, "\n          ", HTML.SPAN({
    "aria-hidden": "true"
  }, HTML.CharRef({
    html: "&times;",
    str: "×"
  })), "\n        "), "\n      "), "\n      ", HTML.DIV({
    class: "modal-body mx-3"
  }, "\n        ", HTML.DIV({
    class: "md-form mb-5"
  }, "\n          ", HTML.I({
    class: "fas fa-envelope prefix grey-text"
  }), "\n          ", HTML.INPUT({
    type: "email",
    id: "to",
    class: "to form-control validate"
  }), "\n          ", HTML.LABEL({
    "data-error": "wrong",
    "data-success": "right",
    for: "to"
  }, "To"), "\n        "), "\n\n        ", HTML.DIV({
    class: "md-form mb-5"
  }, "\n          ", HTML.I({
    class: "fas fa-tag prefix grey-text"
  }), "\n          ", HTML.INPUT({
    type: "text",
    id: "subject",
    class: "subject form-control validate"
  }), "\n          ", HTML.LABEL({
    "data-error": "wrong",
    "data-success": "right",
    for: "subject"
  }, "Subject"), "\n        "), "\n\n        ", HTML.DIV({
    class: "md-form"
  }, "\n          ", HTML.I({
    class: "fas fa-pencil prefix grey-text"
  }), "\n          ", HTML.TEXTAREA({
    type: "text",
    id: "ymsg",
    class: "ymsg md-textarea form-control",
    rows: "4"
  }), "\n          ", HTML.LABEL({
    "data-error": "wrong",
    "data-success": "right",
    for: "ymsg"
  }, "Your message"), "\n        "), "\n\n      "), "\n      ", HTML.DIV({
    class: "modal-footer d-flex justify-content-center"
  }, "\n        ", HTML.BUTTON({
    class: "send btn btn-unique",
    id: "send",
    "data-dismiss": "modal"
  }, "Send"), "\n      "), "\n    "), "\n  "), "\n"), "\n", HTML.BUTTON({
    type: "button",
    name: "sendEmail",
    class: "sendEmail btn btn-primary",
    "data-toggle": "modal",
    "data-target": "#modalContactForm"
  }, "Send Email"), "\n"), "\n") ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"page2.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/pages/page2/page2.js                                                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("./page2.html");
let User;
module.link("/imports/api/user/user.js", {
  User(v) {
    User = v;
  }

}, 0);
let ReactiveVar;
module.link("meteor/reactive-var", {
  ReactiveVar(v) {
    ReactiveVar = v;
  }

}, 1);
window.reactVar = new ReactiveVar(0);
Template.App_page2.onCreated(function () {
  var self = this;
  self.autorun(function () {
    Meteor.subscribe('users');
  });
});
Template.App_page2.helpers({
  getUsers() {
    return User.find();
  }

});
Template.App_page2.events({
  "click .send"() {
    var from = "from@mailinator.com";
    var subject = $("#subject").val();
    var text = $("#ymsg").val();
    var to = $("#to").val();
    Meteor.call('email.send', to, subject, text, function (err, result) {
      if (!err) {
        console.log(result);
      } else {
        console.log('there is an error');
      }
    });
  },

  "click .remove"() {
    Meteor.call('user.remove', this._id);
  },

  "click .update"() {
    var name = $(".input-".concat(this._id)).val();
    Meteor.call('user.update', this._id, {
      name: name
    });
  },

  "click .changEPassword"() {
    var newPassword = $(".passwords-".concat(this._id)).val();
    Meteor.call('user.changePassword', this._id, this.password, newPassword, function (err, result) {
      if (!err) {
        console.log('Your password is change');
      } else {
        console.log('there is an error');
      }
    });
  },

  "click .changephone"() {
    var phone = $(".phone-".concat(this._id)).val();
    Meteor.call('user.update', this._id, {
      phone: phone
    });
  },

  "click .changeemail"() {
    var email = $(".emails-".concat(this._id)).val();
    Meteor.call('user.update', this._id, {
      email: email
    });
  },

  "click .save"() {
    var name = $(".namee").val();
    var password = $(".passwordd").val();
    var phone = $(".phone").val();
    var email = $(".email").val();
    Meteor.call('user.insert', name, password, phone, email, function (err, result) {
      if (!err) {
        console.log(result);
      } else {
        console.log('there is an error');
      }
    });
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"main":{"main.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/pages/main/main.html                                                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("./template.main.js", { "*": "*+" });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.main.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/pages/main/template.main.js                                                                      //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //

Template.__checkName("App_Main");
Template["App_Main"] = new Template("Template.App_Main", (function() {
  var view = this;
  return Blaze.Unless(function() {
    return Spacebars.call(view.lookup("isLoggedIn"));
  }, function() {
    return [ "\n  ", HTML.H4(Blaze.View("lookup:reactiveVarHelper", function() {
      return Spacebars.mustache(view.lookup("reactiveVarHelper"));
    })), "\n  ", HTML.DIV({
      class: "login-form"
    }, "\n    ", HTML.H2({
      class: "text-center"
    }, "Log in"), "\n    ", HTML.DIV({
      class: "form-group"
    }, "\n        ", HTML.INPUT({
      type: "text",
      id: "username",
      class: "form-control",
      placeholder: "Username",
      required: "required"
    }), "\n    "), "\n    ", HTML.DIV({
      class: "form-group"
    }, "\n        ", HTML.INPUT({
      type: "password",
      id: "password",
      class: "form-control",
      placeholder: "Password",
      required: "required"
    }), "\n    "), "\n    ", HTML.DIV({
      class: "form-group"
    }, "\n        ", HTML.BUTTON({
      type: "submit",
      class: "login"
    }, "Log in"), "\n    "), "\n    ", HTML.DIV({
      class: "clearfix"
    }, "\n        ", HTML.LABEL({
      class: "pull-left checkbox-inline"
    }, HTML.INPUT({
      type: "checkbox"
    }), " Remember me"), "\n        ", HTML.A({
      href: "#",
      class: "pull-right"
    }, "Forgot Password?"), "\n    "), "\n    ", HTML.Comment(" Button trigger modal "), "\n  ", HTML.BUTTON({
      type: "button",
      class: "btn btn-primary btn-block",
      "data-toggle": "modal",
      "data-target": "#exampleModalLong"
    }, "Sign Up"), "\n  "), "\n", HTML.Comment(" Modal "), "\n", HTML.DIV({
      class: "addMore modal fade",
      id: "exampleModalLong",
      tabindex: "-1",
      role: "dialog",
      "aria-labelledby": "exampleModalLongTitle",
      "aria-hidden": "true"
    }, "\n", HTML.DIV({
      class: "modal-dialog",
      role: "document"
    }, "\n  ", HTML.DIV({
      class: "modal-content"
    }, "\n    ", HTML.DIV({
      class: "modal-header"
    }, "\n      ", HTML.H5({
      class: "modal-title",
      id: "exampleModalLongTitle"
    }, "Sign Up"), "\n      ", HTML.BUTTON({
      type: "button",
      class: "close",
      "data-dismiss": "modal",
      "aria-label": "Close"
    }, "\n        ", HTML.SPAN({
      "aria-hidden": "true"
    }, HTML.CharRef({
      html: "&times;",
      str: "×"
    })), "\n      "), "\n    "), "\n    ", HTML.DIV({
      class: "modal-body"
    }, "\n", HTML.FORM("\n", HTML.DIV({
      class: "form-group"
    }, "\n  ", HTML.LABEL("Your name"), "\n  ", HTML.INPUT({
      type: "text",
      class: "namee form-control",
      id: "namee",
      "aria-describedby": "namee",
      placeholder: "Enter your name"
    }), "\n"), "\n", HTML.DIV({
      class: "form-group"
    }, "\n  ", HTML.LABEL("Email address"), "\n  ", HTML.INPUT({
      type: "email",
      class: "email form-control",
      id: "email",
      "aria-describedby": "email",
      placeholder: "Enter your email"
    }), "\n"), "\n", HTML.DIV({
      class: "form-group"
    }, "\n  ", HTML.LABEL({
      for: "phone"
    }, "Phone"), "\n  ", HTML.INPUT({
      type: "tel",
      class: "phone form-control",
      id: "phone",
      "aria-describedby": "phone",
      placeholder: "Enter your phone"
    }), "\n"), "\n", HTML.DIV({
      class: "form-group"
    }, "\n  ", HTML.LABEL("Password"), "\n  ", HTML.INPUT({
      type: "password",
      class: "passwordd form-control",
      id: "exampleInputPassword1",
      placeholder: "Password"
    }), "\n"), "\n"), "\n    "), "\n    ", HTML.DIV({
      class: "modal-footer"
    }, "\n      ", HTML.BUTTON({
      type: "button",
      class: "save btn btn-primary",
      "data-dismiss": "modal"
    }, "Save changes"), "\n    "), "\n  "), "\n"), "\n"), "\n" ];
  }, function() {
    return [ "\n  ", Spacebars.include(view.lookupTemplate("App_page2")), "\n" ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/ui/pages/main/main.js                                                                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("./main.html");
let User;
module.link("/imports/api/user/user.js", {
  User(v) {
    User = v;
  }

}, 0);
let ReactiveVar;
module.link("meteor/reactive-var", {
  ReactiveVar(v) {
    ReactiveVar = v;
  }

}, 1);
window.reactVar = new ReactiveVar(0);
Template.App_Main.onCreated(function () {
  var self = this;
});
Template.App_Main.helpers({
  isLoggedIn() {
    return Session.get('u_l');
  }

});
Template.App_Main.events({
  "click .login"(evt, template) {
    var name = jQuery("#username").val();
    var password = jQuery("#password").val();
    Meteor.call('Login', name, password, function (error, response) {
      console.log(error, response);

      if (!error && response) {
        Session.setPersistent("u_l", response);
      }
    });
  },

  "click .save"() {
    var name = $(".namee").val();
    var password = $(".passwordd").val();
    var phone = $(".phone").val();
    var email = $(".email").val();
    Meteor.call('user.insert', name, password, phone, email, function (err, result) {
      if (!err) {
        console.log(result);
      } else {
        console.log('there is an error');
      }
    });
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"api":{"messages":{"messages.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/api/messages/messages.js                                                                            //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  Message: () => Message
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const Message = new Mongo.Collection('message');

if (Meteor.isServer) {
  Meteor.publish('messages', function () {
    return Message.find();
  });
}

Meteor.methods({
  "message.insert"(sid, rid, message) {
    const uid = Message.insert({
      sid: sid,
      rid: rid,
      message: message,
      viewed: false,
      created_at: moment().valueOf()
    });
    return uid;
  },

  "message.remove"(messageId) {
    return Message.remove(messageId);
  },

  "message.update"(messageId, update) {
    return Message.update(messageId, {
      $set: update
    });
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user":{"user.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/api/user/user.js                                                                                    //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  User: () => User
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const User = new Mongo.Collection('user');

if (Meteor.isServer) {
  Meteor.publish('users', function () {
    return User.find();
  });
}

Meteor.methods({
  "user.insert"(name, password, phone, email) {
    const uid = User.insert({
      name: name,
      password: password,
      phone: phone,
      email: email,
      created_at: moment().valueOf()
    });
    return uid;
  },

  "user.remove"(userId) {
    return User.remove(userId);
  },

  "user.update"(userId, update) {
    return User.update(userId, {
      $set: update
    });
  },

  "user.changePassword"(userId, oldPassword, newPassword) {
    var user = User.findOne({
      _id: userId,
      password: oldPassword
    });

    if (user) {
      return User.update(userId, {
        $set: {
          password: newPassword
        }
      });
    }
  } // ,
  // "user.remove"(userId){
  //   return User.remove(userId);
  // }


});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"client":{"globalHelpers.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/startup/client/globalHelpers.js                                                                     //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Template.registerHelper("parseDate", function (timestamp) {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
});
Template.registerHelper("isMe", function (id) {
  return Session.get('u_l') == id;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/startup/client/index.js                                                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("./route.js");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"route.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// imports/startup/client/route.js                                                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("../../ui/layout/body/body.js");
module.link("../../ui/pages/main/main.js");
module.link("../../ui/pages/page2/page2.js");
module.link("../../ui/pages/messenger/messenger.js");
FlowRouter.route('/', {
  action: function () {
    BlazeLayout.render('App_Body', {
      Body: 'App_Main'
    });
  }
});
FlowRouter.route('/page2', {
  action: function () {
    BlazeLayout.render('App_Body', {
      Body: 'App_page2'
    });
  }
});
FlowRouter.route('/messenger', {
  action: function () {
    BlazeLayout.render('App_Body', {
      Body: 'App_messenger'
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"client":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// client/main.js                                                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("/imports/startup/client");
module.link("/imports/startup/client/globalHelpers.js");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".css"
  ]
});

var exports = require("/client/main.js");