(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Accounts = Package['accounts-base'].Accounts;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare, UserStatus, StatusInternals;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/mizzao_user-status/status.coffee.js                                                               //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/*
  Apparently, the new api.export takes care of issues here. No need to attach to global namespace.
  See http://shiggyenterprises.wordpress.com/2013/09/09/meteor-packages-in-coffeescript-0-6-5/

  We may want to make UserSessions a server collection to take advantage of indices.
  Will implement if someone has enough online users to warrant it.
 */
var UserConnections, activeSession, addSession, idleSession, loginSession, onStartup, removeSession, statusEvents, tryLogoutSession;                             

UserConnections = new Mongo.Collection("user_status_sessions", {
  connection: null
});

statusEvents = new (Npm.require('events').EventEmitter)();


/*
  Multiplex login/logout events to status.online

  'online' field is "true" if user is online, and "false" otherwise

  'idle' field is tri-stated:
  - "true" if user is online and not idle
  - "false" if user is online and idle
  - null if user is offline
 */

statusEvents.on("connectionLogin", function(advice) {
  var conns, update;
  update = {
    $set: {
      'status.online': true,
      'status.lastLogin': {
        date: advice.loginTime,
        ipAddr: advice.ipAddr,
        userAgent: advice.userAgent
      }
    }
  };
  conns = UserConnections.find({
    userId: advice.userId
  }).fetch();
  if (!_.every(conns, function(c) {
    return c.idle;
  })) {
    update.$set['status.idle'] = false;
    update.$unset = {
      'status.lastActivity': null
    };
  }
  Meteor.users.update(advice.userId, update);
});

statusEvents.on("connectionLogout", function(advice) {
  var conns;
  conns = UserConnections.find({
    userId: advice.userId
  }).fetch();
  if (conns.length === 0) {
    Meteor.users.update(advice.userId, {
      $set: {
        'status.online': false
      },
      $unset: {
        'status.idle': null,
        'status.lastActivity': null
      }
    });
  } else if (_.every(conns, function(c) {
    return c.idle;
  })) {

    /*
      All remaining connections are idle:
      - If the last active connection quit, then we should go idle with the most recent activity
    
      - If an idle connection quit, nothing should happen; specifically, if the
        most recently active idle connection quit, we shouldn't tick the value backwards.
        This may result in a no-op so we can be smart and skip the update.
     */
    if (advice.lastActivity != null) {
      return;
    }
    Meteor.users.update(advice.userId, {
      $set: {
        'status.idle': true,
        'status.lastActivity': _.max(_.pluck(conns, "lastActivity"))
      }
    });
  }
});


/*
  Multiplex idle/active events to status.idle
  TODO: Hopefully this is quick because it's all in memory, but we can use indices if it turns out to be slow

  TODO: There is a race condition when switching between tabs, leaving the user inactive while idle goes from one tab to the other.
  It can probably be smoothed out.
 */

statusEvents.on("connectionIdle", function(advice) {
  var conns;
  conns = UserConnections.find({
    userId: advice.userId
  }).fetch();
  if (!_.every(conns, function(c) {
    return c.idle;
  })) {
    return;
  }
  Meteor.users.update(advice.userId, {
    $set: {
      'status.idle': true,
      'status.lastActivity': _.max(_.pluck(conns, "lastActivity"))
    }
  });
});

statusEvents.on("connectionActive", function(advice) {
  Meteor.users.update(advice.userId, {
    $set: {
      'status.idle': false
    },
    $unset: {
      'status.lastActivity': null
    }
  });
});

onStartup = function(selector) {
  if (selector == null) {
    selector = {};
  }
  return Meteor.users.update(selector, {
    $set: {
      "status.online": false
    },
    $unset: {
      "status.idle": null,
      "status.lastActivity": null
    }
  }, {
    multi: true
  });
};


/*
  Local session modifification functions - also used in testing
 */

addSession = function(connection) {
  UserConnections.upsert(connection.id, {
    $set: {
      ipAddr: connection.clientAddress,
      userAgent: connection.httpHeaders['user-agent']
    }
  });
};

loginSession = function(connection, date, userId) {
  UserConnections.upsert(connection.id, {
    $set: {
      userId: userId,
      loginTime: date
    }
  });
  statusEvents.emit("connectionLogin", {
    userId: userId,
    connectionId: connection.id,
    ipAddr: connection.clientAddress,
    userAgent: connection.httpHeaders['user-agent'],
    loginTime: date
  });
};

tryLogoutSession = function(connection, date) {
  var conn;
  if ((conn = UserConnections.findOne({
    _id: connection.id,
    userId: {
      $exists: true
    }
  })) == null) {
    return false;
  }
  UserConnections.upsert(connection.id, {
    $unset: {
      userId: null,
      loginTime: null
    }
  });
  return statusEvents.emit("connectionLogout", {
    userId: conn.userId,
    connectionId: connection.id,
    lastActivity: conn.lastActivity,
    logoutTime: date
  });
};

removeSession = function(connection, date) {
  tryLogoutSession(connection, date);
  UserConnections.remove(connection.id);
};

idleSession = function(connection, date, userId) {
  UserConnections.update(connection.id, {
    $set: {
      idle: true,
      lastActivity: date
    }
  });
  statusEvents.emit("connectionIdle", {
    userId: userId,
    connectionId: connection.id,
    lastActivity: date
  });
};

activeSession = function(connection, date, userId) {
  UserConnections.update(connection.id, {
    $set: {
      idle: false
    },
    $unset: {
      lastActivity: null
    }
  });
  statusEvents.emit("connectionActive", {
    userId: userId,
    connectionId: connection.id,
    lastActivity: date
  });
};


/*
  Handlers for various client-side events
 */

Meteor.startup(onStartup);

Meteor.onConnection(function(connection) {
  addSession(connection);
  return connection.onClose(function() {
    return removeSession(connection, new Date());
  });
});

Accounts.onLogin(function(info) {
  return loginSession(info.connection, new Date(), info.user._id);
});

Meteor.publish(null, function() {
  if (this._session == null) {
    return [];
  }
  if (this.userId == null) {
    tryLogoutSession(this._session.connectionHandle, new Date());
  }
  return [];
});

Meteor.methods({
  "user-status-idle": function(timestamp) {
    var date;
    check(timestamp, Match.OneOf(null, void 0, Date, Number));
    date = timestamp != null ? new Date(timestamp) : new Date();
    idleSession(this.connection, date, this.userId);
  },
  "user-status-active": function(timestamp) {
    var date;
    check(timestamp, Match.OneOf(null, void 0, Date, Number));
    date = timestamp != null ? new Date(timestamp) : new Date();
    activeSession(this.connection, date, this.userId);
  }
});

UserStatus = {
  connections: UserConnections,
  events: statusEvents
};

StatusInternals = {
  onStartup: onStartup,
  addSession: addSession,
  removeSession: removeSession,
  loginSession: loginSession,
  tryLogoutSession: tryLogoutSession,
  idleSession: idleSession,
  activeSession: activeSession
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("mizzao:user-status", {
  UserStatus: UserStatus,
  StatusInternals: StatusInternals
});

})();

