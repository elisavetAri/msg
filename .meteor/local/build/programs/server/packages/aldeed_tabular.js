(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Tabular;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:tabular":{"server":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/aldeed_tabular/server/main.js                                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 1);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 2);
let Tabular;
module.link("../common/Tabular", {
  default(v) {
    Tabular = v;
  }

}, 3);

/*
 * These are the two publications used by TabularTable.
 *
 * The genericPub one can be overridden by supplying a `pub`
 * property with a different publication name. This publication
 * is given only the list of ids and requested fields. You may
 * want to override it if you need to publish documents from
 * related collections along with the table collection documents.
 *
 * The getInfo one runs first and handles all the complex logic
 * required by this package, so that you don't have to duplicate
 * this logic when overriding the genericPub function.
 *
 * Having two publications also allows fine-grained control of
 * reactivity on the client.
 */
Meteor.publish('tabular_genericPub', function (tableName, ids, fields) {
  check(tableName, String);
  check(ids, Array);
  check(fields, Match.Optional(Object));
  const table = Tabular.tablesByName[tableName];

  if (!table) {
    // We throw an error in the other pub, so no need to throw one here
    this.ready();
    return;
  } // Check security. We call this in both publications.


  if (typeof table.allow === 'function' && !table.allow(this.userId, fields)) {
    this.ready();
    return;
  } // Check security for fields. We call this only in this publication


  if (typeof table.allowFields === 'function' && !table.allowFields(this.userId, fields)) {
    this.ready();
    return;
  }

  return table.collection.find({
    _id: {
      $in: ids
    }
  }, {
    fields: fields
  });
});
Meteor.publish('tabular_getInfo', function (tableName, selector, sort, skip, limit) {
  check(tableName, String);
  check(selector, Match.Optional(Match.OneOf(Object, null)));
  check(sort, Match.Optional(Match.OneOf(Array, null)));
  check(skip, Number);
  check(limit, Match.Optional(Match.OneOf(Number, null)));
  const table = Tabular.tablesByName[tableName];

  if (!table) {
    throw new Error(`No TabularTable defined with the name "${tableName}". Make sure you are defining your TabularTable in common code.`);
  } // Check security. We call this in both publications.
  // Even though we're only publishing _ids and counts
  // from this function, with sensitive data, there is
  // a chance someone could do a query and learn something
  // just based on whether a result is found or not.


  if (typeof table.allow === 'function' && !table.allow(this.userId)) {
    this.ready();
    return;
  }

  selector = selector || {}; // Allow the user to modify the selector before we use it

  if (typeof table.changeSelector === 'function') {
    selector = table.changeSelector(selector, this.userId);
  } // Apply the server side selector specified in the tabular
  // table constructor. Both must be met, so we join
  // them using $and, allowing both selectors to have
  // the same keys.


  if (typeof table.selector === 'function') {
    const tableSelector = table.selector(this.userId);

    if (_.isEmpty(selector)) {
      selector = tableSelector;
    } else {
      selector = {
        $and: [tableSelector, selector]
      };
    }
  }

  const findOptions = {
    skip: skip,
    fields: {
      _id: 1
    }
  }; // `limit` may be `null`

  if (limit > 0) {
    findOptions.limit = limit;
  } // `sort` may be `null`


  if (_.isArray(sort)) {
    findOptions.sort = sort;
  }

  const filteredCursor = table.collection.find(selector, findOptions);
  let filteredRecordIds = filteredCursor.map(doc => doc._id); // If we are not going to count for real, in order to improve performance, then we will fake
  // the count to ensure the Next button is always available.

  const fakeCount = filteredRecordIds.length + skip + 1;
  const countCursor = table.collection.find(selector, {
    fields: {
      _id: 1
    }
  });
  let recordReady = false;

  let updateRecords = () => {
    let currentCount;

    if (!table.skipCount) {
      if (typeof table.alternativeCount === 'function') {
        currentCount = table.alternativeCount(selector);
      } else {
        currentCount = countCursor.count();
      }
    } // From https://datatables.net/manual/server-side
    // recordsTotal: Total records, before filtering (i.e. the total number of records in the database)
    // recordsFiltered: Total records, after filtering (i.e. the total number of records after filtering has been applied - not just the number of records being returned for this page of data).


    const record = {
      ids: filteredRecordIds,
      // count() will give us the updated total count
      // every time. It does not take the find options
      // limit into account.
      recordsTotal: table.skipCount ? fakeCount : currentCount,
      recordsFiltered: table.skipCount ? fakeCount : currentCount
    };

    if (recordReady) {
      //console.log('changed', tableName, record);
      this.changed('tabular_records', tableName, record);
    } else {
      //console.log('added', tableName, record);
      this.added('tabular_records', tableName, record);
      recordReady = true;
    }
  };

  if (table.throttleRefresh) {
    // Why Meteor.bindEnvironment? See https://github.com/aldeed/meteor-tabular/issues/278#issuecomment-217318112
    updateRecords = _.throttle(Meteor.bindEnvironment(updateRecords), table.throttleRefresh);
  }

  updateRecords();
  this.ready(); // Handle docs being added or removed from the result set.

  let initializing = true;
  const handle = filteredCursor.observeChanges({
    added: function (id) {
      if (initializing) return; //console.log('ADDED');

      filteredRecordIds.push(id);
      updateRecords();
    },
    removed: function (id) {
      //console.log('REMOVED');
      // _.findWhere is used to support Mongo ObjectIDs
      filteredRecordIds = _.without(filteredRecordIds, _.findWhere(filteredRecordIds, id));
      updateRecords();
    }
  });
  initializing = false; // It is too inefficient to use an observe without any limits to track count perfectly
  // accurately when, for example, the selector is {} and there are a million documents.
  // Instead we will update the count every 10 seconds, in addition to whenever the limited
  // result set changes.

  const interval = Meteor.setInterval(updateRecords, 10000); // Stop observing the cursors when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.

  this.onStop(() => {
    Meteor.clearInterval(interval);
    handle.stop();
  });
});
module.exportDefault(Tabular);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"common":{"Tabular.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/aldeed_tabular/common/Tabular.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
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
const Tabular = {};
Tabular.tablesByName = {};
Tabular.Table = class {
  constructor(options) {
    if (!options) throw new Error('Tabular.Table options argument is required');
    if (!options.name) throw new Error('Tabular.Table options must specify name');
    if (!options.columns) throw new Error('Tabular.Table options must specify columns');

    if (!(options.collection instanceof Mongo.Collection || options.collection instanceof Mongo.constructor // Fix: error if `collection: Meteor.users`
    )) {
      throw new Error('Tabular.Table options must specify collection');
    }

    this.name = options.name;
    this.collection = options.collection;
    this.pub = options.pub || 'tabular_genericPub'; // By default we use core `Meteor.subscribe`, but you can pass
    // a subscription manager like `sub: new SubsManager({cacheLimit: 20, expireIn: 3})`

    this.sub = options.sub || Meteor;
    this.onUnload = options.onUnload;
    this.allow = options.allow;
    this.allowFields = options.allowFields;
    this.changeSelector = options.changeSelector;
    this.throttleRefresh = options.throttleRefresh;
    this.alternativeCount = options.alternativeCount;
    this.skipCount = options.skipCount;

    if (_.isArray(options.extraFields)) {
      const fields = {};

      _.each(options.extraFields, fieldName => {
        fields[fieldName] = 1;
      });

      this.extraFields = fields;
    }

    this.selector = options.selector;
    this.options = _.omit(options, 'collection', 'pub', 'sub', 'onUnload', 'allow', 'allowFields', 'changeSelector', 'throttleRefresh', 'extraFields', 'alternativeCount', 'skipCount', 'name', 'selector');
    Tabular.tablesByName[this.name] = this;
  }

};
module.exportDefault(Tabular);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/aldeed:tabular/server/main.js");

/* Exports */
Package._define("aldeed:tabular", exports, {
  Tabular: Tabular
});

})();

