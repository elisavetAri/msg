(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"socialize:server-time":{"server":{"server-time.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/socialize_server-time/server/server-time.js              //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.export({
  ServerTime: () => ServerTime
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let ServerTime;
module.link("../common/server-time", {
  ServerTime(v) {
    ServerTime = v;
  }

}, 1);
Meteor.methods({
  'socialize:getServerTime': function getServerTime() {
    return Date.now();
  }
});
///////////////////////////////////////////////////////////////////////

}},"common":{"server-time.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/socialize_server-time/common/server-time.js              //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.export({
  ServerTime: () => ServerTime
});
const ServerTime = {
  _timeDifference: 0
};

ServerTime.now = function now() {
  return Date.now() + this._timeDifference;
};

ServerTime.date = function date() {
  return new Date(this.now());
};
///////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/socialize:server-time/server/server-time.js");

/* Exports */
Package._define("socialize:server-time", exports);

})();

//# sourceURL=meteor://💻app/packages/socialize_server-time.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc29jaWFsaXplOnNlcnZlci10aW1lL3NlcnZlci9zZXJ2ZXItdGltZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc29jaWFsaXplOnNlcnZlci10aW1lL2NvbW1vbi9zZXJ2ZXItdGltZS5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJTZXJ2ZXJUaW1lIiwiTWV0ZW9yIiwibGluayIsInYiLCJtZXRob2RzIiwiZ2V0U2VydmVyVGltZSIsIkRhdGUiLCJub3ciLCJfdGltZURpZmZlcmVuY2UiLCJkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLFlBQVUsRUFBQyxNQUFJQTtBQUFoQixDQUFkO0FBQTJDLElBQUlDLE1BQUo7QUFBV0gsTUFBTSxDQUFDSSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRCxRQUFNLENBQUNFLENBQUQsRUFBRztBQUFDRixVQUFNLEdBQUNFLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUgsVUFBSjtBQUFlRixNQUFNLENBQUNJLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRixZQUFVLENBQUNHLENBQUQsRUFBRztBQUFDSCxjQUFVLEdBQUNHLENBQVg7QUFBYTs7QUFBNUIsQ0FBcEMsRUFBa0UsQ0FBbEU7QUFPMUhGLE1BQU0sQ0FBQ0csT0FBUCxDQUFlO0FBQ1gsNkJBQTJCLFNBQVNDLGFBQVQsR0FBeUI7QUFDaEQsV0FBT0MsSUFBSSxDQUFDQyxHQUFMLEVBQVA7QUFDSDtBQUhVLENBQWYsRTs7Ozs7Ozs7Ozs7QUNQQVQsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0MsWUFBVSxFQUFDLE1BQUlBO0FBQWhCLENBQWQ7QUFBTyxNQUFNQSxVQUFVLEdBQUc7QUFDdEJRLGlCQUFlLEVBQUU7QUFESyxDQUFuQjs7QUFJUFIsVUFBVSxDQUFDTyxHQUFYLEdBQWlCLFNBQVNBLEdBQVQsR0FBZTtBQUFFLFNBQU9ELElBQUksQ0FBQ0MsR0FBTCxLQUFhLEtBQUtDLGVBQXpCO0FBQTJDLENBQTdFOztBQUVBUixVQUFVLENBQUNTLElBQVgsR0FBa0IsU0FBU0EsSUFBVCxHQUFnQjtBQUFFLFNBQU8sSUFBSUgsSUFBSixDQUFTLEtBQUtDLEdBQUwsRUFBVCxDQUFQO0FBQThCLENBQWxFLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3NvY2lhbGl6ZV9zZXJ2ZXItdGltZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby11bnJlc29sdmVkICovXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuLyogZXNsaW50LWVuYWJsZSBpbXBvcnQvbm8tdW5yZXNvbHZlZCAqL1xuXG5pbXBvcnQgeyBTZXJ2ZXJUaW1lIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZlci10aW1lJztcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAgICdzb2NpYWxpemU6Z2V0U2VydmVyVGltZSc6IGZ1bmN0aW9uIGdldFNlcnZlclRpbWUoKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdygpO1xuICAgIH0sXG59KTtcblxuZXhwb3J0IHsgU2VydmVyVGltZSB9O1xuIiwiZXhwb3J0IGNvbnN0IFNlcnZlclRpbWUgPSB7XG4gICAgX3RpbWVEaWZmZXJlbmNlOiAwLFxufTtcblxuU2VydmVyVGltZS5ub3cgPSBmdW5jdGlvbiBub3coKSB7IHJldHVybiBEYXRlLm5vdygpICsgdGhpcy5fdGltZURpZmZlcmVuY2U7IH07XG5cblNlcnZlclRpbWUuZGF0ZSA9IGZ1bmN0aW9uIGRhdGUoKSB7IHJldHVybiBuZXcgRGF0ZSh0aGlzLm5vdygpKTsgfTtcbiJdfQ==
