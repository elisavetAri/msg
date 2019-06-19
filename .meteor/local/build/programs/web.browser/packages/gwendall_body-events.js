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
var Template = Package['templating-runtime'].Template;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/gwendall_body-events/packages/gwendall_body-events.js                                             //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/gwendall:body-events/lib.js                                                                 //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
Template.body.events = function(events) {                                                               // 1
  for (var eventMap in events) {                                                                        // 2
    (function(events, eventMap) {                                                                       // 3
      var handler = events[eventMap];                                                                   // 4
      var maps = eventMap.split(",");                                                                   // 5
      maps.forEach(function(map) {                                                                      // 6
        map = $.trim(map);                                                                              // 7
        var split = map.split(" ");                                                                     // 8
        var event = split[0];                                                                           // 9
        if (split.length === 1) {                                                                       // 10
          $(document).on(event, function(e) {                                                           // 11
            var data = {};                                                                              // 12
            handler.apply(this, [e, data]);                                                             // 13
          });                                                                                           // 14
        } else {                                                                                        // 15
          var selector = split.slice(1).join(" ");                                                      // 16
          $(document).delegate(selector, event, function(e) {                                           // 17
            var el = $(e.currentTarget).get(0);                                                         // 18
            var data = Blaze.getData(el);                                                               // 19
            var tpl = (Blaze.getView(el) && Meteor._get(Blaze.getView(el), "_templateInstance")) || {}; // 20
            handler.apply(this, [e, data, tpl]);                                                        // 21
          });                                                                                           // 22
        }                                                                                               // 23
      });                                                                                               // 24
    })(events, eventMap);                                                                               // 25
  }                                                                                                     // 26
}                                                                                                       // 27
                                                                                                        // 28
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("gwendall:body-events");

})();
