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

}}},"pages":{"page2":{"page2.html":function(require,exports,module){

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
  }), "\n    ", HTML.Comment(" Button trigger modal "), "\n", HTML.BUTTON({
    type: "button",
    class: "btn btn-primary",
    "data-toggle": "modal",
    "data-target": "#exampleModalLong"
  }, "Add More"), "\n\n", HTML.Comment(" Modal "), "\n", HTML.DIV({
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
  }, "Save changes"), "\n      "), "\n    "), "\n  "), "\n"), "\n  "), "\n") ];
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
        Session.set("u_l", response);
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

}}}},"api":{"user":{"user.js":function(require,exports,module){

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

}}},"startup":{"client":{"index.js":function(require,exports,module){

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"client":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// client/main.js                                                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.link("/imports/startup/client");
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