(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var jsdom;

var require = meteorInstall({"node_modules":{"meteor":{"pete:jsdom":{"jsdom.js":function(require){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/pete_jsdom/jsdom.js                                      //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
jsdom = Npm.require('jsdom');
///////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/pete:jsdom/jsdom.js");

/* Exports */
Package._define("pete:jsdom");

})();

//# sourceURL=meteor://💻app/packages/pete_jsdom.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcGV0ZTpqc2RvbS9qc2RvbS5qcyJdLCJuYW1lcyI6WyJqc2RvbSIsIk5wbSIsInJlcXVpcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsS0FBSyxHQUFHQyxHQUFHLENBQUNDLE9BQUosQ0FBWSxPQUFaLENBQVIsQyIsImZpbGUiOiIvcGFja2FnZXMvcGV0ZV9qc2RvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImpzZG9tID0gTnBtLnJlcXVpcmUoJ2pzZG9tJyk7XG5cbiJdfQ==
