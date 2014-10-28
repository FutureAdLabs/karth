var db = require('mysql-promise')();

var datetime;

function getCurrentDateTime() {
  var now = new Date();
  return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + 
      now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds();
}

function getNewEvents(callback){
  var query = "SELECT * FROM events WHERE date_time > '" + datetime  + "';"
  
  db.query(query)
  .spread(function(events) {
    callback(null, events);
    datetime = getCurrentDateTime();
  })
  .catch(callback);
}

exports.stream = function(config, observer) {
  datetime = getCurrentDateTime();

  db.configure({
    "connectionLimit" : config.mysql.connectionLimit,
    "host": config.mysql.host,
    "user": config.mysql.user,
    "password": config.mysql.password,
    "database": config.mysql.database
  });

  var interval = config.checkInterval || 3000;

  setInterval(function() {
    getNewEvents(function(err, events) {
      if(err) {
          observer.onError(err);
      } else {
          events.forEach(function(event) {
              observer.onNext(event);
          });
      }
    });
  }, interval);

  // dispose function
  return function() {};
};