//# sourceURL=meteor://💻app/packages/aldeed_tabular.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOnRhYnVsYXIvc2VydmVyL21haW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2FsZGVlZDp0YWJ1bGFyL2NvbW1vbi9UYWJ1bGFyLmpzIl0sIm5hbWVzIjpbIk1ldGVvciIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiY2hlY2siLCJNYXRjaCIsIl8iLCJUYWJ1bGFyIiwiZGVmYXVsdCIsInB1Ymxpc2giLCJ0YWJsZU5hbWUiLCJpZHMiLCJmaWVsZHMiLCJTdHJpbmciLCJBcnJheSIsIk9wdGlvbmFsIiwiT2JqZWN0IiwidGFibGUiLCJ0YWJsZXNCeU5hbWUiLCJyZWFkeSIsImFsbG93IiwidXNlcklkIiwiYWxsb3dGaWVsZHMiLCJjb2xsZWN0aW9uIiwiZmluZCIsIl9pZCIsIiRpbiIsInNlbGVjdG9yIiwic29ydCIsInNraXAiLCJsaW1pdCIsIk9uZU9mIiwiTnVtYmVyIiwiRXJyb3IiLCJjaGFuZ2VTZWxlY3RvciIsInRhYmxlU2VsZWN0b3IiLCJpc0VtcHR5IiwiJGFuZCIsImZpbmRPcHRpb25zIiwiaXNBcnJheSIsImZpbHRlcmVkQ3Vyc29yIiwiZmlsdGVyZWRSZWNvcmRJZHMiLCJtYXAiLCJkb2MiLCJmYWtlQ291bnQiLCJsZW5ndGgiLCJjb3VudEN1cnNvciIsInJlY29yZFJlYWR5IiwidXBkYXRlUmVjb3JkcyIsImN1cnJlbnRDb3VudCIsInNraXBDb3VudCIsImFsdGVybmF0aXZlQ291bnQiLCJjb3VudCIsInJlY29yZCIsInJlY29yZHNUb3RhbCIsInJlY29yZHNGaWx0ZXJlZCIsImNoYW5nZWQiLCJhZGRlZCIsInRocm90dGxlUmVmcmVzaCIsInRocm90dGxlIiwiYmluZEVudmlyb25tZW50IiwiaW5pdGlhbGl6aW5nIiwiaGFuZGxlIiwib2JzZXJ2ZUNoYW5nZXMiLCJpZCIsInB1c2giLCJyZW1vdmVkIiwid2l0aG91dCIsImZpbmRXaGVyZSIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJvblN0b3AiLCJjbGVhckludGVydmFsIiwic3RvcCIsImV4cG9ydERlZmF1bHQiLCJNb25nbyIsIlRhYmxlIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwibmFtZSIsImNvbHVtbnMiLCJDb2xsZWN0aW9uIiwicHViIiwic3ViIiwib25VbmxvYWQiLCJleHRyYUZpZWxkcyIsImVhY2giLCJmaWVsZE5hbWUiLCJvbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJQyxLQUFKLEVBQVVDLEtBQVY7QUFBZ0JKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsT0FBSyxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsU0FBSyxHQUFDRCxDQUFOO0FBQVEsR0FBbEI7O0FBQW1CRSxPQUFLLENBQUNGLENBQUQsRUFBRztBQUFDRSxTQUFLLEdBQUNGLENBQU47QUFBUTs7QUFBcEMsQ0FBM0IsRUFBaUUsQ0FBakU7O0FBQW9FLElBQUlHLENBQUo7O0FBQU1MLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUNJLEdBQUMsQ0FBQ0gsQ0FBRCxFQUFHO0FBQUNHLEtBQUMsR0FBQ0gsQ0FBRjtBQUFJOztBQUFWLENBQWhDLEVBQTRDLENBQTVDO0FBQStDLElBQUlJLE9BQUo7QUFBWU4sTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ00sU0FBTyxDQUFDTCxDQUFELEVBQUc7QUFBQ0ksV0FBTyxHQUFDSixDQUFSO0FBQVU7O0FBQXRCLENBQWhDLEVBQXdELENBQXhEOztBQUtyTjs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQUgsTUFBTSxDQUFDUyxPQUFQLENBQWUsb0JB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MUQsS0FBckI7QUFDQSxTQUFLRSxXQUFMLEdBQW1Cd0QsT0FBTyxDQUFDeEQsV0FBM0I7QUFDQSxTQUFLWSxjQUFMLEdBQXNCNEMsT0FBTyxDQUFDNUMsY0FBOUI7QUFDQSxTQUFLd0IsZUFBTCxHQUF1Qm9CLE9BQU8sQ0FBQ3BCLGVBQS9CO0FBQ0EsU0FBS1AsZ0JBQUwsR0FBd0IyQixPQUFPLENBQUMzQixnQkFBaEM7QUFDQSxTQUFLRCxTQUFMLEdBQWlCNEIsT0FBTyxDQUFDNUIsU0FBekI7O0FBRUEsUUFBSTVDLENBQUMsQ0FBQ2lDLE9BQUYsQ0FBVXVDLE9BQU8sQ0FBQ08sV0FBbEIsQ0FBSixFQUFvQztBQUNsQyxZQUFNekUsTUFBTSxHQUFHLEVBQWY7O0FBQ0FOLE9BQUMsQ0FBQ2dGLElBQUYsQ0FBT1IsT0FBTyxDQUFDTyxXQUFmLEVBQTRCRSxTQUFTLElBQUk7QUFDdkMzRSxjQUFNLENBQUMyRSxTQUFELENBQU4sR0FBb0IsQ0FBcEI7QUFDRCxPQUZEOztBQUdBLFdBQUtGLFdBQUwsR0FBbUJ6RSxNQUFuQjtBQUNEOztBQUVELFNBQUtlLFFBQUwsR0FBZ0JtRCxPQUFPLENBQUNuRCxRQUF4QjtBQUVBLFNBQUttRCxPQUFMLEdBQWV4RSxDQUFDLENBQUNrRixJQUFGLENBQ2JWLE9BRGEsRUFFYixZQUZhLEVBR2IsS0FIYSxFQUliLEtBSmEsRUFLYixVQUxhLEVBTWIsT0FOYSxFQU9iLGFBUGEsRUFRYixnQkFSYSxFQVNiLGlCQVRhLEVBVWIsYUFWYSxFQVdiLGtCQVhhLEVBWWIsV0FaYSxFQWFiLE1BYmEsRUFjYixVQWRhLENBQWY7QUFpQkF2RSxXQUFPLENBQUNXLFlBQVIsQ0FBcUIsS0FBSzZELElBQTFCLElBQWtDLElBQWxDO0FBQ0Q7O0FBeERtQixDQUF0QjtBQVBBOUUsTUFBTSxDQUFDeUUsYUFBUCxDQWtFZW5FLE9BbEVmLEUiLCJmaWxlIjoiL3BhY2thZ2VzL2FsZGVlZF90YWJ1bGFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBjaGVjaywgTWF0Y2ggfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCBUYWJ1bGFyIGZyb20gJy4uL2NvbW1vbi9UYWJ1bGFyJztcblxuLypcbiAqIFRoZXNlIGFyZSB0aGUgdHdvIHB1YmxpY2F0aW9ucyB1c2VkIGJ5IFRhYnVsYXJUYWJsZS5cbiAqXG4gKiBUaGUgZ2VuZXJpY1B1YiBvbmUgY2FuIGJlIG92ZXJyaWRkZW4gYnkgc3VwcGx5aW5nIGEgYHB1YmBcbiAqIHByb3BlcnR5IHdpdGggYSBkaWZmZXJlbnQgcHVibGljYXRpb24gbmFtZS4gVGhpcyBwdWJsaWNhdGlvblxuICogaXMgZ2l2ZW4gb25seSB0aGUgbGlzdCBvZiBpZHMgYW5kIHJlcXVlc3RlZCBmaWVsZHMuIFlvdSBtYXlcbiAqIHdhbnQgdG8gb3ZlcnJpZGUgaXQgaWYgeW91IG5lZWQgdG8gcHVibGlzaCBkb2N1bWVudHMgZnJvbVxuICogcmVsYXRlZCBjb2xsZWN0aW9ucyBhbG9uZyB3aXRoIHRoZSB0YWJsZSBjb2xsZWN0aW9uIGRvY3VtZW50cy5cbiAqXG4gKiBUaGUgZ2V0SW5mbyBvbmUgcnVucyBmaXJzdCBhbmQgaGFuZGxlcyBhbGwgdGhlIGNvbXBsZXggbG9naWNcbiAqIHJlcXVpcmVkIGJ5IHRoaXMgcGFja2FnZSwgc28gdGhhdCB5b3UgZG9uJ3QgaGF2ZSB0byBkdXBsaWNhdGVcbiAqIHRoaXMgbG9naWMgd2hlbiBvdmVycmlkaW5nIHRoZSBnZW5lcmljUHViIGZ1bmN0aW9uLlxuICpcbiAqIEhhdmluZyB0d28gcHVibGljYXRpb25zIGFsc28gYWxsb3dzIGZpbmUtZ3JhaW5lZCBjb250cm9sIG9mXG4gKiByZWFjdGl2aXR5IG9uIHRoZSBjbGllbnQuXG4gKi9cblxuTWV0ZW9yLnB1Ymxpc2goJ3RhYnVsYXJfZ2VuZXJpY1B1YicsIGZ1bmN0aW9uICh0YWJsZU5hbWUsIGlkcywgZmllbGRzKSB7XG4gIGNoZWNrKHRhYmxlTmFtZSwgU3RyaW5nKTtcbiAgY2hlY2soaWRzLCBBcnJheSk7XG4gIGNoZWNrKGZpZWxkcywgTWF0Y2guT3B0aW9uYWwoT2JqZWN0KSk7XG5cbiAgY29uc3QgdGFibGUgPSBUYWJ1bGFyLnRhYmxlc0J5TmFtZVt0YWJsZU5hbWVdO1xuICBpZiAoIXRhYmxlKSB7XG4gICAgLy8gV2UgdGhyb3cgYW4gZXJyb3IgaW4gdGhlIG90aGVyIHB1Yiwgc28gbm8gbmVlZCB0byB0aHJvdyBvbmUgaGVyZVxuICAgIHRoaXMucmVhZHkoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBDaGVjayBzZWN1cml0eS4gV2UgY2FsbCB0aGlzIGluIGJvdGggcHVibGljYXRpb25zLlxuICBpZiAodHlwZW9mIHRhYmxlLmFsbG93ID09PSAnZnVuY3Rpb24nICYmICF0YWJsZS5hbGxvdyh0aGlzLnVzZXJJZCwgZmllbGRzKSkge1xuICAgIHRoaXMucmVhZHkoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBDaGVjayBzZWN1cml0eSBmb3IgZmllbGRzLiBXZSBjYWxsIHRoaXMgb25seSBpbiB0aGlzIHB1YmxpY2F0aW9uXG4gIGlmICh0eXBlb2YgdGFibGUuYWxsb3dGaWVsZHMgPT09ICdmdW5jdGlvbicgJiYgIXRhYmxlLmFsbG93RmllbGRzKHRoaXMudXNlcklkLCBmaWVsZHMpKSB7XG4gICAgdGhpcy5yZWFkeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiB0YWJsZS5jb2xsZWN0aW9uLmZpbmQoe19pZDogeyRpbjogaWRzfX0sIHtmaWVsZHM6IGZpZWxkc30pO1xufSk7XG5cbk1ldGVvci5wdWJsaXNoKCd0YWJ1bGFyX2dldEluZm8nLCBmdW5jdGlvbiAodGFibGVOYW1lLCBzZWxlY3Rvciwgc29ydCwgc2tpcCwgbGltaXQpIHtcbiAgY2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuICBjaGVjayhzZWxlY3RvciwgTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoT2JqZWN0LCBudWxsKSkpO1xuICBjaGVjayhzb3J0LCBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihBcnJheSwgbnVsbCkpKTtcbiAgY2hlY2soc2tpcCwgTnVtYmVyKTtcbiAgY2hlY2sobGltaXQsIE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKE51bWJlciwgbnVsbCkpKTtcblxuICBjb25zdCB0YWJsZSA9IFRhYnVsYXIudGFibGVzQnlOYW1lW3RhYmxlTmFtZV07XG4gIGlmICghdGFibGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIFRhYnVsYXJUYWJsZSBkZWZpbmVkIHdpdGggdGhlIG5hbWUgXCIke3RhYmxlTmFtZX1cIi4gTWFrZSBzdXJlIHlvdSBhcmUgZGVmaW5pbmcgeW91ciBUYWJ1bGFyVGFibGUgaW4gY29tbW9uIGNvZGUuYCk7XG4gIH1cblxuICAvLyBDaGVjayBzZWN1cml0eS4gV2UgY2FsbCB0aGlzIGluIGJvdGggcHVibGljYXRpb25zLlxuICAvLyBFdmVuIHRob3VnaCB3ZSdyZSBvbmx5IHB1Ymxpc2hpbmcgX2lkcyBhbmQgY291bnRzXG4gIC8vIGZyb20gdGhpcyBmdW5jdGlvbiwgd2l0aCBzZW5zaXRpdmUgZGF0YSwgdGhlcmUgaXNcbiAgLy8gYSBjaGFuY2Ugc29tZW9uZSBjb3VsZCBkbyBhIHF1ZXJ5IGFuZCBsZWFybiBzb21ldGhpbmdcbiAgLy8ganVzdCBiYXNlZCBvbiB3aGV0aGVyIGEgcmVzdWx0IGlzIGZvdW5kIG9yIG5vdC5cbiAgaWYgKHR5cGVvZiB0YWJsZS5hbGxvdyA9PT0gJ2Z1bmN0aW9uJyAmJiAhdGFibGUuYWxsb3codGhpcy51c2VySWQpKSB7XG4gICAgdGhpcy5yZWFkeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNlbGVjdG9yID0gc2VsZWN0b3IgfHwge307XG5cbiAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gbW9kaWZ5IHRoZSBzZWxlY3RvciBiZWZvcmUgd2UgdXNlIGl0XG4gIGlmICh0eXBlb2YgdGFibGUuY2hhbmdlU2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICBzZWxlY3RvciA9IHRhYmxlLmNoYW5nZVNlbGVjdG9yKHNlbGVjdG9yLCB0aGlzLnVzZXJJZCk7XG4gIH1cblxuICAvLyBBcHBseSB0aGUgc2VydmVyIHNpZGUgc2VsZWN0b3Igc3BlY2lmaWVkIGluIHRoZSB0YWJ1bGFyXG4gIC8vIHRhYmxlIGNvbnN0cnVjdG9yLiBCb3RoIG11c3QgYmUgbWV0LCBzbyB3ZSBqb2luXG4gIC8vIHRoZW0gdXNpbmcgJGFuZCwgYWxsb3dpbmcgYm90aCBzZWxlY3RvcnMgdG8gaGF2ZVxuICAvLyB0aGUgc2FtZSBrZXlzLlxuICBpZiAodHlwZW9mIHRhYmxlLnNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc3QgdGFibGVTZWxlY3RvciA9IHRhYmxlLnNlbGVjdG9yKHRoaXMudXNlcklkKTtcbiAgICBpZiAoXy5pc0VtcHR5KHNlbGVjdG9yKSkge1xuICAgICAgc2VsZWN0b3IgPSB0YWJsZVNlbGVjdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RvciA9IHskYW5kOiBbdGFibGVTZWxlY3Rvciwgc2VsZWN0b3JdfTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBmaW5kT3B0aW9ucyA9IHtcbiAgICBza2lwOiBza2lwLFxuICAgIGZpZWxkczoge19pZDogMX1cbiAgfTtcblxuICAvLyBgbGltaXRgIG1heSBiZSBgbnVsbGBcbiAgaWYgKGxpbWl0ID4gMCkge1xuICAgIGZpbmRPcHRpb25zLmxpbWl0ID0gbGltaXQ7XG4gIH1cblxuICAvLyBgc29ydGAgbWF5IGJlIGBudWxsYFxuICBpZiAoXy5pc0FycmF5KHNvcnQpKSB7XG4gICAgZmluZE9wdGlvbnMuc29ydCA9IHNvcnQ7XG4gIH1cblxuICBjb25zdCBmaWx0ZXJlZEN1cnNvciA9IHRhYmxlLmNvbGxlY3Rpb24uZmluZChzZWxlY3RvciwgZmluZE9wdGlvbnMpO1xuXG4gIGxldCBmaWx0ZXJlZFJlY29yZElkcyA9IGZpbHRlcmVkQ3Vyc29yLm1hcChkb2MgPT4gZG9jLl9pZCk7XG5cbiAgLy8gSWYgd2UgYXJlIG5vdCBnb2luZyB0byBjb3VudCBmb3IgcmVhbCwgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSwgdGhlbiB3ZSB3aWxsIGZha2VcbiAgLy8gdGhlIGNvdW50IHRvIGVuc3VyZSB0aGUgTmV4dCBidXR0b24gaXMgYWx3YXlzIGF2YWlsYWJsZS5cbiAgY29uc3QgZmFrZUNvdW50ID0gZmlsdGVyZWRSZWNvcmRJZHMubGVuZ3RoICsgc2tpcCArIDE7XG5cbiAgY29uc3QgY291bnRDdXJzb3IgPSB0YWJsZS5jb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IsIHtmaWVsZHM6IHtfaWQ6IDF9fSk7XG5cbiAgbGV0IHJlY29yZFJlYWR5ID0gZmFsc2U7XG4gIGxldCB1cGRhdGVSZWNvcmRzID0gKCkgPT4ge1xuICAgIGxldCBjdXJyZW50Q291bnQ7XG4gICAgaWYgKCF0YWJsZS5za2lwQ291bnQpIHtcbiAgICAgIGlmICh0eXBlb2YgdGFibGUuYWx0ZXJuYXRpdmVDb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjdXJyZW50Q291bnQgPSB0YWJsZS5hbHRlcm5hdGl2ZUNvdW50KHNlbGVjdG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRDb3VudCA9IGNvdW50Q3Vyc29yLmNvdW50KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRnJvbSBodHRwczovL2RhdGF0YWJsZXMubmV0L21hbnVhbC9zZXJ2ZXItc2lkZVxuICAgIC8vIHJlY29yZHNUb3RhbDogVG90YWwgcmVjb3JkcywgYmVmb3JlIGZpbHRlcmluZyAoaS5lLiB0aGUgdG90YWwgbnVtYmVyIG9mIHJlY29yZHMgaW4gdGhlIGRhdGFiYXNlKVxuICAgIC8vIHJlY29yZHNGaWx0ZXJlZDogVG90YWwgcmVjb3JkcywgYWZ0ZXIgZmlsdGVyaW5nIChpLmUuIHRoZSB0b3RhbCBudW1iZXIgb2YgcmVjb3JkcyBhZnRlciBmaWx0ZXJpbmcgaGFzIGJlZW4gYXBwbGllZCAtIG5vdCBqdXN0IHRoZSBudW1iZXIgb2YgcmVjb3JkcyBiZWluZyByZXR1cm5lZCBmb3IgdGhpcyBwYWdlIG9mIGRhdGEpLlxuXG4gICAgY29uc3QgcmVjb3JkID0ge1xuICAgICAgaWRzOiBmaWx0ZXJlZFJlY29yZElkcyxcbiAgICAgIC8vIGNvdW50KCkgd2lsbCBnaXZlIHVzIHRoZSB1cGRhdGVkIHRvdGFsIGNvdW50XG4gICAgICAvLyBldmVyeSB0aW1lLiBJdCBkb2VzIG5vdCB0YWtlIHRoZSBmaW5kIG9wdGlvbnNcbiAgICAgIC8vIGxpbWl0IGludG8gYWNjb3VudC5cbiAgICAgIHJlY29yZHNUb3RhbDogdGFibGUuc2tpcENvdW50ID8gZmFrZUNvdW50IDogY3VycmVudENvdW50LFxuICAgICAgcmVjb3Jkc0ZpbHRlcmVkOiB0YWJsZS5za2lwQ291bnQgPyBmYWtlQ291bnQgOiBjdXJyZW50Q291bnRcbiAgICB9O1xuXG4gICAgaWYgKHJlY29yZFJlYWR5KSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdjaGFuZ2VkJywgdGFibGVOYW1lLCByZWNvcmQpO1xuICAgICAgdGhpcy5jaGFuZ2VkKCd0YWJ1bGFyX3JlY29yZHMnLCB0YWJsZU5hbWUsIHJlY29yZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vY29uc29sZS5sb2coJ2FkZGVkJywgdGFibGVOYW1lLCByZWNvcmQpO1xuICAgICAgdGhpcy5hZGRlZCgndGFidWxhcl9yZWNvcmRzJywgdGFibGVOYW1lLCByZWNvcmQpO1xuICAgICAgcmVjb3JkUmVhZHkgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0YWJsZS50aHJvdHRsZVJlZnJlc2gpIHtcbiAgICAvLyBXaHkgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudD8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbGRlZWQvbWV0ZW9yLXRhYnVsYXIvaXNzdWVzLzI3OCNpc3N1ZWNvbW1lbnQtMjE3MzE4MTEyXG4gICAgdXBkYXRlUmVjb3JkcyA9IF8udGhyb3R0bGUoTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCh1cGRhdGVSZWNvcmRzKSwgdGFibGUudGhyb3R0bGVSZWZyZXNoKTtcbiAgfVxuXG4gIHVwZGF0ZVJlY29yZHMoKTtcblxuICB0aGlzLnJlYWR5KCk7XG5cbiAgLy8gSGFuZGxlIGRvY3MgYmVpbmcgYWRkZWQgb3IgcmVtb3ZlZCBmcm9tIHRoZSByZXN1bHQgc2V0LlxuICBsZXQgaW5pdGlhbGl6aW5nID0gdHJ1ZTtcbiAgY29uc3QgaGFuZGxlID0gZmlsdGVyZWRDdXJzb3Iub2JzZXJ2ZUNoYW5nZXMoe1xuICAgIGFkZGVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpbml0aWFsaXppbmcpIHJldHVybjtcblxuICAgICAgLy9jb25zb2xlLmxvZygnQURERUQnKTtcbiAgICAgIGZpbHRlcmVkUmVjb3JkSWRzLnB1c2goaWQpO1xuICAgICAgdXBkYXRlUmVjb3JkcygpO1xuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdSRU1PVkVEJyk7XG4gICAgICAvLyBfLmZpbmRXaGVyZSBpcyB1c2VkIHRvIHN1cHBvcnQgTW9uZ28gT2JqZWN0SURzXG4gICAgICBmaWx0ZXJlZFJlY29yZElkcyA9IF8ud2l0aG91dChmaWx0ZXJlZFJlY29yZElkcywgXy5maW5kV2hlcmUoZmlsdGVyZWRSZWNvcmRJZHMsIGlkKSk7XG4gICAgICB1cGRhdGVSZWNvcmRzKCk7XG4gICAgfVxuICB9KTtcbiAgaW5pdGlhbGl6aW5nID0gZmFsc2U7XG5cbiAgLy8gSXQgaXMgdG9vIGluZWZmaWNpZW50IHRvIHVzZSBhbiBvYnNlcnZlIHdpdGhvdXQgYW55IGxpbWl0cyB0byB0cmFjayBjb3VudCBwZXJmZWN0bHlcbiAgLy8gYWNjdXJhdGVseSB3aGVuLCBmb3IgZXhhbXBsZSwgdGhlIHNlbGVjdG9yIGlzIHt9IGFuZCB0aGVyZSBhcmUgYSBtaWxsaW9uIGRvY3VtZW50cy5cbiAgLy8gSW5zdGVhZCB3ZSB3aWxsIHVwZGF0ZSB0aGUgY291bnQgZXZlcnkgMTAgc2Vjb25kcywgaW4gYWRkaXRpb24gdG8gd2hlbmV2ZXIgdGhlIGxpbWl0ZWRcbiAgLy8gcmVzdWx0IHNldCBjaGFuZ2VzLlxuICBjb25zdCBpbnRlcnZhbCA9IE1ldGVvci5zZXRJbnRlcnZhbCh1cGRhdGVSZWNvcmRzLCAxMDAwMCk7XG5cbiAgLy8gU3RvcCBvYnNlcnZpbmcgdGhlIGN1cnNvcnMgd2hlbiBjbGllbnQgdW5zdWJzLlxuICAvLyBTdG9wcGluZyBhIHN1YnNjcmlwdGlvbiBhdXRvbWF0aWNhbGx5IHRha2VzXG4gIC8vIGNhcmUgb2Ygc2VuZGluZyB0aGUgY2xpZW50IGFueSByZW1vdmVkIG1lc3NhZ2VzLlxuICB0aGlzLm9uU3RvcCgoKSA9PiB7XG4gICAgTWV0ZW9yLmNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgIGhhbmRsZS5zdG9wKCk7XG4gIH0pO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRhYnVsYXI7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcblxuY29uc3QgVGFidWxhciA9IHt9O1xuXG5UYWJ1bGFyLnRhYmxlc0J5TmFtZSA9IHt9O1xuXG5UYWJ1bGFyLlRhYmxlID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYnVsYXIuVGFibGUgb3B0aW9ucyBhcmd1bWVudCBpcyByZXF1aXJlZCcpO1xuICAgIGlmICghb3B0aW9ucy5uYW1lKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYnVsYXIuVGFibGUgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuICAgIGlmICghb3B0aW9ucy5jb2x1bW5zKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYnVsYXIuVGFibGUgb3B0aW9ucyBtdXN0IHNwZWNpZnkgY29sdW1ucycpO1xuICAgIGlmICghKG9wdGlvbnMuY29sbGVjdGlvbiBpbnN0YW5jZW9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICAgIHx8IG9wdGlvbnMuY29sbGVjdGlvbiBpbnN0YW5jZW9mIE1vbmdvLmNvbnN0cnVjdG9yIC8vIEZpeDogZXJyb3IgaWYgYGNvbGxlY3Rpb246IE1ldGVvci51c2Vyc2BcbiAgICApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYnVsYXIuVGFibGUgb3B0aW9ucyBtdXN0IHNwZWNpZnkgY29sbGVjdGlvbicpO1xuICAgIH1cblxuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb247XG5cbiAgICB0aGlzLnB1YiA9IG9wdGlvbnMucHViIHx8ICd0YWJ1bGFyX2dlbmVyaWNQdWInO1xuXG4gICAgLy8gQnkgZGVmYXVsdCB3ZSB1c2UgY29yZSBgTWV0ZW9yLnN1YnNjcmliZWAsIGJ1dCB5b3UgY2FuIHBhc3NcbiAgICAvLyBhIHN1YnNjcmlwdGlvbiBtYW5hZ2VyIGxpa2UgYHN1YjogbmV3IFN1YnNNYW5hZ2VyKHtjYWNoZUxpbWl0OiAyMCwgZXhwaXJlSW46IDN9KWBcbiAgICB0aGlzLnN1YiA9IG9wdGlvbnMuc3ViIHx8IE1ldGVvcjtcblxuICAgIHRoaXMub25VbmxvYWQgPSBvcHRpb25zLm9uVW5sb2FkO1xuICAgIHRoaXMuYWxsb3cgPSBvcHRpb25zLmFsbG93O1xuICAgIHRoaXMuYWxsb3dGaWVsZHMgPSBvcHRpb25zLmFsbG93RmllbGRzO1xuICAgIHRoaXMuY2hhbmdlU2VsZWN0b3IgPSBvcHRpb25zLmNoYW5nZVNlbGVjdG9yO1xuICAgIHRoaXMudGhyb3R0bGVSZWZyZXNoID0gb3B0aW9ucy50aHJvdHRsZVJlZnJlc2g7XG4gICAgdGhpcy5hbHRlcm5hdGl2ZUNvdW50ID0gb3B0aW9ucy5hbHRlcm5hdGl2ZUNvdW50O1xuICAgIHRoaXMuc2tpcENvdW50ID0gb3B0aW9ucy5za2lwQ291bnQ7XG5cbiAgICBpZiAoXy5pc0FycmF5KG9wdGlvbnMuZXh0cmFGaWVsZHMpKSB7XG4gICAgICBjb25zdCBmaWVsZHMgPSB7fTtcbiAgICAgIF8uZWFjaChvcHRpb25zLmV4dHJhRmllbGRzLCBmaWVsZE5hbWUgPT4ge1xuICAgICAgICBmaWVsZHNbZmllbGROYW1lXSA9IDE7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZXh0cmFGaWVsZHMgPSBmaWVsZHM7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RvciA9IG9wdGlvbnMuc2VsZWN0b3I7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBfLm9taXQoXG4gICAgICBvcHRpb25zLFxuICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgJ3B1YicsXG4gICAgICAnc3ViJyxcbiAgICAgICdvblVubG9hZCcsXG4gICAgICAnYWxsb3cnLFxuICAgICAgJ2FsbG93RmllbGRzJyxcbiAgICAgICdjaGFuZ2VTZWxlY3RvcicsXG4gICAgICAndGhyb3R0bGVSZWZyZXNoJyxcbiAgICAgICdleHRyYUZpZWxkcycsXG4gICAgICAnYWx0ZXJuYXRpdmVDb3VudCcsXG4gICAgICAnc2tpcENvdW50JyxcbiAgICAgICduYW1lJyxcbiAgICAgICdzZWxlY3RvcidcbiAgICApO1xuXG4gICAgVGFidWxhci50YWJsZXNCeU5hbWVbdGhpcy5uYW1lXSA9IHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGFidWxhcjtcbiJdfQ==
