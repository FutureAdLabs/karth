var db = require('mysql-promise')();

var eventDatetime;
var requestDateTime;

var initialised = false;

function getCurrentDateTime() {
  var now = new Date();
  return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + 
      now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds();
}

function getNewEvents(callback){
  var query = "SELECT * FROM events WHERE date_time > '" + eventDatetime  + "';"
  
  db.query(query)
  .spread(function(events) {
    callback(null, events);
    eventDatetime = getCurrentDateTime();
  })
  .catch(callback);
}

function getNewRequests(callback){
  var query = "SELECT * FROM requests WHERE date_time > '" + requestDatetime  + "';"
  
  db.query(query)
  .spread(function(requests) {
    callback(null, requests);
    requestDatetime = getCurrentDateTime();
  })
  .catch(callback);
}

function initialise(config) {
  if(initialised) {
    return;
  }

  db.configure({
    "connectionLimit" : config.mysql.connectionLimit,
    "host": config.mysql.host,
    "user": config.mysql.user,
    "password": config.mysql.password,
    "database": config.mysql.database
  });

  initialised = true;
};

exports.eventStream = function(config, observer) {
  initialise(config);
  eventDatetime = getCurrentDateTime();

  var interval = setInterval(function() {
    getNewEvents(function(err, events) {
      if(err) {
          observer.onError(err);
      } else {
          events.forEach(function(event) {
              observer.onNext(event);
          });
      }
    });
  }, config.checkInterval || 3000);

  // dispose function
  return function() {
    clearInterval(interval);
  };
};

exports.requestStream = function(config, observer) {
  initialise(config);
  requestDatetime = getCurrentDateTime();

  var interval = setInterval(function() {
    getNewRequests(function(err, requests) {
      if(err) {
          observer.onError(err);
      } else {
          requests.forEach(function(request) {
              observer.onNext(request);
          });
      }
    });
  }, config.checkInterval || 3000);

  // dispose function
  return function() {
    clearInterval(interval);
  };
};