//# sourceURL=meteor://💻app/packages/mizzao_user-status.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWl6emFvX3VzZXItc3RhdHVzL3N0YXR1cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7Ozs7OztHQUFBO0FBQUE7O0FBQUEsZUFPQSxHQUFzQixTQUFLLENBQUMsVUFBTixDQUFpQixzQkFBakIsRUFBeUM7QUFBQSxFQUFFLFlBQVksSUFBZDtDQUF6QyxDQVB0Qjs7QUFBQSxZQVNBLEdBQW1CLEtBQUMsR0FBRyxDQUFDLE9BQUosQ0FBWSxRQUFaLENBQXFCLENBQUMsWUFBdkIsR0FUbkI7O0FBV0E7QUFBQTs7Ozs7Ozs7O0dBWEE7O0FBQUEsWUFxQlksQ0FBQyxFQUFiLENBQWdCLGlCQUFoQixFQUFtQyxTQUFDLE1BQUQ7QUFDakM7QUFBQSxXQUNFO0FBQUEsVUFBTTtBQUFBLE1BQ0osaUJBQWlCLElBRGI7QUFBQSxNQUVKLG9CQUFvQjtBQUFBLFFBQ2xCLE1BQU0sTUFBTSxDQUFDLFNBREs7QUFBQSxRQUVsQixRQUFRLE1BQU0sQ0FBQyxNQUZHO0FBQUEsUUFHbEIsV0FBVyxNQUFNLENBQUMsU0FIQTtPQUZoQjtLQUFOO0dBREY7QUFBQSxFQVlBLFFBQVEsZUFBZSxDQUFDLElBQWhCLENBQXFCO0FBQUEsWUFBUSxNQUFNLENBQUMsTUFBZjtHQUFyQixDQUEyQyxDQUFDLEtBQTVDLEVBWlI7QUFhQSxRQUFRLENBQUMsS0FBRixDQUFRLEtBQVIsRUFBZSxTQUFDLENBQUQ7V0FBTyxDQUFDLENBQUMsS0FBVDtFQUFBLENBQWYsQ0FBUDtBQUNFLFVBQU0sQ0FBQyxJQUFLLGVBQVosR0FBNkIsS0FBN0I7QUFBQSxJQUNBLE1BQU0sQ0FBQyxNQUFQLEdBQ0U7QUFBQSw2QkFBdUIsSUFBdkI7S0FGRixDQURGO0dBYkE7QUFBQSxFQW1CQSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQWIsQ0FBb0IsTUFBTSxDQUFDLE1BQTNCLEVBQW1DLE1BQW5D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Z0I7QUFBQSxFQUloQiwwQkFKZ0I7QUFBQSxFQUtoQixrQ0FMZ0I7QUFBQSxFQU1oQix3QkFOZ0I7QUFBQSxFQU9oQiw0QkFQZ0I7Q0FwUGxCIiwiZmlsZSI6Ii9wYWNrYWdlcy9taXp6YW9fdXNlci1zdGF0dXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiAgQXBwYXJlbnRseSwgdGhlIG5ldyBhcGkuZXhwb3J0IHRha2VzIGNhcmUgb2YgaXNzdWVzIGhlcmUuIE5vIG5lZWQgdG8gYXR0YWNoIHRvIGdsb2JhbCBuYW1lc3BhY2UuXG4gIFNlZSBodHRwOi8vc2hpZ2d5ZW50ZXJwcmlzZXMud29yZHByZXNzLmNvbS8yMDEzLzA5LzA5L21ldGVvci1wYWNrYWdlcy1pbi1jb2ZmZWVzY3JpcHQtMC02LTUvXG5cbiAgV2UgbWF5IHdhbnQgdG8gbWFrZSBVc2VyU2Vzc2lvbnMgYSBzZXJ2ZXIgY29sbGVjdGlvbiB0byB0YWtlIGFkdmFudGFnZSBvZiBpbmRpY2VzLlxuICBXaWxsIGltcGxlbWVudCBpZiBzb21lb25lIGhhcyBlbm91Z2ggb25saW5lIHVzZXJzIHRvIHdhcnJhbnQgaXQuXG4jIyNcblVzZXJDb25uZWN0aW9ucyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKFwidXNlcl9zdGF0dXNfc2Vzc2lvbnNcIiwgeyBjb25uZWN0aW9uOiBudWxsIH0pXG5cbnN0YXR1c0V2ZW50cyA9IG5ldyAoTnBtLnJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcikoKVxuXG4jIyNcbiAgTXVsdGlwbGV4IGxvZ2luL2xvZ291dCBldmVudHMgdG8gc3RhdHVzLm9ubGluZVxuXG4gICdvbmxpbmUnIGZpZWxkIGlzIFwidHJ1ZVwiIGlmIHVzZXIgaXMgb25saW5lLCBhbmQgXCJmYWxzZVwiIG90aGVyd2lzZVxuXG4gICdpZGxlJyBmaWVsZCBpcyB0cmktc3RhdGVkOlxuICAtIFwidHJ1ZVwiIGlmIHVzZXIgaXMgb25saW5lIGFuZCBub3QgaWRsZVxuICAtIFwiZmFsc2VcIiBpZiB1c2VyIGlzIG9ubGluZSBhbmQgaWRsZVxuICAtIG51bGwgaWYgdXNlciBpcyBvZmZsaW5lXG4jIyNcbnN0YXR1c0V2ZW50cy5vbiBcImNvbm5lY3Rpb25Mb2dpblwiLCAoYWR2aWNlKSAtPlxuICB1cGRhdGUgPVxuICAgICRzZXQ6IHtcbiAgICAgICdzdGF0dXMub25saW5lJzogdHJ1ZSxcbiAgICAgICdzdGF0dXMubGFzdExvZ2luJzoge1xuICAgICAgICBkYXRlOiBhZHZpY2UubG9naW5UaW1lXG4gICAgICAgIGlwQWRkcjogYWR2aWNlLmlwQWRkclxuICAgICAgICB1c2VyQWdlbnQ6IGFkdmljZS51c2VyQWdlbnRcbiAgICAgIH1cbiAgICB9XG5cbiAgIyB1bmxlc3MgQUxMIGV4aXN0aW5nIGNvbm5lY3Rpb25zIGFyZSBpZGxlIChpbmNsdWRpbmcgdGhpcyBuZXcgb25lKSxcbiAgIyB0aGUgdXNlciBjb25uZWN0aW9uIGJlY29tZXMgYWN0aXZlLlxuICBjb25ucyA9IFVzZXJDb25uZWN0aW9ucy5maW5kKHVzZXJJZDogYWR2aWNlLnVzZXJJZCkuZmV0Y2goKVxuICB1bmxlc3MgXy5ldmVyeShjb25ucywgKGMpIC0+IGMuaWRsZSlcbiAgICB1cGRhdGUuJHNldFsnc3RhdHVzLmlkbGUnXSA9IGZhbHNlXG4gICAgdXBkYXRlLiR1bnNldCA9XG4gICAgICAnc3RhdHVzLmxhc3RBY3Rpdml0eSc6IG51bGxcbiAgIyBpbiBvdGhlciBjYXNlLCBpZGxlIGZpZWxkIHJlbWFpbnMgdHJ1ZSBhbmQgbm8gdXBkYXRlIHRvIGxhc3RBY3Rpdml0eS5cblxuICBNZXRlb3IudXNlcnMudXBkYXRlIGFkdmljZS51c2VySWQsIHVwZGF0ZVxuICByZXR1cm5cblxuc3RhdHVzRXZlbnRzLm9uIFwiY29ubmVjdGlvbkxvZ291dFwiLCAoYWR2aWNlKSAtPlxuICBjb25ucyA9IFVzZXJDb25uZWN0aW9ucy5maW5kKHVzZXJJZDogYWR2aWNlLnVzZXJJZCkuZmV0Y2goKVxuICBpZiBjb25ucy5sZW5ndGggaXMgMFxuICAgICMgR28gb2ZmbGluZSBpZiB3ZSBhcmUgdGhlIGxhc3QgY29ubmVjdGlvbiBmb3IgdGhpcyB1c2VyXG4gICAgIyBUaGlzIGluY2x1ZGVzIHJlbW92aW5nIGFsbCBpZGxlIGluZm9ybWF0aW9uXG4gICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSBhZHZpY2UudXNlcklkLFxuICAgICAgJHNldDogeydzdGF0dXMub25saW5lJzogZmFsc2UgfVxuICAgICAgJHVuc2V0OlxuICAgICAgICAnc3RhdHVzLmlkbGUnOiBudWxsXG4gICAgICAgICdzdGF0dXMubGFzdEFjdGl2aXR5JzogbnVsbFxuICBlbHNlIGlmIF8uZXZlcnkoY29ubnMsIChjKSAtPiBjLmlkbGUpXG4gICAgIyMjXG4gICAgICBBbGwgcmVtYWluaW5nIGNvbm5lY3Rpb25zIGFyZSBpZGxlOlxuICAgICAgLSBJZiB0aGUgbGFzdCBhY3RpdmUgY29ubmVjdGlvbiBxdWl0LCB0aGVuIHdlIHNob3VsZCBnbyBpZGxlIHdpdGggdGhlIG1vc3QgcmVjZW50IGFjdGl2aXR5XG5cbiAgICAgIC0gSWYgYW4gaWRsZSBjb25uZWN0aW9uIHF1aXQsIG5vdGhpbmcgc2hvdWxkIGhhcHBlbjsgc3BlY2lmaWNhbGx5LCBpZiB0aGVcbiAgICAgICAgbW9zdCByZWNlbnRseSBhY3RpdmUgaWRsZSBjb25uZWN0aW9uIHF1aXQsIHdlIHNob3VsZG4ndCB0aWNrIHRoZSB2YWx1ZSBiYWNrd2FyZHMuXG4gICAgICAgIFRoaXMgbWF5IHJlc3VsdCBpbiBhIG5vLW9wIHNvIHdlIGNhbiBiZSBzbWFydCBhbmQgc2tpcCB0aGUgdXBkYXRlLlxuICAgICMjI1xuICAgIHJldHVybiBpZiBhZHZpY2UubGFzdEFjdGl2aXR5PyAjIFRoZSBkcm9wcGVkIGNvbm5lY3Rpb24gd2FzIGFscmVhZHkgaWRsZVxuXG4gICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSBhZHZpY2UudXNlcklkLFxuICAgICAgJHNldDpcbiAgICAgICAgJ3N0YXR1cy5pZGxlJzogdHJ1ZVxuICAgICAgICAnc3RhdHVzLmxhc3RBY3Rpdml0eSc6IF8ubWF4KF8ucGx1Y2sgY29ubnMsIFwibGFzdEFjdGl2aXR5XCIpXG4gIHJldHVyblxuXG4jIyNcbiAgTXVsdGlwbGV4IGlkbGUvYWN0aXZlIGV2ZW50cyB0byBzdGF0dXMuaWRsZVxuICBUT0RPOiBIb3BlZnVsbHkgdGhpcyBpcyBxdWljayBiZWNhdXNlIGl0J3MgYWxsIGluIG1lbW9yeSwgYnV0IHdlIGNhbiB1c2UgaW5kaWNlcyBpZiBpdCB0dXJucyBvdXQgdG8gYmUgc2xvd1xuXG4gIFRPRE86IFRoZXJlIGlzIGEgcmFjZSBjb25kaXRpb24gd2hlbiBzd2l0Y2hpbmcgYmV0d2VlbiB0YWJzLCBsZWF2aW5nIHRoZSB1c2VyIGluYWN0aXZlIHdoaWxlIGlkbGUgZ29lcyBmcm9tIG9uZSB0YWIgdG8gdGhlIG90aGVyLlxuICBJdCBjYW4gcHJvYmFibHkgYmUgc21vb3RoZWQgb3V0LlxuIyMjXG5zdGF0dXNFdmVudHMub24gXCJjb25uZWN0aW9uSWRsZVwiLCAoYWR2aWNlKSAtPlxuICBjb25ucyA9IFVzZXJDb25uZWN0aW9ucy5maW5kKHVzZXJJZDogYWR2aWNlLnVzZXJJZCkuZmV0Y2goKVxuICByZXR1cm4gdW5sZXNzIF8uZXZlcnkoY29ubnMsIChjKSAtPiBjLmlkbGUpXG4gICMgU2V0IHVzZXIgdG8gaWRsZSBpZiBhbGwgdGhlIGNvbm5lY3Rpb25zIGFyZSBpZGxlXG4gICMgVGhpcyB3aWxsIG5vdCBiZSB0aGUgbW9zdCByZWNlbnQgaWRsZSBhY3Jvc3MgYSBkaXNjb25uZWN0aW9uLCBzbyB3ZSB1c2UgbWF4XG5cbiAgIyBUT0RPOiB0aGUgcmFjZSBoYXBwZW5zIGhlcmUgd2hlcmUgZXZlcnlvbmUgd2FzIGlkbGUgd2hlbiB3ZSBsb29rZWQgZm9yIHRoZW0gYnV0IG5vdyBvbmUgb2YgdGhlbSBpc24ndC5cbiAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSBhZHZpY2UudXNlcklkLFxuICAgICRzZXQ6XG4gICAgICAnc3RhdHVzLmlkbGUnOiB0cnVlXG4gICAgICAnc3RhdHVzLmxhc3RBY3Rpdml0eSc6IF8ubWF4KF8ucGx1Y2sgY29ubnMsIFwibGFzdEFjdGl2aXR5XCIpXG4gIHJldHVyblxuXG5zdGF0dXNFdmVudHMub24gXCJjb25uZWN0aW9uQWN0aXZlXCIsIChhZHZpY2UpIC0+XG4gIE1ldGVvci51c2Vycy51cGRhdGUgYWR2aWNlLnVzZXJJZCxcbiAgICAkc2V0OlxuICAgICAgJ3N0YXR1cy5pZGxlJzogZmFsc2VcbiAgICAkdW5zZXQ6XG4gICAgICAnc3RhdHVzLmxhc3RBY3Rpdml0eSc6IG51bGxcbiAgcmV0dXJuXG5cbiMgUmVzZXQgb25saW5lIHN0YXR1cyBvbiBzdGFydHVwICh1c2VycyB3aWxsIHJlY29ubmVjdClcbm9uU3RhcnR1cCA9IChzZWxlY3RvciA9IHt9KSAtPlxuICBNZXRlb3IudXNlcnMudXBkYXRlIHNlbGVjdG9yLFxuICAgIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgXCJzdGF0dXMub25saW5lXCI6IGZhbHNlXG4gICAgICB9LFxuICAgICAgJHVuc2V0OiB7XG4gICAgICAgIFwic3RhdHVzLmlkbGVcIjogbnVsbFxuICAgICAgICBcInN0YXR1cy5sYXN0QWN0aXZpdHlcIjogbnVsbFxuICAgICAgfVxuICAgIH0sXG4gICAgeyBtdWx0aTogdHJ1ZSB9XG5cbiMjI1xuICBMb2NhbCBzZXNzaW9uIG1vZGlmaWZpY2F0aW9uIGZ1bmN0aW9ucyAtIGFsc28gdXNlZCBpbiB0ZXN0aW5nXG4jIyNcblxuYWRkU2Vzc2lvbiA9IChjb25uZWN0aW9uKSAtPlxuICBVc2VyQ29ubmVjdGlvbnMudXBzZXJ0IGNvbm5lY3Rpb24uaWQsXG4gICAgJHNldDoge1xuICAgICAgaXBBZGRyOiBjb25uZWN0aW9uLmNsaWVudEFkZHJlc3NcbiAgICAgIHVzZXJBZ2VudDogY29ubmVjdGlvbi5odHRwSGVhZGVyc1sndXNlci1hZ2VudCddXG4gICAgfVxuICByZXR1cm5cblxubG9naW5TZXNzaW9uID0gKGNvbm5lY3Rpb24sIGRhdGUsIHVzZXJJZCkgLT5cbiAgVXNlckNvbm5lY3Rpb25zLnVwc2VydCBjb25uZWN0aW9uLmlkLFxuICAgICRzZXQ6IHtcbiAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgICBsb2dpblRpbWU6IGRhdGVcbiAgICB9XG5cbiAgc3RhdHVzRXZlbnRzLmVtaXQgXCJjb25uZWN0aW9uTG9naW5cIixcbiAgICB1c2VySWQ6IHVzZXJJZFxuICAgIGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbi5pZFxuICAgIGlwQWRkcjogY29ubmVjdGlvbi5jbGllbnRBZGRyZXNzXG4gICAgdXNlckFnZW50OiBjb25uZWN0aW9uLmh0dHBIZWFkZXJzWyd1c2VyLWFnZW50J11cbiAgICBsb2dpblRpbWU6IGRhdGVcbiAgcmV0dXJuXG5cbiMgUG9zc2libHkgdHJpZ2dlciBhIGxvZ291dCBldmVudCBpZiB0aGlzIGNvbm5lY3Rpb24gd2FzIHByZXZpb3VzbHkgYXNzb2NpYXRlZCB3aXRoIGEgdXNlciBJRFxudHJ5TG9nb3V0U2Vzc2lvbiA9IChjb25uZWN0aW9uLCBkYXRlKSAtPlxuICByZXR1cm4gZmFsc2UgdW5sZXNzIChjb25uID0gVXNlckNvbm5lY3Rpb25zLmZpbmRPbmUoe1xuICAgIF9pZDogY29ubmVjdGlvbi5pZFxuICAgIHVzZXJJZDogeyAkZXhpc3RzOiB0cnVlIH1cbiAgfSkpP1xuXG4gICMgWWVzLCB0aGlzIGlzIGFjdHVhbGx5IGEgdXNlciBsb2dnaW5nIG91dC5cbiAgVXNlckNvbm5lY3Rpb25zLnVwc2VydCBjb25uZWN0aW9uLmlkLFxuICAgICR1bnNldDoge1xuICAgICAgdXNlcklkOiBudWxsXG4gICAgICBsb2dpblRpbWU6IG51bGxcbiAgICB9XG5cbiAgc3RhdHVzRXZlbnRzLmVtaXQgXCJjb25uZWN0aW9uTG9nb3V0XCIsXG4gICAgdXNlcklkOiBjb25uLnVzZXJJZFxuICAgIGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbi5pZFxuICAgIGxhc3RBY3Rpdml0eTogY29ubi5sYXN0QWN0aXZpdHkgIyBJZiB0aGlzIGNvbm5lY3Rpb24gd2FzIGlkbGUsIHBhc3MgdGhlIGxhc3QgYWN0aXZpdHkgd2Ugc2F3XG4gICAgbG9nb3V0VGltZTogZGF0ZVxuXG5yZW1vdmVTZXNzaW9uID0gKGNvbm5lY3Rpb24sIGRhdGUpIC0+XG4gIHRyeUxvZ291dFNlc3Npb24oY29ubmVjdGlvbiwgZGF0ZSlcbiAgVXNlckNvbm5lY3Rpb25zLnJlbW92ZShjb25uZWN0aW9uLmlkKVxuICByZXR1cm5cblxuaWRsZVNlc3Npb24gPSAoY29ubmVjdGlvbiwgZGF0ZSwgdXNlcklkKSAtPlxuICBVc2VyQ29ubmVjdGlvbnMudXBkYXRlIGNvbm5lY3Rpb24uaWQsXG4gICAgJHNldDoge1xuICAgICAgaWRsZTogdHJ1ZVxuICAgICAgbGFzdEFjdGl2aXR5OiBkYXRlXG4gICAgfVxuXG4gIHN0YXR1c0V2ZW50cy5lbWl0IFwiY29ubmVjdGlvbklkbGVcIixcbiAgICB1c2VySWQ6IHVzZXJJZFxuICAgIGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbi5pZFxuICAgIGxhc3RBY3Rpdml0eTogZGF0ZVxuICByZXR1cm5cblxuYWN0aXZlU2Vzc2lvbiA9IChjb25uZWN0aW9uLCBkYXRlLCB1c2VySWQpIC0+XG4gIFVzZXJDb25uZWN0aW9ucy51cGRhdGUgY29ubmVjdGlvbi5pZCxcbiAgICAkc2V0OiB7IGlkbGU6IGZhbHNlIH1cbiAgICAkdW5zZXQ6IHsgbGFzdEFjdGl2aXR5OiBudWxsIH1cblxuICBzdGF0dXNFdmVudHMuZW1pdCBcImNvbm5lY3Rpb25BY3RpdmVcIixcbiAgICB1c2VySWQ6IHVzZXJJZFxuICAgIGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbi5pZFxuICAgIGxhc3RBY3Rpdml0eTogZGF0ZVxuICByZXR1cm5cblxuIyMjXG4gIEhhbmRsZXJzIGZvciB2YXJpb3VzIGNsaWVudC1zaWRlIGV2ZW50c1xuIyMjXG5NZXRlb3Iuc3RhcnR1cChvblN0YXJ0dXApXG5cbiMgT3BlbmluZyBhbmQgY2xvc2luZyBvZiBERFAgY29ubmVjdGlvbnNcbk1ldGVvci5vbkNvbm5lY3Rpb24gKGNvbm5lY3Rpb24pIC0+XG4gIGFkZFNlc3Npb24oY29ubmVjdGlvbilcblxuICBjb25uZWN0aW9uLm9uQ2xvc2UgLT5cbiAgICByZW1vdmVTZXNzaW9uKGNvbm5lY3Rpb24sIG5ldyBEYXRlKCkpXG5cbiMgQXV0aGVudGljYXRpb24gb2YgYSBERFAgY29ubmVjdGlvblxuQWNjb3VudHMub25Mb2dpbiAoaW5mbykgLT5cbiAgbG9naW5TZXNzaW9uKGluZm8uY29ubmVjdGlvbiwgbmV3IERhdGUoKSwgaW5mby51c2VyLl9pZClcblxuIyBwdWIvc3ViIHRyaWNrIGFzIHJlZmVyZW5jZWQgaW4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3EvMTAyNTc5NTgvNTg2MDg2XG4jIFdlIHVzZWQgdGhpcyBpbiB0aGUgcGFzdCwgYnV0IHN0aWxsIG5lZWQgdGhpcyB0byBkZXRlY3QgbG9nb3V0cyBvbiB0aGUgc2FtZSBjb25uZWN0aW9uLlxuTWV0ZW9yLnB1Ymxpc2ggbnVsbCwgLT5cbiAgIyBSZXR1cm4gbnVsbCBleHBsaWNpdGx5IGlmIHRoaXMuX3Nlc3Npb24gaXMgbm90IGF2YWlsYWJsZSwgaS5lLjpcbiAgIyBodHRwczovL2dpdGh1Yi5jb20vYXJ1bm9kYS9tZXRlb3ItZmFzdC1yZW5kZXIvaXNzdWVzLzQxXG4gIHJldHVybiBbXSB1bmxlc3MgQF9zZXNzaW9uP1xuXG4gICMgV2UncmUgaW50ZXJlc3RlZCBpbiBsb2dvdXQgZXZlbnRzIC0gcmUtcHVibGlzaGVzIGZvciB3aGljaCBhIHBhc3QgY29ubmVjdGlvbiBleGlzdHNcbiAgdHJ5TG9nb3V0U2Vzc2lvbihAX3Nlc3Npb24uY29ubmVjdGlvbkhhbmRsZSwgbmV3IERhdGUoKSkgdW5sZXNzIEB1c2VySWQ/XG5cbiAgcmV0dXJuIFtdXG5cbiMgV2UgY2FuIHVzZSB0aGUgY2xpZW50J3MgdGltZXN0YW1wIGhlcmUgYmVjYXVzZSBpdCB3YXMgc2VudCBmcm9tIGEgVGltZVN5bmNcbiMgdmFsdWUsIGhvd2V2ZXIgd2Ugc2hvdWxkIG5ldmVyIHRydXN0IGl0IGZvciBzb21ldGhpbmcgc2VjdXJpdHkgZGVwZW5kZW50LlxuIyBJZiB0aW1lc3RhbXAgaXMgbm90IHByb3ZpZGVkIChwcm9iYWJseSBkdWUgdG8gYSBkZXN5bmMpLCB1c2Ugc2VydmVyIHRpbWUuXG5NZXRlb3IubWV0aG9kc1xuICBcInVzZXItc3RhdHVzLWlkbGVcIjogKHRpbWVzdGFtcCkgLT5cbiAgICBjaGVjayh0aW1lc3RhbXAsIE1hdGNoLk9uZU9mKG51bGwsIHVuZGVmaW5lZCwgRGF0ZSwgTnVtYmVyKSApXG5cbiAgICBkYXRlID0gaWYgdGltZXN0YW1wPyB0aGVuIG5ldyBEYXRlKHRpbWVzdGFtcCkgZWxzZSBuZXcgRGF0ZSgpXG4gICAgaWRsZVNlc3Npb24oQGNvbm5lY3Rpb24sIGRhdGUsIEB1c2VySWQpXG4gICAgcmV0dXJuXG5cbiAgXCJ1c2VyLXN0YXR1cy1hY3RpdmVcIjogKHRpbWVzdGFtcCkgLT5cbiAgICBjaGVjayh0aW1lc3RhbXAsIE1hdGNoLk9uZU9mKG51bGwsIHVuZGVmaW5lZCwgRGF0ZSwgTnVtYmVyKSApXG5cbiAgICAjIFdlIG9ubHkgdXNlIHRpbWVzdGFtcCBiZWNhdXNlIGl0J3Mgd2hlbiB3ZSBzYXcgYWN0aXZpdHkgKm9uIHRoZSBjbGllbnQqXG4gICAgIyBhcyBvcHBvc2VkIHRvIGp1c3QgYmVpbmcgbm90aWZpZWQgaXQuIEl0IGlzIHByb2JhYmx5IG1vcmUgYWNjdXJhdGUgZXZlbiBpZlxuICAgICMgYSBkb3plbiBtcyBvZmYgZHVlIHRvIHRoZSBsYXRlbmN5IG9mIHNlbmRpbmcgaXQgdG8gdGhlIHNlcnZlci5cbiAgICBkYXRlID0gaWYgdGltZXN0YW1wPyB0aGVuIG5ldyBEYXRlKHRpbWVzdGFtcCkgZWxzZSBuZXcgRGF0ZSgpXG4gICAgYWN0aXZlU2Vzc2lvbihAY29ubmVjdGlvbiwgZGF0ZSwgQHVzZXJJZClcbiAgICByZXR1cm5cblxuIyBFeHBvcnRlZCB2YXJpYWJsZVxuVXNlclN0YXR1cyA9XG4gIGNvbm5lY3Rpb25zOiBVc2VyQ29ubmVjdGlvbnNcbiAgZXZlbnRzOiBzdGF0dXNFdmVudHNcblxuIyBJbnRlcm5hbCBmdW5jdGlvbnMsIGV4cG9ydGVkIGZvciB0ZXN0aW5nXG5TdGF0dXNJbnRlcm5hbHMgPSB7XG4gIG9uU3RhcnR1cCxcbiAgYWRkU2Vzc2lvbixcbiAgcmVtb3ZlU2Vzc2lvbixcbiAgbG9naW5TZXNzaW9uLFxuICB0cnlMb2dvdXRTZXNzaW9uLFxuICBpZGxlU2Vzc2lvbixcbiAgYWN0aXZlU2Vzc2lvbixcbn1cbiJdfQ==
