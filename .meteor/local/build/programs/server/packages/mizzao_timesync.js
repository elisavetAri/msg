(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"mizzao:timesync":{"timesync-server.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/mizzao_timesync/timesync-server.js                                                        //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
// Use rawConnectHandlers so we get a response as quickly as possible
// https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js
WebApp.rawConnectHandlers.use("/_timesync", function (req, res, next) {
  // Never ever cache this, otherwise weird times are shown on reload
  // http://stackoverflow.com/q/18811286/586086
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", 0); // Avoid MIME type warnings in browsers

  res.setHeader("Content-Type", "text/plain"); // Cordova lives in a local webserver, so it does CORS
  // we need to bless it's requests in order for it to accept our results
  // Match http://localhost:<port> for Cordova clients in Meteor 1.3
  // and http://meteor.local for earlier versions

  const origin = req.headers.origin;

  if (origin && (origin === 'http://meteor.local' || origin === 'meteor://desktop' || /^http:\/\/localhost:1[23]\d\d\d$/.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.end(Date.now().toString());
});
////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/mizzao:timesync/timesync-server.js");

/* Exports */
Package._define("mizzao:timesync");

})();

//# sourceURL=meteor://💻app/packages/mizzao_timesync.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWl6emFvOnRpbWVzeW5jL3RpbWVzeW5jLXNlcnZlci5qcyJdLCJuYW1lcyI6WyJXZWJBcHAiLCJyYXdDb25uZWN0SGFuZGxlcnMiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0Iiwic2V0SGVhZGVyIiwib3JpZ2luIiwiaGVhZGVycyIsInRlc3QiLCJlbmQiLCJEYXRlIiwibm93IiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBRUFBLE1BQU0sQ0FBQ0Msa0JBQVAsQ0FBMEJDLEdBQTFCLENBQThCLFlBQTlCLEVBQ0UsVUFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CQyxJQUFuQixFQUF5QjtBQUN2QjtBQUNBO0FBQ0FELEtBQUcsQ0FBQ0UsU0FBSixDQUFjLGVBQWQsRUFBK0IscUNBQS9CO0FBQ0FGLEtBQUcsQ0FBQ0UsU0FBSixDQUFjLFFBQWQsRUFBd0IsVUFBeEI7QUFDQUYsS0FBRyxDQUFDRSxTQUFKLENBQWMsU0FBZCxFQUF5QixDQUF6QixFQUx1QixDQU92Qjs7QUFDQUYsS0FBRyxDQUFDRSxTQUFKLENBQWMsY0FBZCxFQUE4QixZQUE5QixFQVJ1QixDQVV2QjtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxRQUFNQyxNQUFNLEdBQUdKLEdBQUcsQ0FBQ0ssT0FBSixDQUFZRCxNQUEzQjs7QUFFQSxNQUFJQSxNQUFNLEtBQU1BLE1BQU0sS0FBSyxxQkFBWCxJQUNaQSxNQUFNLEtBQUssa0JBREMsSUFFWixtQ0FBbUNFLElBQW5DLENBQXdDRixNQUF4QyxDQUZNLENBQVYsRUFFd0Q7QUFDdERILE9BQUcsQ0FBQ0UsU0FBSixDQUFjLDZCQUFkLEVBQTZDQyxNQUE3QztBQUNEOztBQUVESCxLQUFHLENBQUNNLEdBQUosQ0FBUUMsSUFBSSxDQUFDQyxHQUFMLEdBQVdDLFFBQVgsRUFBUjtBQUNELENBeEJILEUiLCJmaWxlIjoiL3BhY2thZ2VzL21penphb190aW1lc3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFVzZSByYXdDb25uZWN0SGFuZGxlcnMgc28gd2UgZ2V0IGEgcmVzcG9uc2UgYXMgcXVpY2tseSBhcyBwb3NzaWJsZVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvYmxvYi9kZXZlbC9wYWNrYWdlcy93ZWJhcHAvd2ViYXBwX3NlcnZlci5qc1xuXG5XZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLnVzZShcIi9fdGltZXN5bmNcIixcbiAgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICAvLyBOZXZlciBldmVyIGNhY2hlIHRoaXMsIG90aGVyd2lzZSB3ZWlyZCB0aW1lcyBhcmUgc2hvd24gb24gcmVsb2FkXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3EvMTg4MTEyODYvNTg2MDg2XG4gICAgcmVzLnNldEhlYWRlcihcIkNhY2hlLUNvbnRyb2xcIiwgXCJuby1jYWNoZSwgbm8tc3RvcmUsIG11c3QtcmV2YWxpZGF0ZVwiKTtcbiAgICByZXMuc2V0SGVhZGVyKFwiUHJhZ21hXCIsIFwibm8tY2FjaGVcIik7XG4gICAgcmVzLnNldEhlYWRlcihcIkV4cGlyZXNcIiwgMCk7XG5cbiAgICAvLyBBdm9pZCBNSU1FIHR5cGUgd2FybmluZ3MgaW4gYnJvd3NlcnNcbiAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC9wbGFpblwiKTtcblxuICAgIC8vIENvcmRvdmEgbGl2ZXMgaW4gYSBsb2NhbCB3ZWJzZXJ2ZXIsIHNvIGl0IGRvZXMgQ09SU1xuICAgIC8vIHdlIG5lZWQgdG8gYmxlc3MgaXQncyByZXF1ZXN0cyBpbiBvcmRlciBmb3IgaXQgdG8gYWNjZXB0IG91ciByZXN1bHRzXG4gICAgLy8gTWF0Y2ggaHR0cDovL2xvY2FsaG9zdDo8cG9ydD4gZm9yIENvcmRvdmEgY2xpZW50cyBpbiBNZXRlb3IgMS4zXG4gICAgLy8gYW5kIGh0dHA6Ly9tZXRlb3IubG9jYWwgZm9yIGVhcmxpZXIgdmVyc2lvbnNcbiAgICBjb25zdCBvcmlnaW4gPSByZXEuaGVhZGVycy5vcmlnaW47XG5cbiAgICBpZiAob3JpZ2luICYmICggb3JpZ2luID09PSAnaHR0cDovL21ldGVvci5sb2NhbCcgfHwgXG4gICAgICAgIG9yaWdpbiA9PT0gJ21ldGVvcjovL2Rlc2t0b3AnIHx8IFxuICAgICAgICAvXmh0dHA6XFwvXFwvbG9jYWxob3N0OjFbMjNdXFxkXFxkXFxkJC8udGVzdChvcmlnaW4pICkgKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCBvcmlnaW4pO1xuICAgIH1cblxuICAgIHJlcy5lbmQoRGF0ZS5ub3coKS50b1N0cmluZygpKTtcbiAgfVxuKTtcbiJdfQ==
