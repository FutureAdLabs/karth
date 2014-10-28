var Rx = require('Rx');
var mysql = require('./db/mysql');

function validateConfig(config) {
  if(!config || !config.mysql) {
    return 'Invalid Configuration';
  }

  return null;
}

exports.getSource = function(config) {
  return Rx.Observable.create(function (observer) {
    var invalidConfig = validateConfig(config);
    if(invalidConfig) {
      return observer.onError(invalidConfig);
    }

    if(config.mysql) {
      return mysql.stream(config, observer);
    } else {
      observer.onCompleted();
    }
  });
};