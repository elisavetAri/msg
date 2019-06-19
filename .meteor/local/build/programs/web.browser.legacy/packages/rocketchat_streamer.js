//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var DDPCommon = Package['ddp-common'].DDPCommon;
var check = Package.check.check;
var Match = Package.check.Match;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var EV, Streamer;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:streamer":{"lib":{"ev.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_streamer/lib/ev.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals EV:true */

/* exported EV */
EV =
/*#__PURE__*/
function () {
  function EV() {
    this.handlers = {};
  }

  var _proto = EV.prototype;

  _proto.emit = function () {
    function emit(event) {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return this.handlers[event] && this.handlers[event].forEach(function (handler) {
        return handler.apply(_this, args);
      });
    }

    return emit;
  }();

  _proto.emitWithScope = function () {
    function emitWithScope(event, scope) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      return this.handlers[event] && this.handlers[event].forEach(function (handler) {
        return handler.apply(scope, args);
      });
    }

    return emitWithScope;
  }();

  _proto.listenerCount = function () {
    function listenerCount(event) {
      return this.handlers[event] && this.handlers[event].length || 0;
    }

    return listenerCount;
  }();

  _proto.on = function () {
    function on(event, callback) {
      if (!this.handlers[event]) {
        this.handlers[event] = [];
      }

      this.handlers[event].push(callback);
    }

    return on;
  }();

  _proto.once = function () {
    function once(event, callback) {
      var self = this;
      this.on(event, function () {
        function onetimeCallback() {
          self.removeListener(event, onetimeCallback);
          callback.apply(this, arguments);
        }

        return onetimeCallback;
      }());
    }

    return once;
  }();

  _proto.removeListener = function () {
    function removeListener(event, callback) {
      if (!this.handlers[event]) {
        return;
      }

      var index = this.handlers[event].indexOf(callback);

      if (index > -1) {
        this.handlers[event].splice(index, 1);
      }
    }

    return removeListener;
  }();

  _proto.removeAllListeners = function () {
    function removeAllListeners(event) {
      this.handlers[event] = undefined;
    }

    return removeAllListeners;
  }();

  return EV;
}();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"client":{"client.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_streamer/client/client.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/* globals DDPCommon, EV */

/* eslint-disable new-cap */
var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

var StreamerCentral =
/*#__PURE__*/
function (_EV) {
  (0, _inheritsLoose2.default)(StreamerCentral, _EV);

  function StreamerCentral() {
    var _this;

    _this = _EV.call(this) || this;
    _this.instances = {};
    _this.ddpConnections = {}; // since each Streamer instance can provide its own ddp connection, store them by streamer name

    return _this;
  }

  var _proto = StreamerCentral.prototype;

  _proto.setupDdpConnection = function () {
    function setupDdpConnection(name, ddpConnection) {
      var _this2 = this;

      // make sure we only setup event listeners for each ddp connection once
      if (ddpConnection.hasMeteorStreamerEventListeners) {
        return;
      }

      ddpConnection._stream.on('message', function (raw_msg) {
        var msg = DDPCommon.parseDDP(raw_msg);

        if (msg && msg.msg === 'changed' && msg.collection && msg.fields && msg.fields.eventName && msg.fields.args) {
          msg.fields.args.unshift(msg.fields.eventName);
          msg.fields.args.unshift(msg.collection);

          _this2.emit.apply(_this2, msg.fields.args);
        }
      }); // store ddp connection


      this.storeDdpConnection(name, ddpConnection);
    }

    return setupDdpConnection;
  }();

  _proto.storeDdpConnection = function () {
    function storeDdpConnection(name, ddpConnection) {
      // mark the connection as setup for Streamer, and store it
      ddpConnection.hasMeteorStreamerEventListeners = true;
      this.ddpConnections[name] = ddpConnection;
    }

    return storeDdpConnection;
  }();

  return StreamerCentral;
}(EV);

Meteor.StreamerCentral = new StreamerCentral();

Meteor.Streamer =
/*#__PURE__*/
function (_EV2) {
  (0, _inheritsLoose2.default)(Streamer, _EV2);

  function Streamer(name) {
    var _this3;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$useCollection = _ref.useCollection,
        useCollection = _ref$useCollection === void 0 ? false : _ref$useCollection,
        _ref$ddpConnection = _ref.ddpConnection,
        ddpConnection = _ref$ddpConnection === void 0 ? Meteor.connection : _ref$ddpConnection;

    if (Meteor.StreamerCentral.instances[name]) {
      console.warn('Streamer instance already exists:', name);
      return Meteor.StreamerCentral.instances[name] || (0, _assertThisInitialized2.default)(_this3);
    }

    Meteor.StreamerCentral.setupDdpConnection(name, ddpConnection);
    _this3 = _EV2.call(this) || this;
    _this3.ddpConnection = ddpConnection || Meteor.connection;
    Meteor.StreamerCentral.instances[name] = (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this3));
    _this3.name = name;
    _this3.useCollection = useCollection;
    _this3.subscriptions = {};
    Meteor.StreamerCentral.on(_this3.subscriptionName, function (eventName) {
      if (_this3.subscriptions[eventName]) {
        var _EV2$prototype$emit;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _this3.subscriptions[eventName].lastMessage = args;

        (_EV2$prototype$emit = _EV2.prototype.emit).call.apply(_EV2$prototype$emit, [(0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this3)), eventName].concat(args));
      }
    });

    _this3.ddpConnection._stream.on('reset', function () {
      _EV2.prototype.emit.call((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this3)), '__reconnect__');
    });

    return _this3;
  }

  var _proto2 = Streamer.prototype;

  _proto2.stop = function () {
    function stop(eventName) {
      return this.subscriptions[eventName] && this.subscriptions[eventName].subscription && this.subscriptions[eventName].subscription.stop();
    }

    return stop;
  }();

  _proto2.stopAll = function () {
    function stopAll() {
      var _this4 = this;

      Object.keys(this.subscriptions).forEach(function (eventName) {
        return _this4.removeAllListeners(eventName);
      });
    }

    return stopAll;
  }();

  _proto2.unsubscribe = function () {
    function unsubscribe(eventName) {
      delete this.subscriptions[eventName];

      _EV2.prototype.removeAllListeners.call(this, eventName);
    }

    return unsubscribe;
  }();

  _proto2.subscribe = function () {
    function subscribe(eventName, args) {
      var _this5 = this;

      if (this.subscriptions[eventName]) {
        return;
      }

      var subscription = Tracker.nonreactive(function () {
        return _this5.ddpConnection.subscribe(_this5.subscriptionName, eventName, {
          useCollection: _this5.useCollection,
          args: args
        }, {
          onStop: function () {
            return _this5.unsubscribe(eventName);
          }
        });
      });
      this.subscriptions[eventName] = {
        subscription: subscription
      };
    }

    return subscribe;
  }();

  _proto2.onReconnect = function () {
    function onReconnect(fn) {
      if (typeof fn === 'function') {
        _EV2.prototype.on.call(this, '__reconnect__', fn);
      }
    }

    return onReconnect;
  }();

  _proto2.getLastMessageFromEvent = function () {
    function getLastMessageFromEvent(eventName) {
      var subscription = this.subscriptions[eventName];

      if (subscription && subscription.lastMessage) {
        return subscription.lastMessage;
      }
    }

    return getLastMessageFromEvent;
  }();

  _proto2.removeAllListeners = function () {
    function removeAllListeners(eventName) {
      _EV2.prototype.removeAllListeners.call(this, eventName);

      return this.stop(eventName);
    }

    return removeAllListeners;
  }();

  _proto2.removeListener = function () {
    function removeListener(eventName) {
      var _EV2$prototype$remove;

      if (this.listenerCount(eventName) === 1) {
        this.stop(eventName);
      }

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      (_EV2$prototype$remove = _EV2.prototype.removeListener).call.apply(_EV2$prototype$remove, [this, eventName].concat(args));
    }

    return removeListener;
  }();

  _proto2.on = function () {
    function on(eventName) {
      check(eventName, NonEmptyString);

      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var callback = args.pop();
      check(callback, Function);
      this.subscribe(eventName, args);

      _EV2.prototype.on.call(this, eventName, callback);
    }

    return on;
  }();

  _proto2.once = function () {
    function once(eventName) {
      var _this6 = this;

      check(eventName, NonEmptyString);

      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      var callback = args.pop();
      check(callback, Function);
      this.subscribe(eventName, args);

      _EV2.prototype.once.call(this, eventName, function () {
        callback.apply(void 0, arguments);

        if (_this6.listenerCount(eventName) === 0) {
          return _this6.stop(eventName);
        }
      });
    }

    return once;
  }();

  _proto2.emit = function () {
    function emit() {
      var _this$ddpConnection;

      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      (_this$ddpConnection = this.ddpConnection).call.apply(_this$ddpConnection, [this.subscriptionName].concat(args));
    }

    return emit;
  }();

  (0, _createClass2.default)(Streamer, [{
    key: "name",
    get: function () {
      return this._name;
    },
    set: function (name) {
      check(name, String);
      this._name = name;
    }
  }, {
    key: "subscriptionName",
    get: function () {
      return "stream-" + this.name;
    }
  }, {
    key: "useCollection",
    get: function () {
      return this._useCollection;
    },
    set: function (useCollection) {
      check(useCollection, Boolean);
      this._useCollection = useCollection;
    }
  }]);
  return Streamer;
}(EV);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/rocketchat:streamer/lib/ev.js");
require("/node_modules/meteor/rocketchat:streamer/client/client.js");

/* Exports */
Package._define("rocketchat:streamer", {
  Streamer: Streamer
});

})();
