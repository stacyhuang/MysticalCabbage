var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AuthConstants = require('../constants/AuthConstants');
var objectAssign = require('object-assign');
var Firebase = require('firebase');
var Q = require('q');

var CHANGE_EVENT = 'change';

// set ref to firebase database
var rootRef = new Firebase(AuthConstants.DB);
var teacherRef = rootRef.child('teachers');

// log out user
// confirms if firebase auth data was removed from local storage
var logout = function() {
  rootRef.unauth();
  
  if(!checkAuth()){
    console.log('sucessfully logged out');
  } else {
    console.error('Error logging out')
  }
};

// check if a user is logged in
// returns firebase authentication data
var checkAuth = function(){
  return rootRef.getAuth();
};

var AuthStore = objectAssign({}, EventEmitter.prototype);
AuthStore.user = null;
AuthStore._loggedIn = null;

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case AuthConstants.SIGNUP:
      AuthStore._user = action.data;
      AuthStore._loggedIn = action.loggedIn;
      this.emit('change');
      break;
    case AuthConstants.LOGIN:
      // login(action.data);
      AuthStore._user = action.data;
      AuthStore._loggedIn = action.loggedIn;
      this.emit('change');
      break;
    case AuthConstants.LOGOUT:
      logout();
      break;
    default:
      return true;
  }
});

AuthStore.isLoggedIn = function() {
  return !!AuthStore._loggedIn;
};

AuthStore.addChangeListener = function(cb) {
  this.on('change', cb)
};

AuthStore.removeChangeListener = function(cb) {
  this.removeListener('change', cb);
}

module.exports = AuthStore;

