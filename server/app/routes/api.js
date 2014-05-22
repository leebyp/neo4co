'use strict';

// ## Module Dependencies
var crypto = require('crypto');
var passport =require('passport');

var generateState = function (sessionID) {
  var state = '';
  var shasum = crypto.createHash('sha1');
  
  // generate the state
  shasum.update(sessionID);
  state = shasum.digest('hex');

  return state;
};

module.exports = function (server) {
  
  server.get('/auth/linkedin', function (req, res, next) {

    var state = generateState(req.sessionID);

    // save state to session
    req.session.state = state;

    passport.authenticate('linkedin', {
      state: state
    })(req, res, next);
  });
  

  server.get('/auth/linkedin/callback', function (req, res, next) {

    // Check state before auth redirect to prevent CRSF
    if (req.query.state === req.session.state) {
      passport.authenticate('linkedin', {
        successRedirect: '/',
        failureRedirect: '/login'
      })(req, res, next);
    }
  });
};